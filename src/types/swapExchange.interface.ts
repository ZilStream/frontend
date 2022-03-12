import { ZIL_ADDRESS } from "lib/constants"

export interface SwapExchange {
  name: string
  iconAddress: string
  identifier: "zilswap"|"xcad-dex"|"carbswap"
  baseTokenAddress: string
  active: boolean
  hasRouting: boolean
}

export const swapExchanges: SwapExchange[] = [
  {
    name: 'ZilSwap',
    iconAddress: 'zil1p5suryq6q647usxczale29cu3336hhp376c627',
    identifier: 'zilswap',
    baseTokenAddress: ZIL_ADDRESS,
    active: true,
    hasRouting: true
  },
  {
    name: 'XCAD DEX',
    iconAddress: 'zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y',
    identifier: 'xcad-dex',
    baseTokenAddress: 'zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y',
    active: true,
    hasRouting: false
  },
  {
    name: 'CarbSwap',
    iconAddress: 'zil1hau7z6rjltvjc95pphwj57umdpvv0d6kh2t8zk',
    identifier: 'carbswap',
    baseTokenAddress: 'zil1hau7z6rjltvjc95pphwj57umdpvv0d6kh2t8zk',
    active: false,
    hasRouting: true
  },
]