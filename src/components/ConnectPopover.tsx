import { Popover, Transition } from '@headlessui/react'
import { toBech32Address } from '@zilliqa-js/zilliqa'
import React, { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AccountActionTypes } from 'store/account/actions'
import { Network } from 'store/account/reducer'
import { AccountState, ConnectedWallet, RootState } from 'store/types'
import { AccountType } from 'types/walletType.interface'
import ConnectWalletButton from './ConnectWalletButton'

const ConnectPopover = () => {
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const dispatch = useDispatch()
  const [showAvatarConnect, setShowAvatarConnect] = useState(false);
  const [avatarName, setAvatarName] = useState('');
  const [avatarIsLoading, setAvatarIsLoading] = useState(false);
  const [avatarErrorMessage, setAvatarErrorMessage] = useState('');

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
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button className="menu-item-active focus:outline-none flex items-center">
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
                  <>
                    <div className="font-semibold mb-5">Connect wallet</div>
                    <div className="mb-4 flex flex-col items-stretch gap-3 w-full">
                      <ConnectWalletButton walletName={'ZilPay'} connectWallet={() => connectZilPay()}></ConnectWalletButton>
                      <ConnectWalletButton walletName={'Zeeves'} connectWallet={() => connectZeeves()}></ConnectWalletButton>
                      <ConnectWalletButton walletName={'Avatar Connect'} connectWallet={(e: React.MouseEvent) => { setShowAvatarConnect(true) }}></ConnectWalletButton>
                    </div>
                    <div className="text-xs text-gray-400"><span className="font-semibold">Note:</span> Connecting your Wallet does not give ZilStream access to your private keys, and no transactions can be sent. ZilStream does not store your wallet address on its servers.</div>
                  </>
                )}
              </div>
            </Popover.Panel>
          </Transition>
          </>
      )}
    </Popover>
  )
}

export default ConnectPopover