import { Dialog } from '@headlessui/react'
import React, { useState } from 'react'
import { Tool } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { updateColumns } from 'store/settings/actions'
import { RootState, SettingsState } from 'store/types'
import ToggleButton from './ToggleButton'

const Customize = () => {
  const { columns } = useSelector<RootState, SettingsState>(state => state.settings)
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState<boolean>(false)

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
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30 dark:bg-opacity-50" />

        <div className="relative max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <Dialog.Title className="text-xl">Customize</Dialog.Title>
          <Dialog.Description>Choose which data points you'd like to see.</Dialog.Description>

          <div className="py-4 flex flex-col gap-1">
            <div>
              <label className="text-gray-500 text-sm">Price</label>
              <div>
                <ToggleButton selected={columns.priceZIL} onChange={() => dispatch(updateColumns({ priceZIL: !columns.priceZIL }))}>Price in ZIL</ToggleButton>
                <ToggleButton selected={columns.priceFiat} onChange={() => dispatch(updateColumns({ priceFiat: !columns.priceFiat }))}>Price in Fiat</ToggleButton>
                <ToggleButton selected={columns.ath} onChange={() => dispatch(updateColumns({ ath: !columns.ath }))}>ATH</ToggleButton>
                <ToggleButton selected={columns.atl} onChange={() => dispatch(updateColumns({ atl: !columns.atl }))}>ATL</ToggleButton>
              </div>
            </div>

            <div>
              <label className="text-gray-500 text-sm">Price Change</label>
              <div>
                <ToggleButton selected={columns.change24H} onChange={() => dispatch(updateColumns({ change24H: !columns.change24H }))}>24h %</ToggleButton>
                <ToggleButton selected={columns.change7D} onChange={() => dispatch(updateColumns({ change7D: !columns.change7D }))}>7d %</ToggleButton>
                <ToggleButton selected={columns.change24HZIL} onChange={() => dispatch(updateColumns({ change24HZIL: !columns.change24HZIL }))}>24h % (ZIL)</ToggleButton>
                <ToggleButton selected={columns.change7DZIL} onChange={() => dispatch(updateColumns({ change7DZIL: !columns.change7DZIL }))}>7d % (ZIL)</ToggleButton>
              </div>
            </div>

            <div>
              <label className="text-gray-500 text-sm">Market Cap</label>
              <div>
                <ToggleButton selected={columns.marketCap} onChange={() => dispatch(updateColumns({ marketCap: !columns.marketCap }))}>Market Cap</ToggleButton>
                <ToggleButton selected={columns.marketCapDiluted} onChange={() => dispatch(updateColumns({ marketCapDiluted: !columns.marketCapDiluted }))}>Fully Diluted Mcap</ToggleButton>
              </div>
            </div>

            <div>
              <label className="text-gray-500 text-sm">Supply</label>
              <div>
                <ToggleButton selected={columns.circSupply} onChange={() => dispatch(updateColumns({ circSupply: !columns.circSupply }))}>Circulating Supply</ToggleButton>
                <ToggleButton selected={columns.totalSupply} onChange={() => dispatch(updateColumns({ totalSupply: !columns.totalSupply }))}>Total Supply</ToggleButton>
                <ToggleButton selected={columns.maxSupply} onChange={() => dispatch(updateColumns({ maxSupply: !columns.maxSupply }))}>Max Supply</ToggleButton>
              </div>
            </div>

            <div>
              <label className="text-gray-500 text-sm">Other</label>
              <div>
                <ToggleButton selected={columns.liquidity} onChange={() => dispatch(updateColumns({ liquidity: !columns.liquidity }))}>Liquidity</ToggleButton>
                <ToggleButton selected={columns.volume} onChange={() => dispatch(updateColumns({ atl: !columns.volume }))}>Volume (24h)</ToggleButton>
                <ToggleButton selected={columns.apr} onChange={() => dispatch(updateColumns({ apr: !columns.apr }))}>APR %</ToggleButton>
                <ToggleButton selected={columns.apy} onChange={() => dispatch(updateColumns({ apy: !columns.apy }))}>APY %</ToggleButton>
                <ToggleButton selected={columns.graph24H} onChange={() => dispatch(updateColumns({ graph24H: !columns.graph24H }))}>Last 24 hours</ToggleButton>
                <ToggleButton selected={columns.graph24HZIL} onChange={() => dispatch(updateColumns({ graph24HZIL: !columns.graph24HZIL }))}>Last 24 hours (ZIL)</ToggleButton>
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