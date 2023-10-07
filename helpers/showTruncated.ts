export function showTruncated(str: string, len: number) {
  if (str.length > len) {
    return str.substring(0, len) + "...";
  } else {
    return str;
  }
}