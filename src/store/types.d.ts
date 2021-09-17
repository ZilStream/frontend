import { AccountState } from './account/types'
import { StakingState } from './staking/types'
import { TokenState } from './token/types'
import { CurrencyState } from './currency/types'
import { ModalState } from './modal/types'

export * from './token/types'
export * from './account/types'
export * from './staking/types'
export * from './currency/types'
export * from './modal/types'

export interface RootState {
  token: TokenState
  account: AccountState
  staking: StakingState
  currency: CurrencyState
  modal: ModalState
}