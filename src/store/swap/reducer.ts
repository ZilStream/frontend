import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux'
import { swapExchanges } from 'types/swapExchange.interface';
import { SwapActionTypes } from './actions';
import { SwapState, SwapUpdateProps } from './types';

const initialState: SwapState = {
  exchange: swapExchanges[0],
  tokenInAddress: null,
  tokenOutAddress: null,
  slippage: 0.01,
  selectedDirection: "in",
  availablePairs: []
}

const reducer = (state: SwapState = initialState, action: AnyAction) => {
  const { payload } = action

  switch(action.type) {
    case HYDRATE:
      return {...state, ...action.payload.swap}

    case SwapActionTypes.SWAP_UPDATE:
      const updateProps: SwapUpdateProps = payload
      return {
        ...state,
        ...updateProps
      }

    default:
      return state
  }
}

export default reducer