import { Dispatch } from "redux"
import { batch } from "react-redux"
import { BatchRequestType, BatchResponse } from "utils/batch"
import { BlockchainActionsTypes } from "store/blockchain/actions"
import { TokenActionTypes } from "store/token/actions"
import { bnOrZero } from "./strings"
import { fromBech32Address, toBech32Address } from "@zilliqa-js/zilliqa"
import BigNumber from "bignumber.js"
import { DEX } from "types/dex.interface"
import { CARB_ADDRESS, ZILALL_ADDRESS, ZIL_ADDRESS } from "lib/constants"
import { Operator } from "store/types"
import { StakingActionTypes } from "store/staking/actions"

export function processBatch(batchResults: BatchResponse[], walletAddress: string, dispatch: Dispatch) {
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
            address: token?.address,
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
            address: token?.address,
            balance: balance
          }})
          return
        }

        case BatchRequestType.Pools: {
          let pools = result.result.pools
          Object.keys(pools).forEach(address => {
            let pool = pools[address]
            let tokenAddress = toBech32Address(address)

            const [x, y] = pool.arguments
            const zilReserve = new BigNumber(x)
            const tokenReserve = new BigNumber(y)
            const exchangeRate = zilReserve.dividedBy(tokenReserve)

            dispatch({type: TokenActionTypes.TOKEN_UPDATE_POOL, payload: {
              address: toBech32Address(address),
              dex: DEX.ZilSwap,
              quoteReserve: zilReserve,
              quoteAddress: ZIL_ADDRESS,
              baseReserve: tokenReserve,
              baseAddress: tokenAddress,
              exchangeRate
            }})
          })
          return
        }

        case BatchRequestType.PoolBalance: {
          let tokenAddress = fromBech32Address(token!.address).toLowerCase()
          let walletAddr = fromBech32Address(walletAddress).toLowerCase()

          if(result.result === null) {
            let userContribution = new BigNumber(0)
            dispatch({type: TokenActionTypes.TOKEN_UPDATE_POOL, payload: {
              address: token?.address,
              dex: DEX.ZilSwap,
              quoteAddress: ZIL_ADDRESS,
              baseAddress: token?.address,
              userContribution
            }})
            return
          }

          let balances = result.result.balances[tokenAddress]
          let userContribution = new BigNumber(balances ? balances[walletAddr] || 0 : 0)
          
          dispatch({type: TokenActionTypes.TOKEN_UPDATE_POOL, payload: {
            address: token?.address,
            dex: DEX.ZilSwap,
            quoteAddress: ZIL_ADDRESS,
            baseAddress: token?.address,
            userContribution
          }})
          return
        }

        case BatchRequestType.HunyBalances: {
          let walletAddr = fromBech32Address(walletAddress).toLowerCase()
          if(result.result === null) {
            let userContribution = new BigNumber(0)
            dispatch({type: TokenActionTypes.TOKEN_UPDATE_POOL, payload: {
              address: 'zil1m3m5jqqcaemtefnlk795qpw59daukra8prc43e',
              dex: DEX.ZilSwap,
              quoteAddress: ZIL_ADDRESS,
              baseAddress: 'zil1m3m5jqqcaemtefnlk795qpw59daukra8prc43e',
              userContribution
            }})
            return
          }

          let balances = result.result.balances
          let userContribution = new BigNumber(balances ? balances[walletAddr] || 0 : 0)
          
          dispatch({type: TokenActionTypes.TOKEN_UPDATE_POOL, payload: {
            address: 'zil1m3m5jqqcaemtefnlk795qpw59daukra8prc43e',
            dex: DEX.ZilSwap,
            quoteAddress: ZIL_ADDRESS,
            baseAddress: 'zil1m3m5jqqcaemtefnlk795qpw59daukra8prc43e',
            userContribution
          }})
          return
        }

        case BatchRequestType.TotalContributions: {
          let totalContributions = result.result.total_contributions
          Object.keys(totalContributions).forEach(address => {
            let tokenAddress = toBech32Address(address)
            dispatch({type: TokenActionTypes.TOKEN_UPDATE_POOL, payload: {
              address: tokenAddress,
              dex: DEX.ZilSwap,
              quoteAddress: ZIL_ADDRESS,
              baseAddress: tokenAddress,
              totalContribution: new BigNumber(totalContributions[address])
            }})
          })
          return
        }

        case BatchRequestType.XcadPools: {
          let pools = result.result.xpools
          Object.keys(pools).forEach(address => {
            let pool = pools[address]

            const [quote, base, x, y] = pool.arguments
            const quoteReserve = new BigNumber(x)
            const baseReserve = new BigNumber(y)
            const exchangeRate = quoteReserve.dividedBy(baseReserve)

            dispatch({type: TokenActionTypes.TOKEN_UPDATE_POOL, payload: {
              address: toBech32Address(base),
              dex: DEX.XCADDEX,
              quoteAddress: toBech32Address(quote),
              baseAddress: toBech32Address(base),
              quoteReserve,
              baseReserve,
              exchangeRate
            }})
          })
          return
        }

        case BatchRequestType.XcadBalances: {
          let tokenAddress = fromBech32Address(token!.address).toLowerCase()
          let walletAddr = fromBech32Address(walletAddress).toLowerCase()

          if(result.result === null) {
            let userContribution = new BigNumber(0)
            dispatch({type: TokenActionTypes.TOKEN_UPDATE_POOL, payload: {
              address: token?.address,
              dex: DEX.XCADDEX,
              quoteAddress: "zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y",
              baseAddress: token?.address,
              userContribution
            }})
            return
          }

          let balances = result.result.xbalances["0x153feaddc48871108e286de3304b9597c817b456,"+tokenAddress]["0x153feaddc48871108e286de3304b9597c817b456"]
          let userContribution = new BigNumber(balances ? balances[walletAddr] || 0 : 0)
          
          dispatch({type: TokenActionTypes.TOKEN_UPDATE_POOL, payload: {
            address: token?.address,
            dex: DEX.XCADDEX,
            quoteAddress: "zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y",
            baseAddress: token?.address,
            userContribution
          }})
          return
        }

        case BatchRequestType.XcadTotalContributions: {
          let totalContributions = result.result.xtotal_contributions
          Object.keys(totalContributions).forEach(address => {
            const [quote, base] = address.split(",")
            dispatch({type: TokenActionTypes.TOKEN_UPDATE_POOL, payload: {
              address: toBech32Address(base),
              dex: DEX.XCADDEX,
              quoteAddress: toBech32Address(quote),
              baseAddress: toBech32Address(base),
              totalContribution: new BigNumber(totalContributions[address][quote])
            }})
          })
          return
        }

        case BatchRequestType.XcadZilPools: {
          let pools = result.result.pools
          Object.keys(pools).forEach(address => {
            let pool = pools[address]

            const [x, y] = pool.arguments
            const zilReserve = new BigNumber(x)
            const tokenReserve = new BigNumber(y)
            const exchangeRate = zilReserve.dividedBy(tokenReserve)

            dispatch({type: TokenActionTypes.TOKEN_UPDATE_POOL, payload: {
              address: toBech32Address(address),
              dex: DEX.XCADDEX,
              quoteAddress: ZIL_ADDRESS,
              baseAddress: toBech32Address(address),
              quoteReserve: zilReserve,
              baseReserve: tokenReserve,
              exchangeRate
            }})
          })
          return
        }

        case BatchRequestType.XcadZilBalances: {
          let tokenAddress = fromBech32Address(token!.address).toLowerCase()
          let walletAddr = fromBech32Address(walletAddress).toLowerCase()

          if(result.result === null) {
            let userContribution = new BigNumber(0)
            dispatch({type: TokenActionTypes.TOKEN_UPDATE_POOL, payload: {
              address: token?.address,
              dex: DEX.XCADDEX,
              quoteAddress: ZIL_ADDRESS,
              baseAddress: token?.address,
              userContribution
            }})
            return
          }

          let balances = result.result.balances[tokenAddress]
          let userContribution = new BigNumber(balances ? balances[walletAddr] || 0 : 0)
          
          dispatch({type: TokenActionTypes.TOKEN_UPDATE_POOL, payload: {
            address: token?.address,
            dex: DEX.XCADDEX,
            quoteAddress: ZIL_ADDRESS,
            baseAddress: token?.address,
            userContribution
          }})
          return
        }

        case BatchRequestType.XcadZilTotalContributions: {
          let totalContributions = result.result.total_contributions
          Object.keys(totalContributions).forEach(address => {
            dispatch({type: TokenActionTypes.TOKEN_UPDATE_POOL, payload: {
              address: toBech32Address(address),
              dex: DEX.XCADDEX,
              quoteAddress: ZIL_ADDRESS,
              baseAddress: toBech32Address(address),
              totalContribution: new BigNumber(totalContributions[address])
            }})
          })
          return
        }

        case BatchRequestType.CarbPools: {
          let pools = result.result.pools
          Object.keys(pools).forEach(address => {
            let pool = pools[address]
            let tokenAddress = toBech32Address(address)

            const [x, y] = pool.arguments
            const carbReserve = new BigNumber(x)
            const tokenReserve = new BigNumber(y)
            const exchangeRate = carbReserve.dividedBy(tokenReserve)

            dispatch({type: TokenActionTypes.TOKEN_UPDATE_POOL, payload: {
              address: toBech32Address(address),
              dex: DEX.CarbSwap,
              quoteReserve: carbReserve,
              quoteAddress: CARB_ADDRESS,
              baseReserve: tokenReserve,
              baseAddress: tokenAddress,
              exchangeRate
            }})
          })
          return
        }

        case BatchRequestType.CarbBalances: {
          let tokenAddress = fromBech32Address(token!.address).toLowerCase()
          let walletAddr = fromBech32Address(walletAddress).toLowerCase()

          if(result.result === null) {
            let userContribution = new BigNumber(0)
            dispatch({type: TokenActionTypes.TOKEN_UPDATE_POOL, payload: {
              address: token?.address,
              dex: DEX.CarbSwap,
              quoteAddress: CARB_ADDRESS,
              baseAddress: token?.address,
              userContribution
            }})
            return
          }

          let balances = result.result.balances[tokenAddress]
          let userContribution = new BigNumber(balances ? balances[walletAddr] || 0 : 0)
          
          dispatch({type: TokenActionTypes.TOKEN_UPDATE_POOL, payload: {
            address: token?.address,
            dex: DEX.CarbSwap,
            quoteAddress: CARB_ADDRESS,
            baseAddress: token?.address,
            userContribution
          }})
          return
        }

        case BatchRequestType.CarbTotalContributions: {
          let totalContributions = result.result.total_contributions
          Object.keys(totalContributions).forEach(address => {
            let tokenAddress = toBech32Address(address)
            dispatch({type: TokenActionTypes.TOKEN_UPDATE_POOL, payload: {
              address: tokenAddress,
              dex: DEX.CarbSwap,
              quoteAddress: CARB_ADDRESS,
              baseAddress: tokenAddress,
              totalContribution: new BigNumber(totalContributions[address])
            }})
          })
          return
        }

        case BatchRequestType.ZilAllPools: {
          let pools = result.result.liquidity
          Object.keys(pools).forEach(address => {
            let pool = pools[address]
            let tokenAddress = toBech32Address(address)

            const [x, y] = pool.arguments
            const zilReserve = new BigNumber(x)
            const tokenReserve = new BigNumber(y)
            const exchangeRate = zilReserve.dividedBy(tokenReserve)

            dispatch({type: TokenActionTypes.TOKEN_UPDATE_POOL, payload: {
              address: toBech32Address(address),
              dex: DEX.ZilAll,
              quoteReserve: zilReserve,
              quoteAddress: ZIL_ADDRESS,
              baseReserve: tokenReserve,
              baseAddress: tokenAddress,
              exchangeRate
            }})
          })
          return
        }

        case BatchRequestType.ZilAllBalances: {
          let tokenAddress = fromBech32Address(token!.address).toLowerCase()
          let walletAddr = fromBech32Address(walletAddress).toLowerCase()

          if(result.result === null) {
            let userContribution = new BigNumber(0)
            dispatch({type: TokenActionTypes.TOKEN_UPDATE_POOL, payload: {
              address: token?.address,
              dex: DEX.ZilAll,
              quoteAddress: ZIL_ADDRESS,
              baseAddress: token?.address,
              userContribution
            }})
            return
          }

          let balances = result.result.balances[tokenAddress]
          let userContribution = new BigNumber(balances ? balances[walletAddr] || 0 : 0)
          
          dispatch({type: TokenActionTypes.TOKEN_UPDATE_POOL, payload: {
            address: token?.address,
            dex: DEX.ZilAll,
            quoteAddress: ZIL_ADDRESS,
            baseAddress: token?.address,
            userContribution
          }})
          return
        }

        case BatchRequestType.ZilAllTotalContributions: {
          let totalContributions = result.result.total_contributions
          Object.keys(totalContributions).forEach(address => {
            let tokenAddress = toBech32Address(address)
            dispatch({type: TokenActionTypes.TOKEN_UPDATE_POOL, payload: {
              address: tokenAddress,
              dex: DEX.ZilAll,
              quoteAddress: ZIL_ADDRESS,
              baseAddress: tokenAddress,
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
          if(result && result.result) {
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

        case BatchRequestType.Staking: {
          let contract = result.request.stakingContract
          if(!contract || result.result === null) return

          let staker: any = Object.values(result.result[contract.statePath])[0]
          var staked = new BigNumber(0)

          if(contract.cumulativeValues === true) {
            Object.values(staker).forEach((value: any) => {
              staked = staked.plus(value)
            })
          } else {
            staked = staked.plus(staker)
          }


          dispatch({ type: StakingActionTypes.STAKING_ADD, payload: { operator: {
            name: contract.name,
            address: contract.address,
            staked: staked,
            symbol: contract.token_symbol,
            decimals: contract.token_decimals
          }}})

          return
        }
      }
    })
  })
}