import BigNumber from 'bignumber.js'

export type Operator = {
  name: string
  address: string
  staked?: BigNumber
  // url: string
  // api_url: string
  active: boolean
  stake_amount: BigNumber
  buffered_deposit: BigNumber
  comission: BigNumber
  symbol: string
  decimals: number
  recommended: boolean
  delegators?: number
}

export interface StakingState {
  initialized: boolean
  operators: Operator[]
  lastRewardCycle: BigNumber
}

export interface StakingInitProps {
  operators: Operator[]
}

export interface StakingUpdateProps extends Partial<StakingState> {}

export interface StakingAddOperatorProps {
  operator: Operator
}

export interface StakingUpdateOperatorProps extends Partial<Operator> {
  address: string
}
