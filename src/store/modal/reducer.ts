import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';
import { ModalActionTypes } from './actions';
import { ModalState } from "./types";

const initialState: ModalState = {
  walletOpen: false,
  currencyOpen: false,
  exchangeOpen: false,
  exportOpen: false,
}

const reducer = (state: ModalState = initialState, action: AnyAction) => {
  const { payload } = action

  switch (action.type) {
    case HYDRATE:
      return {...state, ...action.payload.wallet}

    case ModalActionTypes.OPEN_WALLET:
      const walletOpen: boolean = payload
      return {
        ...state,
        walletOpen
      }

    case ModalActionTypes.OPEN_CURRENCY:
      const currencyOpen: boolean = payload
      return {
        ...state,
        currencyOpen
      }
    
    case ModalActionTypes.OPEN_EXCHANGE:
      const exchangeOpen: boolean = payload
      return {
        ...state,
        exchangeOpen
      }

    case ModalActionTypes.OPEN_EXPORT:
      const exportOpen: boolean = payload
      return {
        ...state,
        exportOpen
      }

    default:
      return state
  }
}

export default reducer