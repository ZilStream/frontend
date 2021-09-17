import BigNumber from 'bignumber.js';
import {HYDRATE} from 'next-redux-wrapper';
import { AnyAction } from 'redux';
import { SelectWalletProps, UpdateWalletProps } from 'store/types';
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

    case AccountActionTypes.UPDATE_WALLET:
      const updateProps: UpdateWalletProps = payload
      return {
        ...state,
        tokens: state.wallets.map(wallet => wallet.address === updateProps.address ?
          {...wallet, ...updateProps} :
          wallet
          ),
        selectedWallet: updateProps.address === state.selectedWallet?.address ? {...state.selectedWallet, ...updateProps} : state.selectedWallet
      }

    case AccountActionTypes.SELECT_WALLET:
      const selectProps: SelectWalletProps = payload
      return {
        ...state,
        selectedWallet: selectProps.wallet
      }

    case AccountActionTypes.LOGOUT:
      return {
        ...state,
        wallets: [],
        selectedWallet: null
      }

    default:
      return state
  }
}

export default reducer