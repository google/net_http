#import "WCURIBuilder.h"

static const char kWCHexDigits[] = "0123456789ABCDEF";
static const unichar kWCReplacementCharacter = 0xFFFD;

static BOOL WCIsAlphanumericByte(uint8_t byte) {
  return (byte >= 'A' && byte <= 'Z') || (byte >= 'a' && byte <= 'z') ||
         (byte >= '0' && byte <= '9');
}

static BOOL WCIsURIComponentByte(uint8_t byte) {
  if (WCIsAlphanumericByte(byte)) {
    return YES;
  }
  switch (byte) {
    case '!':
    case '(':
    case ')':
    case '*':
    case '-':
    case '.':
    case '_':
    case '~':
      return YES;
    default:
      return NO;
  }
}

static NSData *WCUTF8Data(NSString *string) {
  NSData *data = [string dataUsingEncoding:NSUTF8StringEncoding];
  if (data != nil) {
    return data;
  }
  NSUInteger length = string.length;
  NSMutableData *buffer = [NSMutableData dataWithLength:length * sizeof(unichar)];
  unichar *characters = buffer.mutableBytes;
  [string getCharacters:characters range:NSMakeRange(0, length)];
  for (NSUInteger i = 0; i < length; i++) {
    if (CFStringIsSurrogateHighCharacter(characters[i]) && i + 1 < length &&
        CFStringIsSurrogateLowCharacter(characters[i + 1])) {
      i++;
    } else if (CFStringIsSurrogateHighCharacter(characters[i]) ||
               CFStringIsSurrogateLowCharacter(characters[i])) {
      characters[i] = kWCReplacementCharacter;
    }
  }
  NSString *replaced = [NSString stringWithCharacters:characters length:length];
  return [replaced dataUsingEncoding:NSUTF8StringEncoding];
}

NSString *WCEncodeURIComponent(NSString *value) {
  NSData *input = WCUTF8Data(value);
  const uint8_t *inputBytes = input.bytes;
  NSMutableData *output = [NSMutableData dataWithLength:input.length * 3];
  char *outputBytes = output.mutableBytes;
  NSUInteger outputLength = 0;
  for (NSUInteger i = 0; i < input.length; i++) {
    uint8_t byte = inputBytes[i];
    if (WCIsURIComponentByte(byte)) {
      outputBytes[outputLength++] = byte;
    } else {
      outputBytes[outputLength++] = '%';
      outputBytes[outputLength++] = kWCHexDigits[byte >> 4];
      outputBytes[outputLength++] = kWCHexDigits[byte & 0xF];
    }
  }
  output.length = outputLength;
  return [[NSString alloc] initWithData:output encoding:NSASCIIStringEncoding];
}

static NSString *WCQueryParameterKey(NSString *parameter) {
  NSRange separator = [parameter rangeOfString:@"="];
  return separator.location == NSNotFound ? parameter
                                          : [parameter substringToIndex:separator.location];
}

void WCAddQueryParameter(NSURLComponents *components, NSString *name, NSString *value) {
  NSString *encodedName = WCEncodeURIComponent(name);
  NSString *parameter =
      [NSString stringWithFormat:@"%@=%@", encodedName, WCEncodeURIComponent(value)];
  NSString *query = components.percentEncodedQuery;
  NSMutableArray<NSString *> *parameters =
      query.length > 0 ? [[query componentsSeparatedByString:@"&"] mutableCopy]
                       : [NSMutableArray array];
  BOOL found = NO;
  for (NSUInteger i = 0; i < parameters.count;) {
    if (![WCQueryParameterKey(parameters[i]) isEqualToString:encodedName]) {
      i++;
    } else if (!found) {
      parameters[i] = parameter;
      found = YES;
      i++;
    } else {
      [parameters removeObjectAtIndex:i];
    }
  }
  if (!found) {
    [parameters addObject:parameter];
  }
  components.percentEncodedQuery = [parameters componentsJoinedByString:@"&"];
}
