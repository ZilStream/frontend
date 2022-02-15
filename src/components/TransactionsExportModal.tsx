import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { openExport } from 'store/modal/actions'
import { AccountState, ModalState, RootState } from 'store/types'
import { CSVLink } from 'react-csv'
import { getTransactions } from 'lib/zilstream/getTransactions'
import { Transaction } from 'types/transaction.interface'
import LoadingIndicator from './LoadingIndicator'
import dayjs from 'dayjs'

const TransactionsExportModal = () => {
  const modalState = useSelector<RootState, ModalState>(state => state.modal)
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [range, setRange] = useState<{from: dayjs.Dayjs, to: dayjs.Dayjs}>({from: dayjs().startOf('month'), to: dayjs().endOf('day')})

  useEffect(() => {
    dispatch(openExport(isOpen))
  }, [isOpen])

  useEffect(() => {
    if(isOpen) return
    setIsOpen(modalState.exportOpen)
  }, [modalState.exportOpen])

  const handleGetTransactions = () => {
    setIsLoading(true)
    fetchTransactions()
  }

  const fetchTransactions = async () => {
    if(!accountState.selectedWallet) return
    
    var totalTransactions: any[] = []

    var hasTransactions = true
    var currentPage = 1
    while (hasTransactions) {
      const txns = await getTransactions(accountState.selectedWallet.address, currentPage, 150, range.from.format('YYYY-MM-DD'), range.to.format('YYYY-MM-DD'))
      totalTransactions.push(...txns.data)

      if(currentPage === txns.pages || currentPage > txns.pages) {
        hasTransactions = false
      } else {
        currentPage += 1
      }
    }

    totalTransactions.forEach(tx => {
      delete tx["data"]
      delete tx["receipt"]
    })

    setTransactions(totalTransactions)
    setIsLoading(false)

    console.log(`Found transactions: ${totalTransactions.length}`)
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed z-10 inset-0 overflow-y-auto">

        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-70" />

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 py-4 px-5 my-4 flex flex-col rounded-lg shadow-lg w-110 max-w-full mx-auto">
              <Dialog.Title className="text-lg font-bold mb-1">Export your transactions <span className="bg-primary rounded text-sm py-1 px-2">Beta</span></Dialog.Title>

              <div className="flex-grow border-t dark:border-gray-700 mt-2 pt-2">
                <div className="text-sm font-medium mb-1">Range</div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="date"
                    className="bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-700 rounded py-3 px-3 text-sm"
                    min="2019-01-31"
                    max={dayjs().format('YYYY-MM-DD')}
                    onChange={e => setRange({...range, from: dayjs(e.target.value)})}
                    value={range.from.format('YYYY-MM-DD')}
                  />

                  <input
                    type="date"
                    className="bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-700 rounded py-3 px-3 text-sm"
                    min="2019-01-31"
                    max={dayjs().format('YYYY-MM-DD')}
                    onChange={e => setRange({...range, to: dayjs(e.target.value)})}
                    value={range.to.format('YYYY-MM-DD')}
                  />
                </div>
              </div>


              <button
                className={`${transactions.length > 0 ? 'bg-gray-300 dark:bg-gray-700' : 'bg-primary'} rounded-lg px-3 py-2 text-center font-semibold mb-2`}
                onClick={() => handleGetTransactions()}
              >
                Get Transactions
              </button>

              {isLoading &&
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <LoadingIndicator />
                  Retrieving all your transactions..
                </div>
              }
              
              {transactions.length > 0 &&
                <CSVLink 
                  data={transactions}
                  filename={'transactions.csv'}
                  className="bg-primary rounded-lg px-3 py-2 text-center"
                >
                  Download CSV
                </CSVLink>
              }
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default TransactionsExportModal