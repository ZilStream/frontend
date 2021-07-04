import {HYDRATE} from 'next-redux-wrapper'
import { AnyAction } from 'redux'
import { CurrencyActionTypes } from './actions'
import { CurrencySelectProps, CurrencyState, CurrencyUpdateProps } from './types'

const initialState: CurrencyState = {
  currencies: [
    {
      name: 'United States Dollar',
      code: 'USD',
      symbol: '$',
    },
    {
      name: 'Euro',
      code: 'EUR',
      symbol: '€',
    },
    {
      name: 'Singapore Dollar',
      code: 'SGD',
      symbol: 'S$',
    },
    {
      name: 'Pound Sterling',
      code: 'GBP',
      symbol: '£',
    },
    {
      name: 'Bitcoin',
      code: 'BTC',
      symbol: '฿',
    },
  ],
  selectedCurrency: {
    name: 'United States Dollar',
    code: 'USD',
    symbol: '$',
  }
}

const reducer = (state: CurrencyState = initialState, action: AnyAction) => {
  const { payload } = action

  switch(action.type) {
    case HYDRATE: 
      return {...state, ...payload.currency}

    case CurrencyActionTypes.CURRENCY_UPDATE:
      const updateProps: CurrencyUpdateProps = payload
      return {
        ...state,
        currencies: state.currencies.map(currency => currency.code === updateProps.code ?
          {...currency, ...updateProps} :
          currency
          )
      }

    case CurrencyActionTypes.CURRENCY_SELECT:
      const selectProps: CurrencySelectProps = payload
      return {
        ...state,
        selectedCurrency: selectProps.currency
      }

    default:
      return state
  }
}

export default reducer