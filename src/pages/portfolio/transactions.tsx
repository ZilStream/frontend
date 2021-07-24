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
import { groupBy } from 'underscore'
import TransactionsGroup from 'components/TransactionsGroup'
import { ArrowLeft, ArrowRight } from 'react-feather'

const Transactions = () => {
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const {membership} = useBalances()

  async function setTxns() {
    const txns = await getTransactions(accountState.address, currentPage)
    setTransactions(txns.data)
    setTotalPages(txns.pages)
    setIsLoading(false)
  }

  useEffect(() => {
    if(accountState.address === '') return
    setTxns()
  }, [accountState.address, currentPage])

  if(!membership.isMember) {
    return (
      <>
        <Head>
          <title>Transactions | ZilStream</title>
          <meta property="og:title" content={`Transactions | ZilStream`} />
        </Head>
        <PortfolioHeader />
        <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-900 rounded-lg p-5">
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
        <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-900 rounded-lg">
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
      <div className="flex items-center">
        <div className="flex-grow"></div>
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentPage(currentPage-1)} className={`bg-gray-300 dark:bg-gray-700 flex items-center justify-center rounded-lg w-8 h-8 p-1 focus:outline-none ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={currentPage === 1}>
            <ArrowLeft size={18} />
          </button>
          <div className="text-sm">Page {currentPage} of {totalPages}</div>
          <button onClick={() => setCurrentPage(currentPage+1)} className={`bg-gray-300 dark:bg-gray-700 flex items-center justify-center rounded-lg w-8 h-8 p-1 focus:outline-none ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
      {Object.keys(groups).map(date => {
        const day = dayjs(date)
        return (
          <>
            <div className="text-lg font-semibold mt-6 mb-2">{day.format('MMMM D, YYYY')}</div>
            <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-900 rounded-lg">
              <TransactionsGroup transactions={groups[date]} />
            </div>
          </>
        )
      })}
    </>
  )
}

export default Transactions