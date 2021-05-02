import PortfolioBalances from 'components/PortfolioBalances';
import getTokens from 'lib/zilstream/getTokens';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AccountState, RootState, TokenState } from 'store/types';
import {wrapper} from 'store/store'
import { add, TokenActionTypes } from 'store/token/actions';
import { BatchRequestType } from 'utils/batch';
import { fromBech32Address, toBech32Address } from '@zilliqa-js/crypto';
import BigNumber from 'bignumber.js'
import { bnOrZero } from 'utils/strings';
import { SimpleRate } from 'types/rate.interface';
import getLatestRates from 'lib/zilstream/getLatestRates';
import Head from 'next/head';
import useMoneyFormatter from 'utils/useMoneyFormatter';
import PortfolioPools from 'components/PortfolioPools';
import PortfolioOverview from 'components/PortfolioOverview';
import getPortfolioState from 'lib/zilstream/getPortfolio';
import { Operator, StakingState } from 'store/staking/types';
import { init, StakingActionTypes } from 'store/staking/actions';
import PortfolioStaking from 'components/PortfolioStaking';

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
  const [walletAddress, setWalletAddress] = useState<string>('');
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const stakingState = useSelector<RootState, StakingState>(state => state.staking)
  const dispatch = useDispatch()
  const moneyFormat = useMoneyFormatter({ maxFractionDigits: 5 })
  
  useEffect(() => {
    setWalletAddress(accountState.address)
  }, [accountState])

  useEffect(() => {
    if(walletAddress === '') { return }

    async function fetchState(walletAddress: string) {
      let batchResults = await getPortfolioState(walletAddress, tokenState.tokens)

      batchResults.forEach(result => {
        let token = result.request.token

        switch(result.request.type) {
          case BatchRequestType.Balance: {
            dispatch({type: TokenActionTypes.TOKEN_UPDATE, payload: {
              address_bech32: token?.address_bech32,
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
              address_bech32: token?.address_bech32,
              balance: balance
            }})
            return
          }

          case BatchRequestType.Pools: {
            let pools = result.result.pools
            Object.keys(pools).forEach(address => {
              let pool = pools[address]

              const [x, y] = pool.arguments
              const zilReserve = new BigNumber(x)
              const tokenReserve = new BigNumber(y)
              const exchangeRate = zilReserve.dividedBy(tokenReserve)

              dispatch({type: TokenActionTypes.TOKEN_UPDATE_POOL, payload: {
                address: toBech32Address(address),
                zilReserve,
                tokenReserve,
                exchangeRate
              }})
            })
            return
          }

          case BatchRequestType.PoolBalance: {
            let tokenAddress = fromBech32Address(token!.address_bech32).toLowerCase()
            let walletAddr = fromBech32Address(walletAddress).toLowerCase()

            if(result.result === null) {
              return
            }

            let balances = result.result.balances[tokenAddress]
            let userContribution = new BigNumber(balances ? balances[walletAddr] || 0 : 0)
            
            dispatch({type: TokenActionTypes.TOKEN_UPDATE_POOL, payload: {
              address: token?.address_bech32,
              userContribution
            }})
            return
          }

          case BatchRequestType.TotalContributions: {
            let totalContributions = result.result.total_contributions
            Object.keys(totalContributions).forEach(address => {
              dispatch({type: TokenActionTypes.TOKEN_UPDATE_POOL, payload: {
                address: toBech32Address(address),
                totalContribution: new BigNumber(totalContributions[address])
              }})
            })
            return
          }

          case BatchRequestType.StakingOperators: {
            let ssnlist: any[] = result.result.ssnlist
            
            var operators: Operator[] = []
            Object.keys(ssnlist).forEach(ssnAddress => {
              let address: any = ssnAddress
              operators.push({
                name: ssnlist[address].arguments[3],
                address: address,
              })
            })

            dispatch(init({operators: operators}))
            return
          }

          case BatchRequestType.StakingDelegators: {
            let ssnDelegators: any[] = result.result.ssn_deleg_amt
            Object.keys(ssnDelegators).forEach(ssnAddress => {
              let address: any = ssnAddress
              let amount: any = ssnDelegators[address][fromBech32Address(walletAddress).toLowerCase()]
              let staked = new BigNumber(amount)
              dispatch({type: StakingActionTypes.STAKING_UPDATE, payload: {
                address: ssnAddress,
                staked
              }}) 
            })
            return
          }
        }
      })
    }

    fetchState(walletAddress)
  }, [walletAddress])
  
  return (
    <>
      <Head>
        <title>Portfolio | ZilStream</title>
        <meta property="og:title" content={`Portfolio | ZilStream`} />
      </Head>
      <div className="py-8 flex items-center">
        <div className="flex-grow">
          <h1 className="flex-grow">Portfolio</h1>
          <div className="text-gray-600">{walletAddress}</div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start">
        <PortfolioOverview
          tokens={tokenState.tokens}
          latestRates={latestRates}
          operators={stakingState.operators}
        />
        <div className="mt-6 sm:mt-0 flex-grow flex flex-col items-stretch">
          <PortfolioBalances 
            walletAddress={walletAddress} 
            tokens={tokenState.tokens} 
            latestRates={latestRates} 
          />
          <PortfolioPools
            tokens={tokenState.tokens}
          />
          <PortfolioStaking
            walletAddress={accountState.address}
            operators={stakingState.operators}
          />
        </div>
      </div>
    </>
  )
}

export default Portfolio