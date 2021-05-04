import BigNumber from "bignumber.js";

export type Operator = {
  name: string
  address: string
  staked?: BigNumber
  // url: string
  // api_url: string
  // stake_amount: BigNumber
  // buffered_deposit: BigNumber
  comission: BigNumber
}

export interface StakingState {
  operators: Operator[]
}

export interface StakingInitProps {
  operators: Operator[]
}

export interface StakingUpdateProps extends Partial<Operator> {
  address: string
}