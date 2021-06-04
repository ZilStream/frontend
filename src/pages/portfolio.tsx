import PortfolioBalances from 'components/PortfolioBalances';
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AccountState, RootState } from 'store/types';
import Head from 'next/head';
import PortfolioPools from 'components/PortfolioPools';
import PortfolioOverview from 'components/PortfolioOverview';
import PortfolioStaking from 'components/PortfolioStaking';
import PortfolioOnboard from 'components/PortfolioOnboard';
import { AccountActionTypes } from 'store/account/actions'
import CopyableAddress from 'components/CopyableAddress';
import ConnectWalletButton from 'components/ConnectWalletButton';
import { Network } from 'utils/network';

const Portfolio = () => {
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const dispatch = useDispatch()

  let walletAddress = accountState.address

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
    const zeeves = (window as any).Zeeves
    
    if (!zeeves) {
      throw new Error('Zeeves is not supported');
    }
      
    //authentication in Zeeves
    const walletInfo = await zeeves.getSession();
  
    dispatch({ type: AccountActionTypes.NETWORK_UPDATE, payload: Network.MainNet });
    dispatch({ type: AccountActionTypes.WALLET_UPDATE, payload: walletInfo.bech32 });

    localStorage.setItem('zilpay', 'false');
  }

  return (
    <>
      <Head>
        <title>Portfolio | ZilStream</title>
        <meta property="og:title" content={`Portfolio | ZilStream`} />
      </Head>
      {walletAddress !== '' ? (
        <>
          <div className="py-8 flex items-center">
            <div className="flex-grow">
              <h1 className="flex-grow">Portfolio</h1>
              <CopyableAddress address={walletAddress} />
            </div>
            {/* <div>
              {isLoading ? (
                <LoadingIndicator />
              ) : (
                <button onClick={() => fetchState(walletAddress)}>
                  <RefreshCw size={20} className="text-gray-500 hover:text-black dark:hover:text-white" />
                </button>
              )}
            </div> */}
          </div>
          <div className="max-w-full flex flex-col sm:flex-row items-start">
            <PortfolioOverview />
            <div className="max-w-full mt-6 sm:mt-0 flex-grow flex flex-col items-stretch">
              <PortfolioBalances />
              <PortfolioPools />
              <PortfolioStaking />
            </div>
          </div>
        </>
      ) : (
        <PortfolioOnboard>
          <ConnectWalletButton walletName={'ZilPay'} connectWallet={() => connectZilPay()}></ConnectWalletButton>
          <ConnectWalletButton walletName={'Zeeves'} connectWallet={() => connectZeeves()}></ConnectWalletButton>
        </PortfolioOnboard>
      )}
    </>
  )
}

export default Portfolio