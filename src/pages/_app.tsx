import React, { FC, useEffect } from 'react'
import { wrapper } from 'store/store'
import type { AppProps } from 'next/app'
import '../styles/tailwind.css'
import '../styles/styles.css'
import Layout from '../components/Layout'
import { ThemeProvider } from 'next-themes'
import { useDispatch } from 'react-redux'
import { AccountActionTypes } from 'store/account/actions'

const WrappedApp: FC<AppProps> = ({ Component, pageProps }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    const zilPay = (window as any).zilPay

    if(typeof zilPay !== "undefined") {
      if(zilPay.wallet.isConnect) {
        const walletAddress = zilPay.wallet.defaultAccount.bech32
        const network = zilPay.wallet.net
        
        dispatch({ type: AccountActionTypes.NETWORK_UPDATE, payload: network })
        dispatch({ type: AccountActionTypes.WALLET_UPDATE, payload: walletAddress })
      }

      zilPay.wallet.observableAccount().subscribe(function(account: any) {
        dispatch({ type: AccountActionTypes.WALLET_UPDATE, payload: account.bech32 })
      })

      zilPay.wallet.observableNetwork().subscribe(function(network: any) {
        dispatch({ type: AccountActionTypes.NETWORK_UPDATE, payload: network })
      })
    }
  }, [])

  return (
    <ThemeProvider defaultTheme="system" enableSystem={true} attribute="class">
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}

export default wrapper.withRedux(WrappedApp)

