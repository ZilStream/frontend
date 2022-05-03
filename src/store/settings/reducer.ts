import {HYDRATE} from 'next-redux-wrapper'
import { AnyAction } from 'redux'
import { UpdateColumnsProps, UpdateFiltersProps, UpdateSettingsProps } from 'store/types'
import { SettingsActionTypes } from './actions'
import { SettingsState } from './types'

const initialState: SettingsState = {
  initialized: false,
  columns: {
    priceZIL: true,
    priceFiat: true,
    ath: false,
    atl: false,
    change24H: true,
    change7D: true,
    change24HZIL: false,
    change7DZIL: false,
    marketCap: true,
    marketCapDiluted: false,
    circSupply: false,
    totalSupply: false,
    maxSupply: false,
    liquidity: true,
    volume: true,
    apr: false,
    apy: false,
    graph24H: true,
    graph24HZIL: false
  },
  filters: {
    unlisted: false,
    bridged: true
  },
  rows: 50
}

const reducer = (state: SettingsState = initialState, action: AnyAction) => {
  const { payload } = action

  switch(action.type) {
    case HYDRATE:
      return {...state, ...payload.settings}

    case SettingsActionTypes.SETTINGS_UPDATE:
      const updateProps: UpdateSettingsProps = payload 
      return {
        ...state,
        ...updateProps
      }

    case SettingsActionTypes.SETTINGS_COLUMNS_UPDATE: 
      const updateColumnsProps: UpdateColumnsProps = payload
      return {
        ...state,
        columns: {
          ...state.columns,
          ...updateColumnsProps
        }
      }

    case SettingsActionTypes.SETTINGS_FILTERS_UPDATE:
      const updateFiltersProps: UpdateFiltersProps = payload
      return {
        ...state,
        filters: {
          ...state.filters,
          ...updateFiltersProps
        }
      }

    default:
      return state
  }
}

export default reducer