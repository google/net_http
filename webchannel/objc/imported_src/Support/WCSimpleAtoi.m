#import "WCSimpleAtoi.h"

/** Returns whether @c byte is ASCII whitespace, as @c absl::ascii_isspace defines it. */
static BOOL WCIsASCIIWhitespaceByte(uint8_t byte) {
  return byte == ' ' || byte == '\t' || byte == '\n' || byte == '\v' || byte == '\f' ||
         byte == '\r';
}

BOOL WCSimpleAtoi64(NSString *string, int64_t *value) {
  NSData *data = [string dataUsingEncoding:NSUTF8StringEncoding];
  const uint8_t *begin = data.bytes;
  const uint8_t *end = begin + data.length;
  while (begin < end && WCIsASCIIWhitespaceByte(*begin)) {
    begin++;
  }
  while (end > begin && WCIsASCIIWhitespaceByte(end[-1])) {
    end--;
  }
  BOOL negative = NO;
  if (begin < end && (*begin == '+' || *begin == '-')) {
    negative = *begin == '-';
    begin++;
  }
  if (begin == end) {
    return NO;
  }
  // The magnitude of INT64_MIN is one more than INT64_MAX.
  uint64_t limit = negative ? (uint64_t)INT64_MAX + 1 : (uint64_t)INT64_MAX;
  uint64_t magnitude = 0;
  for (const uint8_t *digit = begin; digit < end; digit++) {
    if (*digit < '0' || *digit > '9') {
      return NO;
    }
    uint64_t digitValue = *digit - '0';
    if (magnitude > (limit - digitValue) / 10) {
      return NO;
    }
    magnitude = magnitude * 10 + digitValue;
  }
  if (negative && magnitude > 0) {
    *value = -(int64_t)(magnitude - 1) - 1;
  } else {
    *value = (int64_t)magnitude;
  }
  return YES;
}

BOOL WCSimpleAtoi32(NSString *string, int32_t *value) {
  int64_t wideValue = 0;
  if (!WCSimpleAtoi64(string, &wideValue) || wideValue < INT32_MIN || wideValue > INT32_MAX) {
    return NO;
  }
  *value = (int32_t)wideValue;
  return YES;
}
