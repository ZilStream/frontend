import { Dialog, Transition } from '@headlessui/react'
import TokenIcon from 'components/TokenIcon'
import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { openExport } from 'store/modal/actions'
import { AccountState, ModalState, RootState } from 'store/types'
import { CSVLink } from 'react-csv'
import { getTransactions } from 'lib/zilstream/getTransactions'
import { Transaction } from 'types/transaction.interface'
import LoadingIndicator from './LoadingIndicator'

const TransactionsExportModal = () => {
  const modalState = useSelector<RootState, ModalState>(state => state.modal)
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    dispatch(openExport(isOpen))
  }, [isOpen])

  useEffect(() => {
    if(isOpen) return
    setIsOpen(modalState.exportOpen)
  }, [modalState.exportOpen])

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    if(!accountState.selectedWallet) return
    
    var totalTransactions: Transaction[] = []

    var hasTransactions = true
    var currentPage = 0
    while (hasTransactions) {
      const txns = await getTransactions(accountState.selectedWallet.address, currentPage)
      totalTransactions.push(...txns.data)

      currentPage += 1

      console.log(currentPage, txns.pages)

      if(currentPage === txns.pages || currentPage > txns.pages) {
        hasTransactions = false
      }
    }

    setTransactions(totalTransactions)
    setIsLoading(false)
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

              {isLoading &&
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <LoadingIndicator />
                  Retrieving all your transactions..
                </div>
              }

              <div className="flex-grow overflow-y-scroll border-t dark:border-gray-700 mt-2 pt-2">
                
              </div>

              <CSVLink 
                data={transactions}
                filename={'transactions.csv'}
                className="bg-primary rounded-lg px-3 py-2 text-center"
              >
                Download CSV
              </CSVLink>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default TransactionsExportModal