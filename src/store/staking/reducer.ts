import { HYDRATE } from "next-redux-wrapper";
import { AnyAction } from "redux";
import { StakingActionTypes } from "./actions";
import {
  StakingAddOperatorProps,
  StakingInitProps,
  StakingState,
  StakingUpdateOperatorProps,
  StakingUpdateProps,
} from "./types";
import { BIG_ZERO } from "utils/strings";

const initialState: StakingState = {
  operators: [],
  initialized: false,
  lastRewardCycle: BIG_ZERO,
};

const reducer = (state: StakingState = initialState, action: AnyAction) => {
  const { payload } = action;

  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload.token };

    case StakingActionTypes.STAKING_INIT:
      const initProps: StakingInitProps = payload;
      return {
        operators: [...initProps.operators],
        initialized: true,
      };

    case StakingActionTypes.STAKING_UDPATE:
      const updateProps: StakingUpdateProps = payload;
      return {
        ...state,
        ...updateProps,
      };

    case StakingActionTypes.STAKING_ADD_OPERATOR:
      const addOperatorProps: StakingAddOperatorProps = payload;
      return {
        ...state,
        operators: [...state.operators, addOperatorProps.operator],
      };

    case StakingActionTypes.STAKING_UPDATE_OPERATOR:
      const updateOperatorProps: StakingUpdateOperatorProps = payload;
      return {
        ...state,
        operators: state.operators.map((operator) =>
          operator.address === updateOperatorProps.address
            ? { ...operator, ...updateOperatorProps }
            : operator
        ),
      };

    default:
      return state;
  }
};

export default reducer;
