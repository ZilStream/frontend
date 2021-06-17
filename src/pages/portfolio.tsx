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

  let walletAddress = accountState.address

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
        <PortfolioOnboard />
      )}
    </>
  )
}

export default Portfolio