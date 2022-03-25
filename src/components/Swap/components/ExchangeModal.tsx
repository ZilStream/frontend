import { Dialog, Transition } from '@headlessui/react'
import TokenIcon from 'components/TokenIcon'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { openExchange } from 'store/modal/actions'
import { updateSwap } from 'store/swap/actions'
import { ModalState, RootState, SwapState } from 'store/types'
import { swapExchanges } from 'types/swapExchange.interface'

const ExchangeModal = () => {
  const swapState = useSelector<RootState, SwapState>(state => state.swap)
  const modalState = useSelector<RootState, ModalState>(state => state.modal)
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if(isOpen === false) {
      setSearchTerm('')
    }
    dispatch(openExchange(isOpen))
  }, [isOpen])

  useEffect(() => {
    if(isOpen) return
    setIsOpen(modalState.exchangeOpen)
  }, [modalState.exchangeOpen])

  const filteredExchanges = useMemo(() => {
    var newExchanges = swapExchanges

    if(searchTerm !== '') {
      newExchanges = newExchanges.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    return newExchanges
  }, [searchTerm])

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
            <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 py-4 px-5 my-4 flex flex-col rounded-lg shadow-lg w-110 max-w-full max-h-screen-margin mx-auto">
              <Dialog.Title className="text-lg font-bold mb-1">Select an exchange</Dialog.Title>

              <div>
                <input
                  className="w-full rounded-lg py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                  type="text"
                  placeholder="Search name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex-grow flex flex-col items-stretch overflow-y-scroll border-t dark:border-gray-700 mt-2">
                {filteredExchanges.map(exchange => (
                  <button
                    key={exchange.name}
                    className={`flex items-center py-2 border-b last:border-b-0 border-gray-100 dark:border-gray-800 cursor-pointer ${!exchange.active && 'opacity-50'}`}
                    disabled={!exchange.active}
                    onClick={() => {
                      dispatch(updateSwap({exchange: exchange}))
                      setIsOpen(false)
                    }}
                  >
                    <div className="w-6 h-6 mr-4"><TokenIcon address={exchange.iconAddress} /></div>
                    <div className="flex-grow text-left">
                      <div className="font-semibold">{exchange.name}</div>
                      {exchange.active ? (
                        <div className="text-gray-500 dark:text-gray-400 text-sm">Available</div>
                      ) : (
                        <div className="text-gray-500 dark:text-gray-400 text-sm">Coming soon</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ExchangeModal