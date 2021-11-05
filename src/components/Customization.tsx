import { Dialog } from '@headlessui/react'
import React, { useState } from 'react'
import { Tool } from 'react-feather'
import ToggleButton from './ToggleButton'

const Customize = () => {
  let [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <>
      <button 
        className="flex items-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-xs font-semibold py-2 px-3 focus:outline-none"
        onClick={() => setIsOpen(true)}
      >
        <Tool size={12} className="mr-1 text-gray-500 dark:text-gray-400" /> Customize
      </button>

      <Dialog
        className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center"
        open={isOpen} 
        onClose={() => setIsOpen(false)}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <Dialog.Title className="text-xl">Customize</Dialog.Title>
          <Dialog.Description>Choose which data points you'd like to see.</Dialog.Description>

          <div className="py-4 flex flex-col gap-1">
            <div>
              <label className="text-gray-500 text-sm">Price</label>
              <div>
                <ToggleButton defaultSelected={true}>Price in ZIL</ToggleButton>
                <ToggleButton defaultSelected={true}>Price in Fiat</ToggleButton>
                <ToggleButton>ATH</ToggleButton>
                <ToggleButton>ATL</ToggleButton>
              </div>
            </div>

            <div>
              <label className="text-gray-500 text-sm">Price Change</label>
              <div>
                <ToggleButton defaultSelected={true}>24h %</ToggleButton>
                <ToggleButton>7d %</ToggleButton>
                <ToggleButton>30d %</ToggleButton>
              </div>
            </div>

            <div>
              <label className="text-gray-500 text-sm">Market Cap</label>
              <div>
                <ToggleButton defaultSelected={true}>Market Cap</ToggleButton>
                <ToggleButton>Fully Diluted Mcap</ToggleButton>
              </div>
            </div>

            <div>
              <label className="text-gray-500 text-sm">Supply</label>
              <div>
                <ToggleButton>Circulating Supply</ToggleButton>
                <ToggleButton>Total Supply</ToggleButton>
                <ToggleButton>Max Supply</ToggleButton>
              </div>
            </div>

            <div>
              <label className="text-gray-500 text-sm">Other</label>
              <div>
                <ToggleButton defaultSelected={true}>Volume (24h)</ToggleButton>
                <ToggleButton>APR %</ToggleButton>
                <ToggleButton defaultSelected={true}>Last 24 hours</ToggleButton>
              </div>
            </div>
          </div>
          
          <button 
            className="bg-primary rounded w-full py-2 px-3 font-medium mt-5 focus:outline-none"
            onClick={() => setIsOpen(false)}
          >Done</button>
        </div>
      </Dialog>
    </>
  )
}

export default Customize