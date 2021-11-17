import { Dialog, Transition } from '@headlessui/react'
import { fromBech32Address } from '@zilliqa-js/crypto';
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Send } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { AccountActionTypes } from 'store/account/actions';
import { ModalActionTypes, openWallet } from 'store/modal/actions';
import { AccountState, ConnectedWallet, ModalState, RootState } from 'store/types';
import { AccountType } from 'types/walletType.interface';
import TokenIcon from './TokenIcon';
import ConnectAvatar from './wallets/ConnectAvatar';
import ConnectLedger from './wallets/ConnectLedger';

const WalletModal = () => {
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const modalState = useSelector<RootState, ModalState>(state => state.modal)
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const zilPayButtonRef = useRef(null)
  const [address, setAddress] = useState('')

  // Pages
  const [showDetail, setShowDetail] = useState(false)
  const [showAvatarConnect, setShowAvatarConnect] = useState(false)
  const [showLedgerConnect, setShowLedgerConnect] = useState(false)

  useEffect(() => {
    if(isOpen === false) {
      clearDetail()
    }

    dispatch(openWallet(isOpen))
  }, [isOpen])

  useEffect(() => {
    setIsOpen(modalState.walletOpen)
  }, [modalState.walletOpen])

  const connectZilPay = async () => {
    if(!isOpen) return

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
    let wallet: ConnectedWallet = {
      address: walletAddress,
      label: '',
      isDefault: accountState.wallets.length === 0,
      isConnected: true,
      isMember: false,
      type: AccountType.ZilPay
    }
    dispatch({ type: AccountActionTypes.ADD_WALLET, payload: {wallet: wallet}})
    dispatch({ type: AccountActionTypes.SELECT_WALLET, payload: {wallet: wallet}})
    setIsOpen(false)
  }

  const connectZeeves = async () => {
    if(!isOpen) return

    const zeeves = (window as any).Zeeves;

    if (!zeeves) {
      throw new Error('Zeeves is not supported');
    }

    //authentication in Zeeves
    const walletInfo = await zeeves.getSession();

    let wallet: ConnectedWallet = {
      address: walletInfo.bech32,
      label: '',
      isDefault: accountState.wallets.length === 0,
      isConnected: true,
      isMember: false,
      type: AccountType.Zeeves
    }
    dispatch({ type: AccountActionTypes.ADD_WALLET, payload: {wallet: wallet}})
    dispatch({ type: AccountActionTypes.SELECT_WALLET, payload: {wallet: wallet}})
    setIsOpen(false)
  }

  const handleAddressChange = (e: React.FormEvent<HTMLInputElement>) => {
    setAddress(e.currentTarget.value)
  }

  const handleAddressKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key !== 'Enter' || !isOpen) return

    try {
      fromBech32Address(address)
    } catch {
      return
    }
    
    let wallet: ConnectedWallet = {
      address: address,
      label: '',
      isDefault: accountState.wallets.length === 0,
      isConnected: false,
      isMember: false,
      type: AccountType.Address
    }
    dispatch({ type: AccountActionTypes.ADD_WALLET, payload: {wallet: wallet}})
    dispatch({ type: AccountActionTypes.SELECT_WALLET, payload: {wallet: wallet}})
    setIsOpen(false)
    setAddress('')
  }

  const clearDetail = () => {
    setShowDetail(false)
    setShowAvatarConnect(false)
    setShowLedgerConnect(false)
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog initialFocus={zilPayButtonRef} open={isOpen} onClose={() => setIsOpen(false)} className="fixed z-10 inset-0 overflow-y-auto">

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
            <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-12 rounded-lg shadow-lg max-w-md mx-auto text-center">
              <Dialog.Title className="text-xl font-bold mb-1">Add a wallet</Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 dark:text-gray-400">Connect your wallet with ZilPay, Ledger, Avatar, Zeeves or enter an address.</Dialog.Description>

              {showDetail ? (
                <>
                  {showAvatarConnect && <ConnectAvatar onClose={() => setIsOpen(false)} /> }
                  {showLedgerConnect && <ConnectLedger />}
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 my-8">
                    <button ref={zilPayButtonRef} className="font-bold bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:shadow py-6 rounded focus:outline-none flex flex-col items-center gap-3" onClick={() => connectZilPay()}>
                      <div className="w-8 h-8 flex items-center justify-center">
                        <img src="https://meta.viewblock.io/ZIL.zil1l0g8u6f9g0fsvjuu74ctyla2hltefrdyt7k5f4/logo?t=dark" />
                      </div>
                      ZilPay
                    </button>
                    <button className="font-bold bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:shadow py-6 rounded focus:outline-none flex flex-col items-center gap-3" onClick={() => { setShowDetail(true); setShowLedgerConnect(true)}}>
                      <div className="w-8 h-8 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 450" width="37" height="37" className="fill-current text-black dark:text-white"><g id="squares_1_"><path d="M578.2 392.7V24.3h25.6v344.1h175.3v24.3H578.2zm327.5 5.1c-39.7 0-70.4-12.8-93.4-37.1-21.7-24.3-33.3-58.8-33.3-103.6 0-43.5 10.2-79.3 32-104.9 21.7-26.9 49.9-39.7 87-39.7 32 0 57.6 11.5 76.8 33.3 19.2 23 28.1 53.7 28.1 92.1v20.5H804.6c0 37.1 9 66.5 26.9 85.7 16.6 20.5 42.2 29.4 74.2 29.4 15.3 0 29.4-1.3 40.9-3.8 11.5-2.6 26.9-6.4 44.8-14.1v24.3c-15.3 6.4-29.4 11.5-42.2 14.1-14.3 2.6-28.9 3.9-43.5 3.8zM898 135.6c-26.9 0-47.3 9-64 25.6-15.3 17.9-25.6 42.2-28.1 75.5h168.9c0-32-6.4-56.3-20.5-74.2-12.8-18-32-26.9-56.3-26.9zm238-21.8c19.2 0 37.1 3.8 51.2 10.2 14.1 7.7 26.9 19.2 38.4 37.1h1.3c-1.3-21.7-1.3-42.2-1.3-62.7V0h24.3v392.7h-16.6l-6.4-42.2c-20.5 30.7-51.2 47.3-89.6 47.3s-66.5-11.5-87-35.8c-20.5-23-29.4-57.6-29.4-102.3 0-47.3 10.2-83.2 29.4-108.7 19.2-25.6 48.6-37.2 85.7-37.2zm0 21.8c-29.4 0-52.4 10.2-67.8 32-15.3 20.5-23 51.2-23 92.1 0 78 30.7 116.4 90.8 116.4 30.7 0 53.7-9 67.8-26.9 14.1-17.9 21.7-47.3 21.7-89.6v-3.8c0-42.2-7.7-72.9-21.7-90.8-12.8-20.5-35.8-29.4-67.8-29.4zm379.9-16.6v17.9l-56.3 3.8c15.3 19.2 23 39.7 23 61.4 0 26.9-9 47.3-26.9 64-17.9 16.6-40.9 24.3-70.4 24.3-12.8 0-21.7 0-25.6-1.3-10.2 5.1-17.9 11.5-23 17.9-5.1 7.7-7.7 14.1-7.7 23s3.8 15.3 10.2 19.2c6.4 3.8 17.9 6.4 33.3 6.4h47.3c29.4 0 52.4 6.4 67.8 17.9s24.3 29.4 24.3 53.7c0 29.4-11.5 51.2-34.5 66.5-23 15.3-56.3 23-99.8 23-34.5 0-61.4-6.4-80.6-20.5-19.2-12.8-28.1-32-28.1-55 0-19.2 6.4-34.5 17.9-47.3s28.1-20.5 47.3-25.6c-7.7-3.8-15.3-9-19.2-15.3-5-6.2-7.7-13.8-7.7-21.7 0-17.9 11.5-34.5 34.5-48.6-15.3-6.4-28.1-16.6-37.1-30.7-9-14.1-12.8-30.7-12.8-48.6 0-26.9 9-49.9 25.6-66.5 17.9-16.6 40.9-24.3 70.4-24.3 17.9 0 32 1.3 42.2 5.1h85.7v1.3h.2zm-222.6 319.8c0 37.1 28.1 56.3 84.4 56.3 71.6 0 107.5-23 107.5-69.1 0-16.6-5.1-28.1-16.6-35.8-11.5-7.7-29.4-11.5-55-11.5h-44.8c-49.9 1.2-75.5 20.4-75.5 60.1zm21.8-235.4c0 21.7 6.4 37.1 19.2 49.9 12.8 11.5 29.4 17.9 51.2 17.9 23 0 40.9-6.4 52.4-17.9 12.8-11.5 17.9-28.1 17.9-49.9 0-23-6.4-40.9-19.2-52.4-12.8-11.5-29.4-17.9-52.4-17.9-21.7 0-39.7 6.4-51.2 19.2-12.8 11.4-17.9 29.3-17.9 51.1z"></path><path className="st0" d="M1640 397.8c-39.7 0-70.4-12.8-93.4-37.1-21.7-24.3-33.3-58.8-33.3-103.6 0-43.5 10.2-79.3 32-104.9 21.7-26.9 49.9-39.7 87-39.7 32 0 57.6 11.5 76.8 33.3 19.2 23 28.1 53.7 28.1 92.1v20.5h-197c0 37.1 9 66.5 26.9 85.7 16.6 20.5 42.2 29.4 74.2 29.4 15.3 0 29.4-1.3 40.9-3.8 11.5-2.6 26.9-6.4 44.8-14.1v24.3c-15.3 6.4-29.4 11.5-42.2 14.1-14.1 2.6-28.2 3.8-44.8 3.8zm-6.4-262.2c-26.9 0-47.3 9-64 25.6-15.3 17.9-25.6 42.2-28.1 75.5h168.9c0-32-6.4-56.3-20.5-74.2-12.8-18-32-26.9-56.3-26.9zm245.6-21.8c11.5 0 24.3 1.3 37.1 3.8l-5.1 24.3c-11.8-2.6-23.8-3.9-35.8-3.8-23 0-42.2 10.2-57.6 29.4-15.3 20.5-23 44.8-23 75.5v149.7h-25.6V119h21.7l2.6 49.9h1.3c11.5-20.5 23-34.5 35.8-42.2 15.4-9 30.7-12.9 48.6-12.9zM333.9 12.8h-183v245.6h245.6V76.7c.1-34.5-28.1-63.9-62.6-63.9zm-239.2 0H64c-34.5 0-64 28.1-64 64v30.7h94.7V12.8zM0 165h94.7v94.7H0V165zm301.9 245.6h30.7c34.5 0 64-28.1 64-64V316h-94.7v94.6zm-151-94.6h94.7v94.7h-94.7V316zM0 316v30.7c0 34.5 28.1 64 64 64h30.7V316H0z"></path></g></svg>
                      </div>
                      Ledger
                    </button>
                    <button className="font-bold bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:shadow py-6 rounded focus:outline-none flex flex-col items-center gap-3" onClick={() => { setShowDetail(true); setShowAvatarConnect(true)}}>
                      <div className="w-8 h-8 flex items-center justify-center">
                        <TokenIcon address="zil1hau7z6rjltvjc95pphwj57umdpvv0d6kh2t8zk" />
                      </div>
                      Avatar
                    </button>
                    <button className="font-bold bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:shadow py-6 rounded focus:outline-none flex flex-col items-center gap-3" onClick={() => connectZeeves()}>
                      <div className="w-8 h-8 flex items-center justify-center">
                        <Send />
                      </div>
                      Zeeves
                    </button>
                  </div>

                  <div className="flex flex-col items-stretch mt-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Or enter an address</div>
                    <input type="text" placeholder="zil123.." autoCapitalize="off" autoCorrect="off" className="bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-700 rounded py-3 px-3 text-sm" value={address} onChange={handleAddressChange} onKeyDown={handleAddressKeyDown} />
                  </div>
                </>
              )}

              <button onClick={() => setIsOpen(false)} className="focus:outline-none text-gray-500 text-sm mt-8">Dismiss</button>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default WalletModal