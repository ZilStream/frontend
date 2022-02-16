import React from 'react'
import { Transaction } from 'types/transaction.interface'
import TransactionRow from './TransactionRow'

interface Props {
  transactions: Transaction[]
}

const TransactionsGroup = (props: Props) => {
  return (
    <>
      {props.transactions.map(transaction => {
        return <TransactionRow transaction={transaction} />
      })}
    </>
  )
}

export default TransactionsGroup

