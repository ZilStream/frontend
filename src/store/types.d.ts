import { AccountState } from './account/types'
import { TokenState } from './token/types'

export * from './token/types'
export * from './account/types'

export interface RootState {
  token: TokenState
  account: AccountState
}