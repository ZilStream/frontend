import { fromBech32Address, toBech32Address } from '@zilliqa-js/crypto'
import BigNumber from 'bignumber.js'
import getLatestRates from 'lib/zilstream/getLatestRates'
import getPortfolioState from 'lib/zilstream/getPortfolio'
import getTokens from 'lib/zilstream/getTokens'
import React, { useEffect, useState } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'
import { AccountActionTypes } from 'store/account/actions'
import { StakingActionTypes } from 'store/staking/actions'
import { TokenActionTypes } from 'store/token/actions'
import { AccountState, Operator, RootState, StakingState, TokenState } from 'store/types'
import { BatchRequestType, BatchResponse, sendBatchRequest, stakingDelegatorsBatchRequest } from 'utils/batch'
import { useInterval } from 'utils/interval'
import { Network } from 'utils/network'
import { bnOrZero } from 'utils/strings'

interface Props {
  children: React.ReactNode
}

const StateProvider = (props: Props) => {
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const stakingState = useSelector<RootState, StakingState>(state => state.staking)
  const dispatch = useDispatch()
  const [stakingLoaded, setStakingLoaded] = useState(false)

  async function loadTokens() {
    const tokens = await getTokens()
    dispatch({type: TokenActionTypes.TOKEN_INIT, payload: {tokens}})
    loadRates()
  }

  async function loadRates() {
    const latestRates = await getLatestRates()
    batch(() => {
      latestRates.forEach(rate => {
        dispatch({type: TokenActionTypes.TOKEN_UPDATE, payload: {
          address_bech32: rate.address,
          rate: rate.rate,
          isZil: rate.address === 'zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz',
          isStream: rate.address === 'zil1504065pp76uuxm7s9m2c4gwszhez8pu3mp6r8c'
        }})
      })
      dispatch({type: TokenActionTypes.TOKEN_INITIALIZED})
    })
  }

  async function loadWalletState() {
    if(accountState.address === '' || tokenState.initialized === false) return

    let batchResults = await getPortfolioState(accountState.address, tokenState.tokens, stakingState.operators)
    await processBatchResults(batchResults)
  }

  async function fetchStakingState() {
    const batchRequests: any[] = [];
    stakingState.operators.forEach(operator => {
      batchRequests.push(stakingDelegatorsBatchRequest(operator, accountState.address))
    })
    let batchResults = await sendBatchRequest(Network.MainNet, batchRequests)
    await processBatchResults(batchResults)
  }

  async function processBatchResults(batchResults: BatchResponse[]) {
    batch(() => {
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
            let walletAddr = fromBech32Address(accountState.address).toLowerCase()
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
            let walletAddr = fromBech32Address(accountState.address).toLowerCase()
  
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
                let amount: any = ssnDelegators[address][fromBech32Address(accountState.address).toLowerCase()]
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
    })
  }

  useInterval(async () => {
    loadRates()
    loadWalletState()
  }, 30000)

  useEffect(() => {
    loadTokens()
  }, [])

  useEffect(() => {
    loadWalletState()
  }, [accountState.address, tokenState.initialized])

  useEffect(() => {
    if(stakingState.operators.length === 0 || stakingLoaded) return
    setStakingLoaded(true)
    fetchStakingState()
  }, [stakingState])

  useEffect(() => {
    const zilPay = (window as any).zilPay
    
    if(typeof zilPay !== "undefined" && localStorage.getItem('zilpay') === 'true') {
      try {
        const walletAddress = zilPay.wallet.defaultAccount.bech32
        const network = zilPay.wallet.net
        
        dispatch({ type: AccountActionTypes.NETWORK_UPDATE, payload: network })
        dispatch({ type: AccountActionTypes.WALLET_UPDATE, payload: walletAddress })

        zilPay.wallet.observableAccount().subscribe(function(account: any) {
          dispatch({ type: AccountActionTypes.WALLET_UPDATE, payload: account.bech32 })
        })
  
        zilPay.wallet.observableNetwork().subscribe(function(network: any) {
          dispatch({ type: AccountActionTypes.NETWORK_UPDATE, payload: network })
        })
      } catch (e) {
        console.error(e)
      }
    } else if(localStorage.getItem('avatar') !== null && localStorage.getItem('avatar') !== '') {
      fetch('https://api.carbontoken.info/api/v1/avatar/' + localStorage.getItem('avatar'))
      .then(response => response.json())
      .then(data => {
        let address = data.address
        dispatch({ type: AccountActionTypes.NETWORK_UPDATE, payload: Network.MainNet });
        dispatch({ type: AccountActionTypes.WALLET_UPDATE, payload: toBech32Address(address) });
      })
      .catch(error => {
        console.log('Avatar doesn\'t exist')
        localStorage.removeItem('avatar')
      })
    }
  }, [])

  if (typeof(window) !== 'undefined') {
    // @ts-ignore
    import('zeeves-auth-sdk-js');
  }
  
  return <>{props.children}</>
}

export default StateProvider