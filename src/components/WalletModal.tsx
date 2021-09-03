import { Dialog } from '@headlessui/react'
import { toBech32Address } from '@zilliqa-js/zilliqa';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AccountActionTypes } from 'store/account/actions';
import { ModalActionTypes } from 'store/modal/actions';
import { AccountState, ConnectedWallet, ModalState, RootState } from 'store/types';
import { AccountType } from 'types/walletType.interface';

const WalletModal = () => {
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const modalState = useSelector<RootState, ModalState>(state => state.modal)
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const zilPayButtonRef = useRef(null)

  // Avatar
  const [showAvatarConnect, setShowAvatarConnect] = useState(false);
  const [avatarName, setAvatarName] = useState('');
  const [avatarIsLoading, setAvatarIsLoading] = useState(false);
  const [avatarErrorMessage, setAvatarErrorMessage] = useState('');

  useEffect(() => {
    if(modalState.walletOpen) {
      setIsOpen(true)
      dispatch({ type: ModalActionTypes.OPEN_WALLET, payload: false })
    }
  }, [modalState.walletOpen])

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
    let wallet: ConnectedWallet = {
      address: walletAddress,
      label: '',
      isDefault: accountState.wallets.length === 0,
      isConnected: true,
      type: AccountType.ZilPay
    }
    dispatch({ type: AccountActionTypes.ADD_WALLET, payload: {wallet: wallet}})
    setIsOpen(false)
  }

  const connectZeeves = async () => {
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
      isConnected: false,
      type: AccountType.Zeeves
    }
    dispatch({ type: AccountActionTypes.ADD_WALLET, payload: {wallet: wallet}})
    setIsOpen(false)
  }

  const connectAvatar = async () => {
    if(avatarName === '') {
      setAvatarErrorMessage('Please enter your avatar')
      return
    }
    setAvatarIsLoading(true)

    fetch('https://api.carbontoken.info/api/v1/avatar/' + avatarName)
      .then(response => response.json())
      .then(data => {
        let address = data.address

        let wallet: ConnectedWallet = {
          address: toBech32Address(address),
          label: '',
          isDefault: accountState.wallets.length === 0,
          isConnected: false,
          type: AccountType.Avatar
        }
        dispatch({ type: AccountActionTypes.ADD_WALLET, payload: {wallet: wallet}})

        setAvatarIsLoading(false)
        setIsOpen(false)
      })
      .catch(error => {
        setAvatarErrorMessage('Couldn\'t find your avatar')
        setAvatarIsLoading(false)
      })
  }

  const handleAvatarNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setAvatarName(e.currentTarget.value.replaceAll(' ', '').toLowerCase())
    setAvatarErrorMessage('')
  }

  return (
    <Dialog initialFocus={zilPayButtonRef} open={isOpen} onClose={() => setIsOpen(false)} className="fixed z-10 inset-0 overflow-y-auto">

      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-40" />

        <div className="relative bg-white dark:bg-gray-900 border dark:border-gray-800 py-5 px-5 rounded-lg shadow-lg max-w-sm mx-auto text-center">
          <Dialog.Title className="text-lg font-bold">Add a wallet</Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 dark:text-gray-400">Connect your wallet with ZilPay, Avatar, Zeeves or enter an address.</Dialog.Description>

          {showAvatarConnect ? (
            <>
              <div className="font-semibold mb-5">Avatar Connect</div>
              <div className="mb-4 flex flex-col items-stretch gap-3 w-full">
                <input onChange={handleAvatarNameChange} type="text" placeholder="Your avatar name" className="py-2 px-3 rounded-lg focus:outline-none bg-gray-200 dark:bg-gray-600" />
                {avatarErrorMessage !== '' &&
                  <span className="text-sm text-center text-red-500">{avatarErrorMessage}</span>
                }
                <button onClick={() => connectAvatar()} disabled={avatarIsLoading} className="bg-gray-300 dark:bg-gray-700 py-2 px-6 rounded-lg font-medium focus:outline-none">Connect</button>
                <button onClick={(e: React.MouseEvent) => { setShowAvatarConnect(false) }} className="bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 text-gray-600 dark:text-gray-400 py-2 px-6 rounded-lg font-medium focus:outline-none">Go back</button>
                <a href="https://avatar.carbontoken.info/?ref=zilstream" className="text-xs text-center font-normal text-gray-300 mt-1" target="_blank">Learn more about Avatar</a>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-stretch gap-2 my-4">
              <button ref={zilPayButtonRef} className="font-bold bg-gray-800 shadow py-2 rounded focus:outline-none" onClick={() => connectZilPay()}>ZilPay</button>
              <button className="font-bold bg-gray-800 shadow py-2 rounded focus:outline-none" onClick={() => setShowAvatarConnect(true)}>Avatar</button>
              <button className="font-bold bg-gray-800 shadow py-2 rounded focus:outline-none" onClick={() => connectZeeves()}>Zeeves</button>

              <div className="flex flex-col items-stretch mt-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Or enter an address</div>
                <input type="text" placeholder="Address" className="bg-gray-800 bg-opacity-50 ring-primaryDark rounded py-2 px-3" />
              </div>
            </div>
          )}

          <button onClick={() => setIsOpen(false)} className="focus:outline-none text-gray-500 text-sm">Dismiss</button>
        </div>
      </div>
    </Dialog>
  )
}

export default WalletModal