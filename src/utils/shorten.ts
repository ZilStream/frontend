export function shorten(s: string, length: number = 10): string {
  return s.substr(0, length)
}

export function shortenAddress(address: string, length: number = 4): string {
  return address.substr(0, length+1) + '...' + address.substr(address.length-length,length)
}