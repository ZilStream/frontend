import { combineReducers } from 'redux'

import token from './token/reducer'
import account from './account/reducer'
import staking from './staking/reducer'
import currency from './currency/reducer'
import modal from './modal/reducer'
import settings from './settings/reducer'
import blockchain from './blockchain/reducer'
import swap from './swap/reducer'
import alert from './alert/reducer'

export default combineReducers({
  token,
  account,
  staking,
  currency,
  modal,
  settings,
  blockchain,
  swap,
  alert
})