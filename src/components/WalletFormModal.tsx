import { Dialog, Transition } from "@headlessui/react"
import React, { useState, Fragment, useEffect } from "react"
import { X } from "react-feather"
import { useDispatch } from "react-redux"
import { updateWallet } from "store/account/actions"
import { ConnectedWallet } from "store/types"

interface Props {
  isOpen: boolean
  wallet: ConnectedWallet|undefined
  onClose: () => void
}

const WalletFormModal = (props: Props) => {
  let { isOpen, wallet } = props
  let dispatch = useDispatch()
  let [label, setLabel] = useState(wallet?.label ?? '')

  useEffect(() => {
    setLabel(wallet?.label ?? '')
  }, [alert])

  function save() {
    dispatch(updateWallet({
      address: wallet?.address ?? '',
      label
    }))
    
    props.onClose()
  }
  
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog 
        open={isOpen} 
        onClose={() => props.onClose()}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-70" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-12 rounded-lg shadow-lg max-w-md mx-auto text-center">
              <Dialog.Title className="text-xl font-bold mb-1">Edit wallet</Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 dark:text-gray-400">Easily discern your wallets by giving them a label.</Dialog.Description>

              <div className="text-left py-8">
                <div className="mt-3">
                  <div className="font-semibold">Label</div>
                  <div className="flex items-center gap-2">
                    <input 
                      placeholder="Wallet label"
                      value={label}
                      onChange={e => setLabel(e.target.value)}
                      className="relative w-full py-2 pl-3 pr-3 bg-white dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-primary focus-visible:ring-offset-2 sm:text-sm" 
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-stretch">
                <button onClick={save} className="bg-primary rounded py-2 font-medium">Save</button>
              </div>

              <button onClick={() => props.onClose()} className="absolute right-4 top-4 text-gray-500 dark:text-gray-400"><X /></button>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default WalletFormModal