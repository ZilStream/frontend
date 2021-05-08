import PortfolioBalances from 'components/PortfolioBalances';
import getTokens from 'lib/zilstream/getTokens';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AccountState, RootState, TokenState } from 'store/types';
import {wrapper} from 'store/store'
import { TokenActionTypes } from 'store/token/actions';
import { BatchRequestType, BatchResponse, sendBatchRequest, stakingDelegatorsBatchRequest } from 'utils/batch';
import { fromBech32Address, toBech32Address } from '@zilliqa-js/crypto';
import BigNumber from 'bignumber.js'
import { bnOrZero } from 'utils/strings';
import { SimpleRate } from 'types/rate.interface';
import getLatestRates from 'lib/zilstream/getLatestRates';
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

interface Props {
  latestRates: SimpleRate[]
}

export const getServerSideProps = wrapper.getServerSideProps(async ({store}) => {
  if(store.getState().token.tokens.length === 0) {
    const tokens = await getTokens()
    store.dispatch({type: TokenActionTypes.TOKEN_INIT, payload: {tokens}})
  }
  
  const latestRates = await getLatestRates()

  return {
    props: {
      latestRates: latestRates
    },
  }
})

const Portfolio: NextPage<Props> = ({ latestRates }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [loadedStaking, setLoadedStaking] = useState<boolean>(false)
  const [rates, setRates] = useState<SimpleRate[]>(latestRates)
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const stakingState = useSelector<RootState, StakingState>(state => state.staking)
  const dispatch = useDispatch()

  let walletAddress = accountState.address

  useEffect(() => {
    if(localStorage.getItem('zilpay') === 'true')
      connectZilPay()
  }, [])

  useEffect(() => {
    if(walletAddress === '') { return }

    fetchState(walletAddress)
  }, [walletAddress])

  useEffect(() => {
    if(loadedStaking == true || stakingState.operators.length === 0) return
    setLoadedStaking(true)
    fetchStakingState()
  }, [stakingState])

  useInterval(async () => {
    fetchLatestRates()
    fetchState(walletAddress)
  }, 30000)

  async function fetchLatestRates() {
    const updatedRates = await getLatestRates()
    setRates(updatedRates)
  }

  async function fetchState(walletAddress: string) {
    setIsLoading(true)

    let batchResults = await getPortfolioState(walletAddress, tokenState.tokens, stakingState.operators)
    await processBatchResults(batchResults)

    setIsLoading(false)
  }

  async function fetchStakingState() {
    const batchRequests: any[] = [];
    stakingState.operators.forEach(operator => {
      batchRequests.push(stakingDelegatorsBatchRequest(operator, walletAddress))
    })
    let batchResults = await sendBatchRequest(Network.MainNet, batchRequests)
    await processBatchResults(batchResults)
  }

  async function processBatchResults(batchResults: BatchResponse[]) {
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
            const userContribution = new BigNumber(0)

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
            let userContribution = new BigNumber(0)
            dispatch({type: TokenActionTypes.TOKEN_UPDATE_POOL, payload: {
              address: token?.address_bech32,
              userContribution
            }})
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
              comission: new BigNumber(ssnlist[address].arguments[6]),
              symbol: 'ZIL',
              decimals: 12
            })
          })

          dispatch({ type: StakingActionTypes.STAKING_INIT, payload: { operators: operators }})
          return
        }

        case BatchRequestType.StakingDelegators: {
          if(result.result !== null) {
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
          }
          return
        }

        case BatchRequestType.CarbonStakers: {
          if(result.result === null) return

          let stakers: number[]  = Object.values(result.result.stakers)
          if(stakers.length === 0) return

          dispatch({ type: StakingActionTypes.STAKING_ADD, payload: { operator: {
            name: 'Carbon',
            address: '0x38e3e35a151c472f0c446f258c585f27d2b69140',
            staked: new BigNumber(stakers[0]),
            symbol: 'CARB',
            decimals: 8
          }}})
        }
      }
    })
  }

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
            <div>
              {isLoading ? (
                <LoadingIndicator />
              ) : (
                <button onClick={() => fetchState(walletAddress)}>
                  <RefreshCw size={20} className="text-gray-500 hover:text-black dark:hover:text-white" />
                </button>
              )}
            </div>
          </div>
          <div className="max-w-full flex flex-col sm:flex-row items-start">
            <PortfolioOverview
              tokens={tokenState.tokens}
              latestRates={rates}
              operators={stakingState.operators}
            />
            <div className="max-w-full mt-6 sm:mt-0 flex-grow flex flex-col items-stretch">
              <PortfolioBalances 
                walletAddress={walletAddress} 
                tokens={tokenState.tokens} 
                latestRates={rates} 
              />
              <PortfolioPools
                tokens={tokenState.tokens}
                zilRate={rates.filter(rate => rate.address == 'zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz')[0]}
              />
              <PortfolioStaking
                walletAddress={accountState.address}
                operators={stakingState.operators}
                latestRates={rates}
              />
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