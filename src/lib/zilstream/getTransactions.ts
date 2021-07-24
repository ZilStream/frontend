import { Transaction } from "types/transaction.interface"

export async function getTransactions(address: string): Promise<Transaction[]> {
  const res = await fetch(`https://store.zilstream.com/transactions?address=${address}`)
  return res.json()
}