import PortfolioOnboard from 'components/PortfolioOnboard'
import Head from 'next/head'
import React, { useState } from 'react'

function Portfolio() {
  const [walletAddress, setWalletAddress] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  function selectWallet(address: string) {
    setWalletAddress(address)
  }

  return (
    <>
      <Head>
        <title>Portfolio | ZilStream</title>
        <meta property="og:title" content={`Portfolio | ZilStream`} />
      </Head>

      {walletAddress == null &&
        <PortfolioOnboard onSelectAddress={selectWallet} />
      }
      
    </>
  )
}

export default Portfolio