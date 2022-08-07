import PortfolioBalances from 'components/PortfolioBalances';
import React from 'react'
import { useSelector } from 'react-redux'
import { AccountState, RootState } from 'store/types';
import Head from 'next/head';
import PortfolioPools from 'components/PortfolioPools';
import PortfolioOverview from 'components/PortfolioOverview';
import PortfolioStaking from 'components/PortfolioStaking';
import PortfolioOnboard from 'components/PortfolioOnboard';
import PortfolioHeader from 'components/PortfolioHeader';
import Membership from 'pages/membership';
import PortfolioCollections from 'components/PortfolioCollections';

const Portfolio = () => {
  const accountState = useSelector<RootState, AccountState>(state => state.account)

  if(accountState.selectedWallet === null) {
    return <Membership />
  }

  return (
    <>
      <Head>
        <title>Portfolio | ZilStream</title>
        <meta property="og:title" content={`Portfolio | ZilStream`} />
      </Head>

      <PortfolioHeader />

      <div className="max-w-full flex flex-col sm:flex-row items-start">
        <PortfolioOverview />
        <div className="max-w-full mt-6 sm:mt-0 flex-grow flex flex-col items-stretch">
          <PortfolioBalances />
          <PortfolioPools />
          <PortfolioStaking />
          <PortfolioCollections />
        </div>
      </div>
    </>
  )
}

export default Portfolio