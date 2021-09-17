import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AccountActionTypes } from 'store/account/actions'
import { AccountState, ConnectedWallet, RootState } from 'store/types'
import { AccountType } from 'types/walletType.interface'
import ZilliqaHW from 'utils/ledger'

interface Props {
  onClose?: (() => void)
}

const ConnectLedger = (props: Props) => {
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const dispatch = useDispatch()

  const [hwIndex, setHwIndex] = useState(0)
  const [address, setAddress] = useState('')

  useEffect(() => {
    connect()
  }, [])

  const connect = async () => {
    try {
      const transport = await ZilliqaHW.create()
      const ledger = new ZilliqaHW(transport)
      const data = await ledger.getPublicAddress(hwIndex)
      console.log(data.pubAddr)

      let wallet: ConnectedWallet = {
        address: data.pubAddr,
        label: '',
        isDefault: accountState.wallets.length === 0,
        isConnected: false,
        isMember: false,
        type: AccountType.Ledger
      }
      dispatch({ type: AccountActionTypes.ADD_WALLET, payload: {wallet: wallet}})

      props.onClose?.()
    } catch(err: any) {
      console.log(err.message)
    }
  }

  return (
    <div className="py-8">
      <div>Connect your ledger. Make sure you have the Zilliqa app opened on your Ledger.</div>
    </div>
  )
}

export default ConnectLedger