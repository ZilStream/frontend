import { Transaction } from "types/transaction.interface"

export async function getTransactions(address: string, page: number = 1): Promise<PagedTransactions> {
  const res = await fetch(`https://store.zilstream.com/transactions?address=${address}&page=${page}`)
  return res.json()
}

export interface PagedTransactions {
  data: Transaction[]
  current_page: number
  pages: number
  total_items: number
}