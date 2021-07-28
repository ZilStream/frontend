export interface Snapshot {
  balances: {[id: string]: string}
  totalSupply: string
  address: string
  msg: string
}