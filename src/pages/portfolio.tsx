import PortfolioBalances from 'components/PortfolioBalances';
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AccountState, RootState, TokenState } from 'store/types';
import { TokenActionTypes } from 'store/token/actions';
import { BatchRequestType, BatchResponse, sendBatchRequest, stakingDelegatorsBatchRequest } from 'utils/batch';
import { fromBech32Address, toBech32Address } from '@zilliqa-js/crypto';
import BigNumber from 'bignumber.js'
import { bnOrZero } from 'utils/strings';
import Head from 'next/head';
import PortfolioPools from 'components/PortfolioPools';
import PortfolioOverview from 'components/PortfolioOverview';
import getPortfolioState from 'lib/zilstream/getPortfolio';
import { Operator, StakingState } from 'store/staking/types';
import { StakingActionTypes } from 'store/staking/actions';
import PortfolioStaking from 'components/PortfolioStaking';
import PortfolioOnboard from 'components/PortfolioOnboard';
import { AccountActionTypes } from 'store/account/actions'
import CopyableAddress from 'components/CopyableAddress';
import LoadingIndicator from 'components/LoadingIndicator';
import { RefreshCw } from 'react-feather';
import { useInterval } from 'utils/interval';
import { Network } from 'utils/network';
import getLatestRates from 'lib/zilstream/getLatestRates';

const Portfolio = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [loadedStaking, setLoadedStaking] = useState<boolean>(false)
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const stakingState = useSelector<RootState, StakingState>(state => state.staking)
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
        <PortfolioOnboard onConnect={() => connectZilPay()} />
      )}
    </>
  )
}

export default Portfolio