import { Dispatch } from "redux"
import { batch } from "react-redux"
import { BatchRequestType, BatchResponse, xcadStakingAddresses } from "utils/batch"
import { BlockchainActionsTypes } from "store/blockchain/actions"
import { TokenActionTypes } from "store/token/actions"
import { bnOrZero } from "./strings"
import { fromBech32Address, toBech32Address } from "@zilliqa-js/zilliqa"
import BigNumber from "bignumber.js"
import { DEX } from "types/dex.interface"
import { CARB_ADDRESS, ZIL_ADDRESS } from "lib/constants"
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

        case BatchRequestType.GraphStakers: {
          if(result.result === null) return

          let stakers: number[]  = Object.values(result.result.stakers)
          if(stakers.length === 0) return

          dispatch({ type: StakingActionTypes.STAKING_ADD, payload: { operator: {
            name: 'Graph',
            address: '0x34e77f91fba80c6555fdf4a23fb132abbace8aaf',
            staked: new BigNumber(stakers[0]),
            symbol: 'GRPH',
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
            name: 'PORT: The Dock',
            address: '0x25c9176fc5c18ec28888f0338776b4f39e487028',
            staked: new BigNumber(stakers[0]),
            symbol: 'PORT',
            decimals: 4
          }}})
          return
        }

        case BatchRequestType.FeesBachelorStakers: {
          if(result.result === null) return

          let stakers: number[]  = Object.values(result.result.stakers)
          if(stakers.length === 0) return

          dispatch({ type: StakingActionTypes.STAKING_ADD, payload: { operator: {
            name: 'FEES: Bachelors',
            address: '0x2dfe5b74116b420f8e87010f974cacc1399e4dbb',
            staked: new BigNumber(stakers[0]),
            symbol: 'FEES',
            decimals: 4
          }}})
          return
        }

        case BatchRequestType.FeesMastersStakers: {
          if(result.result === null) return

          let stakers: number[]  = Object.values(result.result.stakers)
          if(stakers.length === 0) return

          dispatch({ type: StakingActionTypes.STAKING_ADD, payload: { operator: {
            name: 'FEES: Masters',
            address: '0x2327d9feb18c5f64b95e530c8e789cc616b7c2d4',
            staked: new BigNumber(stakers[0]),
            symbol: 'FEES',
            decimals: 4
          }}})
          return
        }

        case BatchRequestType.FeesDoctoralStakers: {
          if(result.result === null) return

          let stakers: number[]  = Object.values(result.result.removeStaker)
          if(stakers.length === 0) return

          dispatch({ type: StakingActionTypes.STAKING_ADD, payload: { operator: {
            name: 'FEES: Doctoral',
            address: '0x5d5ecbc54c39cfb2c0b92f043ba31ab4aaf8bf83',
            staked: new BigNumber(stakers[0]),
            symbol: 'FEES',
            decimals: 4
          }}})
          return
        }

        case BatchRequestType.OkipadStaking: {
          if(result.result === null) return

          let stakers: number[]  = Object.values(result.result.stakers)
          if(stakers.length === 0) return

          dispatch({ type: StakingActionTypes.STAKING_ADD, payload: { operator: {
            name: 'Okipad',
            address: '0xce7b758d08b477ef4f957fd7be81bb5e0976dcbc',
            staked: new BigNumber(stakers[0]),
            symbol: 'Oki',
            decimals: 5
          }}})
          return
        }

        case BatchRequestType.BloxStaking: {
          if(result.result === null) return

          let stakers: number[]  = Object.values(result.result.stakers)
          if(stakers.length === 0) return

          dispatch({ type: StakingActionTypes.STAKING_ADD, payload: { operator: {
            name: 'BLOX',
            address: '0xbe6f5317f70ab1cdf4b338183e84efe98af7c0af',
            staked: new BigNumber(stakers[0]),
            symbol: 'BLOX',
            decimals: 2
          }}})
          return
        }

        case BatchRequestType.DmzStaking: {
          if(result.result === null) return

          let stakers: number[]  = Object.values(result.result.stakers_total_bal)
          if(stakers.length === 0) return

          dispatch({ type: StakingActionTypes.STAKING_ADD, payload: { operator: {
            name: 'DeMons',
            address: '0x9962382d6dad464c592be1caf7db2bb344fb1239',
            staked: new BigNumber(stakers[0]),
            symbol: 'DMZ',
            decimals: 18
          }}})
          return
        }

        case BatchRequestType.XcadStaking: {
          if(result.result === null) return

          let stakers: number[]  = Object.values(result.result.stakers_total_bal)
          if(stakers.length === 0) return

          let values = Object.values(xcadStakingAddresses).filter(value => value[0] === token?.address)[0]

          if(token && token.symbol === 'XCAD') {
            if(token && token.symbol === 'XCAD' && values[1] === '0xb15a7cc9fc08a2c77f96b5d892ab1f1a4cf022cc') {
              dispatch({ type: StakingActionTypes.STAKING_ADD, payload: { operator: {
                name: 'XCAD Staking: dXCAD',
                address: values[1],
                staked: new BigNumber(stakers[0]),
                symbol: 'XCAD',
                decimals: 18
              }}})
            } else {
              dispatch({ type: StakingActionTypes.STAKING_ADD, payload: { operator: {
                name: 'XCAD Staking',
                address: values[1],
                staked: new BigNumber(stakers[0]),
                symbol: 'XCAD',
                decimals: 18
              }}})
            }
          } else {
            dispatch({ type: StakingActionTypes.STAKING_ADD, payload: { operator: {
              name: 'dXCAD Staking: ' + token?.symbol,
              address: values[1],
              staked: new BigNumber(stakers[0]),
              symbol: 'dXCAD',
              decimals: 18
            }}})
          }

          return
        }
      }
    })
  })
}