import { Dialog } from '@headlessui/react'
import React, { useState } from 'react'
import { Sliders } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { updateFilters } from 'store/settings/actions'
import { RootState, SettingsState } from 'store/types'

const Filters = () => {
  const { filters } = useSelector<RootState, SettingsState>(state => state.settings)
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateFilters({
      [event.target.name]: event.target.checked
    }))
  }

  return (
    <>
      <button 
        className="flex items-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-xs font-semibold py-2 px-3 focus:outline-none"
        onClick={() => setIsOpen(true)}
      >
        <Sliders size={12} className="mr-1 text-gray-500 dark:text-gray-400" /> Filters
      </button>

      <Dialog
        className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center"
        open={isOpen} 
        onClose={() => setIsOpen(false)}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30 dark:bg-opacity-50" />

        <div className="relative max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <Dialog.Title className="text-xl">Filters</Dialog.Title>
          <Dialog.Description>Narrow down what you'd like to see.</Dialog.Description>

          <div className="py-4 flex flex-col gap-3">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="bridged"
                  name="bridged"
                  type="checkbox"
                  className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                  checked={filters.bridged}
                  onChange={handleInputChange}
                />
              </div>
              <div className="ml-3">
                <label htmlFor="bridged" className="font-medium">
                  Bridged tokens
                </label>
                <div className="text-gray-500 dark:text-gray-400">Tokens bridged from ETH to ZIL.</div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="unlisted"
                  name="unlisted"
                  type="checkbox"
                  className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                  checked={filters.unlisted}
                  onChange={handleInputChange}
                />
              </div>
              <div className="ml-3">
                <label htmlFor="unlisted" className="font-medium">
                  Unlisted tokens
                </label>
                <div className="text-gray-500 dark:text-gray-400">Tokens that haven't been verified by the ZilStream team. Such tokens often bear extremely high risk and have low liquidity. <span className="font-semibold">Proceed with caution.</span></div>
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

export default Filters