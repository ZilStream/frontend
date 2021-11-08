export function shortenAddress(address: string, length: number = 4): string {
  return address.substr(0, length+1) + '...' + address.substr(address.length-length,length)
}