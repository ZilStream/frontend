import { AccountState } from './account/types'
import { StakingState } from './staking/types'
import { TokenState } from './token/types'
import { CurrencyState } from './currency/types'
import { ModalState } from './modal/types'
import { SettingsState } from './settings/types'
import { BlockchainState } from './blockchain/types'
import { SwapState } from './swap/types'
import { AlertState } from './alert/types'
import { NotificationState } from './notification/types'
import { CollectionState } from './collection/types'

export * from './token/types'
export * from './account/types'
export * from './staking/types'
export * from './currency/types'
export * from './modal/types'
export * from './settings/types'
export * from './blockchain/types'
export * from './swap/types'
export * from './alert/types'
export * from './notification/types'
export * from './collection/types'

export interface RootState {
  token: TokenState
  account: AccountState
  staking: StakingState
  currency: CurrencyState
  modal: ModalState
  settings: SettingsState
  blockchain: BlockchainState
  swap: SwapState
  alert: AlertState
  notification: NotificationState
  collection: CollectionState
}