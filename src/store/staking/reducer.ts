import {HYDRATE} from 'next-redux-wrapper';
import { AnyAction } from 'redux'
import { StakingActionTypes } from './actions';
import { StakingInitProps, StakingState, StakingUpdateProps } from './types';

const initialState: StakingState = {
  operators: []
}

const reducer = (state: StakingState = initialState, action: AnyAction) => {
  const { payload } = action

  switch (action.type) {
    case HYDRATE:
      return {...state, ...action.payload.token}

    case StakingActionTypes.STAKING_INIT:
      const initProps: StakingInitProps = payload
      return {
        operators: [
          ...initProps.operators
        ]
      }

    case StakingActionTypes.STAKING_UPDATE:
      const updateProps: StakingUpdateProps = payload
      return {
        ...state,
        operators: state.operators.map(operator => operator.address === updateProps.address ?
          {...operator, ...updateProps} :
          operator
          )
      }
    
    default:
      return state
  }
}

export default reducer