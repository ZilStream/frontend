import { combineReducers } from 'redux'

import token from './token/reducer'
import account from './account/reducer'
import staking from './staking/reducer'

export default combineReducers({
  token,
  account,
  staking,
})