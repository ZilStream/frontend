import LoadingTransactions from 'components/LoadingTransactions'
import PortfolioHeader from 'components/PortfolioHeader'
import dayjs from 'dayjs'
import { getTransactions } from 'lib/zilstream/getTransactions'
import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { AccountState, RootState, TokenInfo, TokenState } from 'store/types'
import { Transaction } from 'types/transaction.interface'
import useBalances from 'utils/useBalances'
import useMoneyFormatter from 'utils/useMoneyFormatter'
import { groupBy } from 'underscore'
import TransactionsGroup from 'components/Transactions'

const Transactions = () => {
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const moneyFormat = useMoneyFormatter({ maxFractionDigits: 5 })
  const {membership} = useBalances()

  async function setTxns() {
    const txns = await getTransactions(accountState.address)
    setTransactions(txns)
    setIsLoading(false)
  }

  function findToken(address: string): TokenInfo|null {
    const tokens = tokenState.tokens.filter(token => token.address_bech32 === address)
    if(tokens.length > 0) {
      return tokens[0]
    }
    return null
  }

  useEffect(() => {
    if(accountState.address === '') return
    setTxns()
  }, [accountState.address])

  if(!membership.isMember) {
    return (
      <>
        <Head>
          <title>Transactions | ZilStream</title>
          <meta property="og:title" content={`Transactions | ZilStream`} />
        </Head>
        <PortfolioHeader />
        <div className="bg-white rounded-lg p-5">
          You need <Link href="/membership"><a>Premium Membership</a></Link> to access your transaction history.
        </div>
      </>
    )
  }

  if(isLoading) {
    return (
      <>
        <Head>
          <title>Transactions | ZilStream</title>
          <meta property="og:title" content={`Transactions | ZilStream`} />
        </Head>
        <PortfolioHeader />
        <div className="bg-white rounded-lg">
          <LoadingTransactions />
        </div>
      </>
    )
  }

  const groups = groupBy(transactions, transaction => {
    return dayjs(transaction.timestamp).startOf('day').format()
  })

  return (
    <>
      <Head>
        <title>Transactions | ZilStream</title>
        <meta property="og:title" content={`Transactions | ZilStream`} />
      </Head>
      <PortfolioHeader />
        {Object.keys(groups).map(date => {
          const day = dayjs(date)
          return (
            <>
              <div className="text-lg font-semibold mt-6 mb-2">{day.format('MMMM D, YYYY')}</div>
              <div className="bg-white dark:bg-gray-800 rounded-lg">
                <TransactionsGroup transactions={groups[date]} />
              </div>
            </>
          )
        })}
    </>
  )
}

export default Transactions