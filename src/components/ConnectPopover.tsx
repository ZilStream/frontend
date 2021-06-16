import { Popover, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AccountState, RootState } from 'store/types'
import { AccountActionTypes } from 'store/account/actions'
import { Network } from 'store/account/reducer'
import ConnectWalletButton from './ConnectWalletButton'

const ConnectPopover = () => {
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const dispatch = useDispatch()

  const logout = () => {
    dispatch({ type: AccountActionTypes.WALLET_UPDATE, payload: '' })
    localStorage.removeItem('zilpay')
  }

  const connectZilPay = async () => {
    const zilPay = (window as any).zilPay
    
    // Check if ZilPay is installed
    if(typeof zilPay === "undefined") {
      console.log("ZilPay extension not installed")
      return
    }
      
    const result = await zilPay.wallet.connect()

    if(result !== zilPay.wallet.isConnect) {
      console.log("Could not connect to ZilPay")
      return
    }

    const walletAddress = zilPay.wallet.defaultAccount.bech32
    const network = zilPay.wallet.net

    dispatch({ type: AccountActionTypes.NETWORK_UPDATE, payload: network })
    dispatch({ type: AccountActionTypes.WALLET_UPDATE, payload: walletAddress })

    localStorage.setItem('zilpay', 'true')
  }

  const connectZeeves = async () => {
    const zeeves = (window as any).Zeeves;

    if (!zeeves) {
      throw new Error('Zeeves is not supported');
    }

    //authentication in Zeeves
    const walletInfo = await zeeves.getSession();
  
    dispatch({ type: AccountActionTypes.NETWORK_UPDATE, payload: Network.MAIN_NET });
    dispatch({ type: AccountActionTypes.WALLET_UPDATE, payload: walletInfo.bech32 });

    localStorage.setItem('zilpay', 'false');
  }

  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button className="menu-item-active focus:outline-none flex items-center mr-2">
            <span className="sr-only">Connect wallet</span>
            Connect wallet
          </Popover.Button>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Popover.Panel className="origin-top-right absolute right-0 z-50 bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-900 rounded-lg py-4 px-8 w-72">
              <div className="flex flex-col items-center">
                <div className="font-semibold mb-7">Connect wallet</div>
                <div className="mb-4 flex flex-col items-stretch gap-4 w-full">
                  <ConnectWalletButton walletName={'ZilPay'} connectWallet={() => connectZilPay()}></ConnectWalletButton>
                  <ConnectWalletButton walletName={'Zeeves'} connectWallet={() => connectZeeves()}></ConnectWalletButton>
                </div>
                <div className="text-xs text-gray-400"><span className="font-semibold">Note:</span> Connecting your Wallet does not give ZilStream access to your private keys, and no transactions can be sent. ZilStream does not store your wallet address on its servers.</div>
              </div>
            </Popover.Panel>
          </Transition>
          </>
      )}
    </Popover>
  )
}

export default ConnectPopover