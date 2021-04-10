import PortfolioBalances from 'components/PortfolioBalances';
import PortfolioOnboard from 'components/PortfolioOnboard'
import getTokens from 'lib/zilstream/getTokens';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, TokenState } from 'store/types';
import {wrapper} from 'store/store'
import { TokenActionTypes } from 'store/token/actions';
import { balanceBatchRequest, BatchRequestType, sendBatchRequest, tokenBalanceBatchRequest } from 'utils/batch';
import { Network } from 'utils/network';
import { fromBech32Address } from '@zilliqa-js/crypto';
import BigNumber from 'bignumber.js'
import { bnOrZero } from 'utils/strings';
import { SimpleRate } from 'types/rate.interface';
import getLatestRates from 'lib/zilstream/getLatestRates';

interface Props {
  latestRates: SimpleRate[]
}

export const getServerSideProps = wrapper.getServerSideProps(async ({store}) => {
  const tokens = await getTokens()
  const latestRates = await getLatestRates()
  
  store.dispatch({type: TokenActionTypes.TOKEN_INIT, payload: {tokens}})

  return {
    props: {
      latestRates: latestRates
    },
  }
})

const Portfolio: NextPage<Props> = ({ latestRates }) => {
  const [walletAddress, setWalletAddress] = useState<string|null>(null);
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const dispatch = useDispatch()
  
  useEffect(() => {
    setWalletAddress(localStorage.getItem('wallet_address'))
  }, [])

  useEffect(() => {
    // Save the wallet address
    if(walletAddress) {
      localStorage.setItem('wallet_address', walletAddress)
    }

    if(walletAddress == null) { return }

    async function fetchBalances(walletAddress: string) {
      // Retrieve wallet balances
      const batchRequests: any[] = [];
      tokenState.tokens.forEach(token => {
        if(token.address_bech32 === 'zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz') {
          batchRequests.push(balanceBatchRequest(token, walletAddress))
        } else {
          batchRequests.push(tokenBalanceBatchRequest(token, walletAddress))
        }
      })

      const batchResults = await sendBatchRequest(Network.MainNet, batchRequests)

      batchResults.forEach(result => {
        let token = result.request.token

        switch(result.request.type) {
          case BatchRequestType.Balance: {
            dispatch({type: TokenActionTypes.TOKEN_UPDATE, payload: {
              address_bech32: token.address_bech32,
              balance: result.result.balance,
              isZil: true,
            }})
            return
          }

          case BatchRequestType.TokenBalance: {
            let walletAddr = fromBech32Address(walletAddress).toLowerCase()
            let balance: BigNumber | undefined;

            if(result.result) {
              balance = bnOrZero(result.result.balances[walletAddr])
            }

            dispatch({type: TokenActionTypes.TOKEN_UPDATE, payload: {
              address_bech32: token.address_bech32,
              balance: balance
            }})
            return
          }
        }
      })
    }

    fetchBalances(walletAddress)
    
  }, [walletAddress])

  function selectWallet(address: string) {
    setWalletAddress(address)
  }

  if(walletAddress == null) return <PortfolioOnboard onSelectAddress={selectWallet} />

  return <PortfolioBalances 
    walletAddress={walletAddress} 
    tokens={tokenState.tokens} 
    latestRates={latestRates} 
  />
}

export default Portfolio