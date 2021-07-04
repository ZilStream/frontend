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
      rate: 0,
      isPopular: true,
      isFiat: true,
      isCrypto: false
    },
    {
      name: 'Euro',
      code: 'EUR',
      symbol: '€',
      rate: 0,
      isPopular: true,
      isFiat: true,
      isCrypto: false
    },
    {
      name: 'Singapore Dollar',
      code: 'SGD',
      symbol: 'S$',
      rate: 0,
      isPopular: true,
      isFiat: true,
      isCrypto: false
    },
    {
      name: 'Pound Sterling',
      code: 'GBP',
      symbol: '£',
      rate: 0,
      isPopular: true,
      isFiat: true,
      isCrypto: false
    },
    {
      name: 'Bitcoin',
      code: 'BTC',
      symbol: '₿',
      rate: 0,
      isPopular: true,
      isFiat: false,
      isCrypto: true
    },
    {
      name: 'Indian Rupee',
      code: 'INR',
      symbol: '₹',
      rate: 0,
      isPopular: false,
      isFiat: true,
      isCrypto: false
    },
    {
      name: 'Canadian Dollar',
      code: 'CAD',
      symbol: '$',
      rate: 0,
      isPopular: false,
      isFiat: true,
      isCrypto: false
    },
    {
      name: 'Chinese Yuan',
      code: 'CNY',
      symbol: '¥',
      rate: 0,
      isPopular: false,
      isFiat: true,
      isCrypto: false
    },
    {
      name: 'Indonesian Rupiah',
      code: 'IDR',
      symbol: 'RP',
      rate: 0,
      isPopular: false,
      isFiat: true,
      isCrypto: false
    },
    {
      name: 'Australian Dollar',
      code: 'AUD',
      symbol: '$',
      rate: 0,
      isPopular: false,
      isFiat: true,
      isCrypto: false
    },
    {
      name: 'New Zealand Dollar',
      code: 'NZD',
      symbol: '$',
      rate: 0,
      isPopular: false,
      isFiat: true,
      isCrypto: false
    },
    {
      name: 'Thai Baht',
      code: 'THB',
      symbol: '฿',
      rate: 0,
      isPopular: false,
      isFiat: true,
      isCrypto: false
    },
  ],
  selectedCurrency: 'USD'
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