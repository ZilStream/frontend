import { AccountState } from './account/types'
import { StakingState } from './staking/types'
import { TokenState } from './token/types'

export * from './token/types'
export * from './account/types'
export * from './staking/types'

export interface RootState {
  token: TokenState
  account: AccountState
  staking: StakingState
}