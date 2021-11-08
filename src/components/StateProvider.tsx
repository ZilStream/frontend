import { fromBech32Address, toBech32Address } from '@zilliqa-js/crypto'
import BigNumber from 'bignumber.js'
import getZilRates from 'lib/coingecko/getZilRates'
import getLatestRates from 'lib/zilstream/getLatestRates'
import getPortfolioState from 'lib/zilstream/getPortfolio'
import getTokens from 'lib/zilstream/getTokens'
import React, { useEffect, useState } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'
import { AccountActionTypes } from 'store/account/actions'
import { CurrencyActionTypes } from 'store/currency/actions'
import { updateSettings } from 'store/settings/actions'
import { StakingActionTypes } from 'store/staking/actions'
import { TokenActionTypes } from 'store/token/actions'
import { AccountState, Operator, RootState, SettingsState, StakingState, TokenState } from 'store/types'
import { getTokenAPR } from 'utils/apr'
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
  const settingsState = useSelector<RootState, SettingsState>(state => state.settings)
  const dispatch = useDispatch()
  const [stakingLoaded, setStakingLoaded] = useState(false)

  async function loadTokens() {
    const tokens = await getTokens()
    dispatch({type: TokenActionTypes.TOKEN_INIT, payload: {tokens}})

    const favoritesString = localStorage.getItem('favorites') ?? ''
    var favorites = favoritesString.split(',')

    batch(() => {
      favorites.forEach(address => {
        dispatch({type: TokenActionTypes.TOKEN_UPDATE, payload: {
          address_bech32: address,
          isFavorited: true
        }})
      })
    })

    await loadRates()
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

  async function setTokenAPRs() {
    batch(() => {
      tokenState.tokens.forEach(token => {
        const apr = getTokenAPR(token, tokenState)
        dispatch({type: TokenActionTypes.TOKEN_UPDATE, payload: {
          address_bech32: token.address_bech32,
          apr: apr
        }})
      })
    })
  }

  async function loadZilRates() {
    const zilRates = await getZilRates()
    batch(() => {
      Object.entries(zilRates.zilliqa).map(([key, value]: [string, any]) => {
        dispatch({type: CurrencyActionTypes.CURRENCY_UPDATE, payload: {
          code: key.toUpperCase(),
          rate: value as number
        }})
      })

      dispatch({type: CurrencyActionTypes.CURRENCY_SELECT, payload: {currency: localStorage.getItem('selectedCurrency') ?? 'USD'}})
    })
  }

  async function loadWalletState() {
    if(!accountState.selectedWallet || tokenState.initialized === false) return
    let batchResults = await getPortfolioState(accountState.selectedWallet.address, tokenState.tokens, stakingState.operators)

    await processBatchResults(batchResults)
  }

  async function fetchStakingState() {
    if(!accountState.selectedWallet) return
    const walletAddress = accountState.selectedWallet.address
    
    const batchRequests: any[] = [];
    stakingState.operators.forEach(operator => {
      batchRequests.push(stakingDelegatorsBatchRequest(operator, walletAddress))
    })
    let batchResults = await sendBatchRequest(Network.MainNet, batchRequests)
    await processBatchResults(batchResults)
  }

  async function processBatchResults(batchResults: BatchResponse[]) {
    if(!accountState.selectedWallet) return
    const walletAddress = accountState.selectedWallet.address

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
    })
  }

  async function loadSettings() {
    const settingsStr = localStorage.getItem('settings')

    if(settingsStr) {
      const settings: SettingsState = JSON.parse(settingsStr)
      dispatch(updateSettings({
        ...settings,
        initialized: true
      }))
    }
  }

  useInterval(async () => {
    loadRates()
    loadWalletState()
    loadZilRates()
  }, 30000)

  useEffect(() => {
    loadSettings()
    loadTokens()
    loadZilRates()
  }, [])

  useEffect(() => {
    if(!tokenState.initialized) return
    setTokenAPRs()
  }, [tokenState.initialized])

  useEffect(() => {
    if(!tokenState.initialized || !accountState.selectedWallet) return
    loadWalletState()
  }, [accountState.selectedWallet, tokenState.initialized])

  useEffect(() => {
    if(stakingState.operators.length === 0 || stakingLoaded) return
    setStakingLoaded(true)
    fetchStakingState()
  }, [stakingState])

  useEffect(() => {
    if(!accountState.initialized) return
    // This makes sure all account changes persist.
    localStorage.setItem('account', JSON.stringify(accountState))
  }, [accountState])

  useEffect(() => {
    const accountString = localStorage.getItem('account')
    if(accountString) {
      const account: AccountState = JSON.parse(accountString)
      account.initialized = true
      dispatch({ type: AccountActionTypes.INIT_ACCOUNT, payload: account })
    } else {
      dispatch({ type: AccountActionTypes.INIT_ACCOUNT, payload: {
        initialized: true,
        network: "mainnet",
        wallets: [],
        selectedWallet: null
      }})
    }
  }, [])

  useEffect(() => {
    if(!settingsState.initialized) return
    localStorage.setItem('settings', JSON.stringify(settingsState))
  }, [settingsState])

  if (typeof(window) !== 'undefined') {
    // @ts-ignore
    import('zeeves-auth-sdk-js');
  }
  
  return <>{props.children}</>
}

export default StateProvider