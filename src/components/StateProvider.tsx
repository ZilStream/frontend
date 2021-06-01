import getLatestRates from 'lib/zilstream/getLatestRates'
import getTokens from 'lib/zilstream/getTokens'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AccountActionTypes } from 'store/account/actions'
import { TokenActionTypes } from 'store/token/actions'

interface Props {
  children: React.ReactNode
}

const StateProvider = (props: Props) => {
  const dispatch = useDispatch()

  async function loadTokens() {
    const tokens = await getTokens()
    dispatch({type: TokenActionTypes.TOKEN_INIT, payload: {tokens}})
    loadRates()
  }

  async function loadRates() {
    const latestRates = await getLatestRates()
    latestRates.forEach(rate => {
      dispatch({type: TokenActionTypes.TOKEN_UPDATE, payload: {
        address_bech32: rate.address,
        rate: rate.rate
      }})
    })

    dispatch({type: TokenActionTypes.TOKEN_INITIALIZED})
  }

  useEffect(() => {
    loadTokens()
  }, [])

  useEffect(() => {
    const zilPay = (window as any).zilPay
    
    try {
      if(typeof zilPay !== "undefined") {
        
        if(zilPay.wallet.isConnect) {
          const walletAddress = zilPay.wallet.defaultAccount.bech32
          const network = zilPay.wallet.net
          
          dispatch({ type: AccountActionTypes.NETWORK_UPDATE, payload: network })
          dispatch({ type: AccountActionTypes.WALLET_UPDATE, payload: walletAddress })
  
          zilPay.wallet.observableAccount().subscribe(function(account: any) {
            dispatch({ type: AccountActionTypes.WALLET_UPDATE, payload: account.bech32 })
          })
    
          zilPay.wallet.observableNetwork().subscribe(function(network: any) {
            dispatch({ type: AccountActionTypes.NETWORK_UPDATE, payload: network })
          })
        }
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  return <>{props.children}</>
}

export default StateProvider