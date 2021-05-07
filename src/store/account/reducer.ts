import {HYDRATE} from 'next-redux-wrapper';
import { AnyAction } from 'redux';
import { AccountActionTypes } from './actions';
import { AccountState } from './types';

export const Network = {
  MAIN_NET: "mainnet",
  TEST_NET: "testnet"
}

const initialState: AccountState = {
  network: Network.MAIN_NET,
  isConnected: false,
  address: ''
}

const reducer = (state: AccountState = initialState, action: AnyAction) => {
  const { payload } = action

  switch (action.type) {
    case HYDRATE:
      return {...state, ...action.payload.account}

    case AccountActionTypes.NETWORK_UPDATE:
      const networkString: string = payload
      return {
        ...state,
        network: networkString === Network.MAIN_NET ? Network.MAIN_NET : Network.TEST_NET
      }
    
    case AccountActionTypes.WALLET_UPDATE:
      const walletAddress: string = payload
      return {
        ...state,
        address: walletAddress,
        isConnected: walletAddress !== ''
      }

    default:
      return state
  }
}

export default reducer