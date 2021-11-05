import {HYDRATE} from 'next-redux-wrapper'
import { AnyAction } from 'redux'
import { SettingsState } from './types'

const initialState: SettingsState = {
  columns: {
    zil: true,
    usd: true,
    marketCap: true,
    liquidity: true,
    volume: true,
    graph24h: true,
    apr: false,
    change24h: true
  },
  filters: {
    unvetted: false,
    bridged: true
  },
  rows: 50
}

const reducer = (state: SettingsState = initialState, action: AnyAction) => {
  const { payload } = action

  switch(action.type) {
    case HYDRATE:
      return {...state, ...payload.settings}

    default:
      return state
  }
}

export default reducer