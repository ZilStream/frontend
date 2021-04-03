import PortfolioBalances from 'components/PortfolioBalances';
import PortfolioOnboard from 'components/PortfolioOnboard'
import getTokens from 'lib/zilstream/getTokens';
import { InferGetServerSidePropsType } from 'next';
import React, { useEffect, useState } from 'react'

export const getServerSideProps = async () => {
  const tokens = await getTokens()

  return {
    props: {
      tokens,
    },
  }
}

function Portfolio({ tokens }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [walletAddress, setWalletAddress] = useState<string|null>(null);

  useEffect(() => {
    setWalletAddress(localStorage.getItem('wallet_address'))
  }, [])

  useEffect(() => {
    // Save the wallet address
    if(walletAddress) {
      localStorage.setItem('wallet_address', walletAddress)
    }

    // Retrieve wallet balances
    const batchRequests: any[] = [];
    tokens.forEach(token => {
      if(token.symbol == "ZIL") {
        
      } else {

      }
    })
  }, [walletAddress])

  function selectWallet(address: string) {
    setWalletAddress(address)
  }

  if(walletAddress == null) return <PortfolioOnboard onSelectAddress={selectWallet} />

  return <PortfolioBalances walletAddress={walletAddress} tokens={tokens} />
}

export default Portfolio