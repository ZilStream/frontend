import { toBech32Address } from '@zilliqa-js/crypto';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AccountActionTypes } from 'store/account/actions';
import { AccountState, ConnectedWallet, RootState } from 'store/types';
import { AccountType } from 'types/walletType.interface';

interface Props {
  onClose?: (() => void)
}

const ConnectAvatar = (props: Props) => {
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const dispatch = useDispatch()

  const [avatarName, setAvatarName] = useState('');
  const [avatarIsLoading, setAvatarIsLoading] = useState(false);
  const [avatarErrorMessage, setAvatarErrorMessage] = useState('');

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
          isMember: false,
          type: AccountType.Avatar
        }
        dispatch({ type: AccountActionTypes.ADD_WALLET, payload: {wallet: wallet}})

        setAvatarIsLoading(false)
        props.onClose?.()
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
    <>
      <div className="flex flex-col items-stretch gap-3 w-full mt-4 py-8">
        <input onChange={handleAvatarNameChange} type="text" placeholder="Your avatar name" className="py-2 px-3 rounded-lg focus:outline-none bg-gray-200 dark:bg-gray-600" />
        {avatarErrorMessage !== '' &&
          <span className="text-sm text-center text-red-500">{avatarErrorMessage}</span>
        }
        <button onClick={() => connectAvatar()} disabled={avatarIsLoading} className="bg-gray-300 dark:bg-gray-700 py-2 px-6 rounded-lg font-medium focus:outline-none">Connect</button>
        {/* <button onClick={(e: React.MouseEvent) => { setShowAvatarConnect(false) }} className="bg-gray-300 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 text-gray-600 dark:text-gray-400 py-2 px-6 rounded-lg font-medium focus:outline-none">Go back</button> */}
        <a href="https://avatar.carbontoken.info/?ref=zilstream" className="text-xs text-center font-normal text-gray-300 mt-1" target="_blank">Learn more about Avatar</a>
      </div>
    </>
  )
}

export default ConnectAvatar