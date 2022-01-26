export interface SwapExchange {
  name: string
  iconAddress: string
  identifier: "zilswap"|"xcaddex"|"carbswap"
  active: boolean
}

export const swapExchanges: SwapExchange[] = [
  {
    name: 'ZilSwap',
    iconAddress: 'zil1p5suryq6q647usxczale29cu3336hhp376c627',
    identifier: 'zilswap',
    active: true
  },
  {
    name: 'XCAD Dex',
    iconAddress: 'zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y',
    identifier: 'xcaddex',
    active: true
  },
  {
    name: 'CarbSwap',
    iconAddress: 'zil1hau7z6rjltvjc95pphwj57umdpvv0d6kh2t8zk',
    identifier: 'carbswap',
    active: false
  },
]