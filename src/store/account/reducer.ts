import BigNumber from 'bignumber.js';
import {HYDRATE} from 'next-redux-wrapper';
import { AnyAction } from 'redux';
import { AccountActionTypes } from './actions';
import { AccountState, AddWalletProps } from './types';

export const Network = {
  MAIN_NET: "mainnet",
  TEST_NET: "testnet"
}

const initialState: AccountState = {
  initialized: false,
  network: Network.MAIN_NET,
  wallets: [],
  selectedWallet: null
}

const reducer = (state: AccountState = initialState, action: AnyAction) => {
  const { payload } = action

  switch (action.type) {
    case HYDRATE:
      return {...state, ...action.payload.account}

    case AccountActionTypes.INIT_ACCOUNT:
      const newState: AccountState = payload
      return newState

    case AccountActionTypes.NETWORK_UPDATE:
      const networkString: string = payload
      return {
        ...state,
        network: networkString === Network.MAIN_NET ? Network.MAIN_NET : Network.TEST_NET
      }
    
    case AccountActionTypes.ADD_WALLET:
      const addProps: AddWalletProps = payload
      return {
        ...state,
        wallets: [
          ...state.wallets,
          addProps.wallet
        ],
        selectedWallet: state.wallets.length === 0 ? addProps.wallet : state.selectedWallet
      }

    default:
      return state
  }
}

export default reducer