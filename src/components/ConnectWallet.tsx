import React from 'react'
import { useDispatch } from 'react-redux'
import { AccountActionTypes } from 'store/account/actions'
import { Network } from 'store/account/reducer'
import ConnectWalletButton from './ConnectWalletButton'

interface Props {
  innerRef: React.RefObject<HTMLDivElement>
  dismissAction: () => void
}

const ConnectWallet = (props: Props) => {
  const dispatch = useDispatch()

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
    
    props.dismissAction()
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
    
    props.dismissAction()
  } 

  return (
    <div className="absolute z-50 top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center bg-black bg-opacity-60">
      <div ref={props.innerRef} className="p-6 w-128 bg-white dark:bg-gray-700 rounded-lg flex flex-col items-center">
        <div className="font-bold text-xl">Connect your wallet</div>
        <div className="py-12 flex items-stretch gap-10">
          <ConnectWalletButton walletName={'ZilPay'} connectWallet={() => connectZilPay()}></ConnectWalletButton>
          <ConnectWalletButton walletName={'Zeeves'} connectWallet={() => connectZeeves()}></ConnectWalletButton>
        </div>
        <div className="text-sm text-gray-400"><span className="font-semibold">Note:</span> Connecting your Wallet does not give ZilStream access to your private keys, and no transactions can be sent. ZilStream does not store your wallet address on its servers.</div>
      </div>
    </div>
  )
}

export default ConnectWallet