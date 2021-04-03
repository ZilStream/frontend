import { TokenState } from './token/types'

export * from './token/types'

export interface RootState {
  token: TokenState
}