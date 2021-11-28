import { fromBech32Address, toBech32Address } from '@zilliqa-js/crypto'
import BigNumber from 'bignumber.js'
import getZilRates from 'lib/coingecko/getZilRates'
import { STREAM_ADDRESS, ZIL_ADDRESS } from 'lib/constants'
import getPortfolioState from 'lib/zilstream/getPortfolio'
import getTokens from 'lib/zilstream/getTokens'
import React, { useEffect, useState } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'
import { startSagas } from 'saga/saga'
import { AccountActionTypes, updateWallet } from 'store/account/actions'
import { BlockchainActionsTypes } from 'store/blockchain/actions'
import { CurrencyActionTypes } from 'store/currency/actions'
import { updateSettings } from 'store/settings/actions'
import { StakingActionTypes } from 'store/staking/actions'
import { updateSwap } from 'store/swap/actions'
import { TokenActionTypes } from 'store/token/actions'
import { AccountState, BlockchainState, Operator, RootState, SettingsState, StakingState, TokenState } from 'store/types'
import { AccountType } from 'types/walletType.interface'
import { getTokenAPR } from 'utils/apr'
import { BatchRequestType, BatchResponse, sendBatchRequest, stakingDelegatorsBatchRequest } from 'utils/batch'
import { useInterval } from 'utils/interval'
import { bnOrZero } from 'utils/strings'

interface Props {
  children: React.ReactNode
}

const StateProvider = (props: Props) => {
  const blockchainState = useSelector<RootState, BlockchainState>(state => state.blockchain)
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const stakingState = useSelector<RootState, StakingState>(state => state.staking)
  const settingsState = useSelector<RootState, SettingsState>(state => state.settings)
  const dispatch = useDispatch()
  const [stakingLoaded, setStakingLoaded] = useState(false)

  async function loadTokens() {
    const tokens = await getTokens()
    if(tokens.length === 0) return

    batch(() => {
      if(!tokenState.initialized) {
        for (let i = 0; i < tokens.length; i++) {
          tokens[i].isZil = tokens[i].address_bech32 === ZIL_ADDRESS
          tokens[i].isStream = tokens[i].address_bech32 === STREAM_ADDRESS
        }
        dispatch({type: TokenActionTypes.TOKEN_INIT, payload: {tokens}})
      } else {
        tokens.forEach(token => {
          const { address_bech32, ...tokenDetails} = token
          dispatch({type: TokenActionTypes.TOKEN_UPDATE, payload: {
            address_bech32: address_bech32,
            ...tokenDetails
          }})
        })
      }
    })

    if(tokens.length > 0) {
      dispatch(updateSwap({
        tokenInAddress: tokens.filter(t => t.symbol === 'ZIL')[0].address_bech32,
        tokenOutAddress: tokens.filter(t => t.symbol === 'STREAM')[0].address_bech32
      }))
    }
  }

  async function setFavorites() {
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
    let batchResults = await sendBatchRequest(batchRequests)
    await processBatchResults(batchResults)
  }

  async function processBatchResults(batchResults: BatchResponse[]) {
    if(!accountState.selectedWallet) return
    const walletAddress = accountState.selectedWallet.address

    batch(() => {
      batchResults.forEach(result => {
        let token = result.request.token
  
        switch(result.request.type) {
          case BatchRequestType.BlockchainInfo: {
            dispatch({ type: BlockchainActionsTypes.BLOCKCHAIN_UPDATE, payload: {
              blockHeight: +result.result.NumTxBlocks-1
            }})
            return
          }

          case BatchRequestType.Balance: {
            dispatch({type: TokenActionTypes.TOKEN_UPDATE, payload: {
              address_bech32: token?.address_bech32,
              balance: bnOrZero(result.result.balance),
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
            return
          }

          case BatchRequestType.PortBuoyStakers: {
            if(result.result === null) return
  
            let stakers: number[]  = Object.values(result.result.stakers)
            if(stakers.length === 0) return
  
            dispatch({ type: StakingActionTypes.STAKING_ADD, payload: { operator: {
              name: 'PORT: The Buoy',
              address: '0xfdaf9ec7281e76372e75fa6f0ed430b17c7b2a1d',
              staked: new BigNumber(stakers[0]),
              symbol: 'PORT',
              decimals: 4
            }}})
            return
          }

          case BatchRequestType.PortDockStakers: {
            if(result.result === null) return
  
            let stakers: number[]  = Object.values(result.result.stakers)
            if(stakers.length === 0) return
  
            dispatch({ type: StakingActionTypes.STAKING_ADD, payload: { operator: {
              name: 'PORT: The Dock ',
              address: '0x25c9176fc5c18ec28888f0338776b4f39e487028',
              staked: new BigNumber(stakers[0]),
              symbol: 'PORT',
              decimals: 4
            }}})
            return
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
    loadZilRates()
  }, 20000)

  useEffect(() => {
    if(!tokenState.initialized) return
    loadTokens()
    loadWalletState()
  }, [blockchainState.blockHeight])

  useEffect(() => {
    loadSettings()
    loadTokens()
    loadZilRates()

    startSagas()
  }, [])

  useEffect(() => {
    if(!tokenState.initialized) return
    setFavorites()
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
      account.wallets = account.wallets.map(a => ({...a, isConnected: false }))

      dispatch({ type: AccountActionTypes.INIT_ACCOUNT, payload: account })

      if(account.wallets.filter(a => a.type === AccountType.ZilPay).length > 0) {
        // Has ZilPay wallet, try to connect
        connectZilPay()
      }
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
    dispatch(updateWallet({address: walletAddress, isConnected: true}))
  }
  
  return <>{props.children}</>
}

export default StateProvider