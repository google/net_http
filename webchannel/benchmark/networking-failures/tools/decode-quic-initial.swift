// QUIC client Initial packets only. Uses Apple's CryptoKit/CommonCrypto and
// public Initial secrets from RFC 9001, not TLS application traffic secrets.
import Foundation
import CryptoKit
import CommonCrypto

enum DecodeError: Error { case invalid(String) }
func bytes(_ hex: String) throws -> [UInt8] {
  let text = hex.filter { !$0.isWhitespace }
  guard text.count % 2 == 0 else { throw DecodeError.invalid("odd hex length") }
  var result: [UInt8] = []
  var i = text.startIndex
  while i < text.endIndex {
    let end = text.index(i, offsetBy: 2)
    guard let byte = UInt8(text[i..<end], radix: 16) else { throw DecodeError.invalid("invalid hex") }
    result.append(byte); i = end
  }
  return result
}
func hex(_ data: [UInt8]) -> String { data.map { String(format: "%02x", $0) }.joined() }
func varint(_ data: [UInt8], _ offset: inout Int) throws -> UInt64 {
  guard offset < data.count else { throw DecodeError.invalid("short varint") }
  let count = 1 << Int(data[offset] >> 6)
  guard offset + count <= data.count else { throw DecodeError.invalid("truncated varint") }
  var value = UInt64(data[offset] & 63)
  for byte in data[(offset + 1)..<(offset + count)] { value = (value << 8) | UInt64(byte) }
  offset += count
  return value
}
func hmac(_ key: [UInt8], _ data: [UInt8]) -> [UInt8] {
  Array(HMAC<SHA256>.authenticationCode(for: Data(data), using: SymmetricKey(data: key)))
}
func expand(_ secret: [UInt8], _ label: String, _ count: Int) -> [UInt8] {
  let name = Array(("tls13 " + label).utf8)
  let info = [UInt8(count >> 8), UInt8(count & 255), UInt8(name.count)] + name + [0]
  var output: [UInt8] = [], previous: [UInt8] = [], counter: UInt8 = 1
  while output.count < count {
    previous = hmac(secret, previous + info + [counter]); output += previous; counter += 1
  }
  return Array(output.prefix(count))
}
func aesBlock(_ key: [UInt8], _ sample: [UInt8]) throws -> [UInt8] {
  var output = [UInt8](repeating: 0, count: 16), moved = 0
  let status = key.withUnsafeBytes { k in sample.withUnsafeBytes { input in
    output.withUnsafeMutableBytes { out in
      CCCrypt(CCOperation(kCCEncrypt), CCAlgorithm(kCCAlgorithmAES), CCOptions(kCCOptionECBMode),
              k.baseAddress, key.count, nil, input.baseAddress, 16, out.baseAddress, 16, &moved)
    }
  }}
  guard status == kCCSuccess && moved == 16 else { throw DecodeError.invalid("AES header protection") }
  return output
}
func decode(_ packet: [UInt8]) throws -> [String: Any] {
  guard packet.count > 20 && packet[0] & 0xc0 == 0xc0 else { throw DecodeError.invalid("not long header") }
  let version = packet[1..<5].reduce(UInt32(0)) { ($0 << 8) | UInt32($1) }
  let v2 = version == 0x6b3343cf
  guard version == 1 || v2 else { throw DecodeError.invalid("unsupported QUIC version") }
  guard (packet[0] >> 4) & 3 == (v2 ? 1 : 0) else { throw DecodeError.invalid("not Initial") }
  var offset = 5
  let dcidLength = Int(packet[offset]); offset += 1
  guard dcidLength <= 20 && offset + dcidLength < packet.count else { throw DecodeError.invalid("dcid") }
  let dcid = Array(packet[offset..<(offset + dcidLength)]); offset += dcidLength
  let scidLength = Int(packet[offset]); offset += 1
  guard scidLength <= 20 && offset + scidLength < packet.count else { throw DecodeError.invalid("scid") }
  offset += scidLength
  let tokenLength = try varint(packet, &offset)
  guard tokenLength <= UInt64(packet.count - offset) else { throw DecodeError.invalid("token") }
  offset += Int(tokenLength)
  let length = try varint(packet, &offset)
  guard length <= UInt64(packet.count - offset) else { throw DecodeError.invalid("length") }
  let pnOffset = offset, end = offset + Int(length)
  guard pnOffset + 20 <= end else { throw DecodeError.invalid("header sample") }
  let salt = try bytes(v2 ? "0dede3def700a6db819381be6e269dcbf9bd2ed9" : "38762cf7f55934b34d179ae6a4c80cadccbb7f0a")
  let secret = expand(hmac(salt, dcid), "client in", 32)
  let prefix = v2 ? "quicv2" : "quic"
  let key = expand(secret, prefix + " key", 16)
  var nonce = expand(secret, prefix + " iv", 12)
  let hp = expand(secret, prefix + " hp", 16)
  let mask = try aesBlock(hp, Array(packet[(pnOffset + 4)..<(pnOffset + 20)]))
  var header = Array(packet[0..<pnOffset])
  header[0] ^= mask[0] & 15
  let pnLength = Int(header[0] & 3) + 1
  var number: UInt64 = 0
  for i in 0..<pnLength {
    let byte = packet[pnOffset + i] ^ mask[i + 1]
    header.append(byte); number = (number << 8) | UInt64(byte)
  }
  // Client Initial numbers in these captures are small. Authentication fails
  // rather than guessing if truncated packet numbers need reconstruction.
  for i in 0..<8 { nonce[11-i] ^= UInt8((number >> (8*i)) & 255) }
  let start = pnOffset + pnLength
  guard start + 16 <= end else { throw DecodeError.invalid("ciphertext") }
  let box = try AES.GCM.SealedBox(nonce: AES.GCM.Nonce(data: Data(nonce)),
      ciphertext: Data(packet[start..<(end-16)]), tag: Data(packet[(end-16)..<end]))
  let plaintext = Array(try AES.GCM.open(box, using: SymmetricKey(data: key), authenticating: Data(header)))
  var p = 0, crypto: [[String: Any]] = [], types: [UInt64] = []
  while p < plaintext.count {
    let type = try varint(plaintext, &p)
    if type == 0 { continue }
    types.append(type)
    if type == 1 { continue }
    if type == 2 || type == 3 {
      _ = try varint(plaintext, &p); _ = try varint(plaintext, &p)
      let ranges = try varint(plaintext, &p); _ = try varint(plaintext, &p)
      guard ranges < 10000 else { throw DecodeError.invalid("ack ranges") }
      for _ in 0..<Int(ranges) { _ = try varint(plaintext, &p); _ = try varint(plaintext, &p) }
      if type == 3 { for _ in 0..<3 { _ = try varint(plaintext, &p) } }
    } else if type == 6 {
      let position = try varint(plaintext, &p), count = try varint(plaintext, &p)
      guard count <= UInt64(plaintext.count-p) else { throw DecodeError.invalid("crypto frame") }
      crypto.append(["offset": position, "hex": hex(Array(plaintext[p..<(p+Int(count))]))]); p += Int(count)
    } else { break }
  }
  return ["version": version, "dcid": hex(dcid), "packetNumber": number,
          "verifiedAEAD": true, "frameTypes": types, "crypto": crypto]
}
while let line = readLine() {
  do {
    let input = try JSONSerialization.jsonObject(with: Data(line.utf8)) as! [String: Any]
    var result = try decode(bytes(input["payloadHex"] as! String))
    for (key,value) in input where key != "payloadHex" { result[key] = value }
    let data = try JSONSerialization.data(withJSONObject: result, options: [.sortedKeys])
    print(String(decoding: data, as: UTF8.self))
  } catch {
    let data = try! JSONSerialization.data(withJSONObject: ["error":String(describing:error)], options: [.sortedKeys])
    print(String(decoding: data, as: UTF8.self))
  }
}
