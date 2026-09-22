import Foundation
import WebChannel

/// Custom logger that prints SDK events and forwards HTTP request/response payloads to WebChannelService.
final class TestAppLogger: NSObject, WCLogger, @unchecked Sendable {
  weak var service: WebChannelService?

  init(service: WebChannelService?) {
    self.service = service
    super.init()
  }

  func logInfo(_ message: String) {
    print("[SDK Info] \(message)")
  }

  func logDebug(_ message: String) {
    print("[SDK Debug] \(message)")
  }

  func logWarning(_ message: String) {
    print("[SDK Warning] \(message)")
  }

  func dumpException(_ e: NSException, withMessage message: String) {
    print("[SDK Exception] \(e.name): \(message)")
  }

  func logError(_ message: String) {
    print("[SDK Error] \(message)")
  }

  func logHTTPRequest(
    _ verb: String,
    url: URL,
    id: String,
    attempt: Int64,
    postData: String?
  ) {
    let postPreview = postData != nil ? " | PostData: \(postData!)" : ""
    let logMsg =
      "🌐 [HTTP Req] (\(id)) [attempt \(attempt)] \(verb) \(url.absoluteString)\(postPreview)"
    print(logMsg)
    DispatchQueue.main.async {
      self.service?.log(logMsg)
    }
  }

  func logHTTPChannelResponseMetaData(
    _ verb: String,
    url: URL,
    id: String,
    attempt: Int64,
    state: WCRequestReadyState,
    statusCode code: Int32
  ) {
    print(
      "🌐 [HTTP Resp Meta] (\(id)) [attempt \(attempt)] \(verb) \(url.absoluteString) status: \(code)"
    )
  }

  func logHTTPChannelResponseText(_ text: String, id: String, desc: String?) {
    let descPart = desc != nil ? " [\(desc!)]" : ""
    let logMsg = "🌐 [HTTP Resp Body] (\(id))\(descPart): \(text)"
    print(logMsg)
    DispatchQueue.main.async {
      self.service?.log(logMsg)
    }
  }
}

/// Custom WCSupport implementation providing the custom TestAppLogger and forwarding to WCDefaultSupport.
final class TestAppSupport: NSObject, WCSupport, @unchecked Sendable {
  private let defaultSupport = WCDefaultSupport()!
  let customLogger: TestAppLogger

  init(service: WebChannelService?) {
    self.customLogger = TestAppLogger(service: service)
    super.init()
  }

  var urlEncoder: any WCURLEncoder {
    return defaultSupport.urlEncoder
  }

  var logger: any WCLogger {
    return customLogger
  }

  var jsonDecoder: any WCJSONDecoder {
    return defaultSupport.jsonDecoder
  }

  var dispatchQueue: DispatchQueue {
    return defaultSupport.dispatchQueue
  }

  func httpRequest(_ handler: any WCRequestStateChangedHandler) -> any WCHTTPRequest {
    return defaultSupport.httpRequest(handler)
  }

  func notifyStatEvent(_ event: WCRequestStat) {
    defaultSupport.notifyStatEvent(event)
  }

  func notifyServerReachabilityEvent(_ event: WCServerReachability) {
    defaultSupport.notifyServerReachabilityEvent(event)
  }

  func notifyTimingEvent(
    withSize size: Int32,
    withRTT rtt: TimeInterval,
    withRetries retries: Int32
  ) {
    defaultSupport.notifyTimingEvent(
      withSize: size, withRTT: rtt, withRetries: retries)
  }

  func notifyHandshakeTimingEvent(withRtt rtt: TimeInterval) {
    defaultSupport.notifyHandshakeTimingEvent(withRtt: rtt)
  }

  func notifyHandshakeResponseHeaders(_ headers: [String: String]) {
    defaultSupport.notifyHandshakeResponseHeaders(headers)
  }

  func setTimeout(_ timeout: TimeInterval, block: (() -> Void)!) -> (any WCTimer)! {
    return defaultSupport.setTimeout(timeout, block: block)
  }

  func setTimeout(
    _ timeout: TimeInterval,
    block: (() -> Void)!,
    context: WCFailureRecoveryContext
  ) -> (any WCTimer)! {
    return defaultSupport.setTimeout(timeout, block: block, context: context)
  }

  func clearTimeout(_ timer: (any WCTimer)!) {
    defaultSupport.clearTimeout(timer)
  }
}
