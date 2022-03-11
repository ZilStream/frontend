import WalletFormModal from "components/WalletFormModal";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteWallet } from "store/account/actions";
import { AccountState, ConnectedWallet, RootState } from "store/types";
import { AccountType } from "types/walletType.interface";
import { shortenAddress } from "utils/shorten";

function Wallets() {
  let accountState = useSelector<RootState, AccountState>(state => state.account)
  let dispatch = useDispatch()
  let [dialogOpen, setDialogOpen] = useState(false)
  let [currentWallet, setCurrentWallet] = useState<ConnectedWallet|undefined>()

  return (
    <>
      <div className="pt-8 pb-2 md:pb-8">
        <div className="flex flex-col lg:flex-row items-start">
          <div className="flex-grow">
            <h2 className="mb-1">Manage wallets</h2>
            <div className="text-gray-500 dark:text-gray-400 text-lg">Manage your wallets</div>
          </div>
        </div>
      </div>

      <div className="scrollable-table-container max-w-full overflow-x-scroll">
        <table className="zilstream-table table-fixed border-collapse w-full">
          <colgroup>
            <col style={{width: '260px', minWidth: 'auto'}} />
            <col style={{width: '100px', minWidth: 'auto'}} />
            <col style={{width: '100px', minWidth: 'auto'}} />
            <col style={{width: '100px', minWidth: 'auto'}} />
          </colgroup>
          <thead className="text-gray-500 dark:text-gray-400 text-xs">
            <tr className="py-2">
              <th className="pl-4 pr-2 py-3 text-left">Wallet</th>
              <th className="px-2 py-3 text-right">Type</th>
              <th className="px-2 py-3 text-right">Connected</th>
              <th className="px-2 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accountState.wallets.map((wallet, index) => (
              <tr key={index} role="row" className="border-b dark:border-gray-700 last:border-b-0">
                <td className={`pl-4 pr-2 py-3 text-left ${index === 0 ? 'rounded-tl-lg' : ''} ${index === accountState.wallets.length-1 ? 'rounded-bl-lg' : ''}`}>
                  {wallet.label ? wallet.label : wallet.address} <span className="text-sm text-gray-500 dark:text-gray-400">{shortenAddress(wallet.address)}</span>
                  {wallet.isMember &&
                    <span className="bg-primary h-4 px-1 rounded flex items-center justify-center text-xs font-bold ml-2">Premium</span>
                  }
                </td>
                <td className="px-2 py-3 text-right">
                  {AccountType[wallet.type]}
                </td>
                <td className="px-2 py-3 text-right">
                  {wallet.isConnected ? (
                    <span className="text-sm"><span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2" />Connected</span>
                  ) : (
                    <span className="text-sm"><span className="w-2 h-2 bg-orange-500 rounded-full inline-block mr-2" />Not connected</span>
                  )}
                </td>
                <td className="px-2 py-3 text-right">
                  <button onClick={() => {
                      setCurrentWallet(wallet)
                      setDialogOpen(true)
                    }} className="text-xs bg-gray-100 dark:bg-gray-900 py-1 px-2 rounded">Edit</button>
                  <button 
                    onClick={() => dispatch(deleteWallet({ address: wallet.address }))}
                    className="text-xs bg-gray-100 dark:bg-gray-900 py-1 px-2 rounded ml-1"
                  >Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <WalletFormModal isOpen={dialogOpen} wallet={currentWallet} onClose={() => setDialogOpen(false)} />
    </>
  )
}

export default Wallets