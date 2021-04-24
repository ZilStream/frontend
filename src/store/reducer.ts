import { combineReducers } from 'redux'

import token from './token/reducer'
import account from './account/reducer'

export default combineReducers({
  token,
  account,
})