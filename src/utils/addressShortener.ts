export function shortenAddress(address: string): string {
  return address.substr(0, 5) + '...' + address.substr(address.length-4,4)
}