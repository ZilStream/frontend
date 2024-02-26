import {
  StakingAddOperatorProps,
  StakingInitProps,
  StakingUpdateOperatorProps,
  StakingUpdateProps,
} from "./types";

export const StakingActionTypes = {
  STAKING_INIT: "STAKING_INIT",
  STAKING_UDPATE: "STAKING_UPDATE",
  STAKING_ADD_OPERATOR: "STAKING_ADD",
  STAKING_UPDATE_OPERATOR: "STAKING_UPDATE_OPERATOR",
};

export function init(payload: StakingInitProps) {
  return {
    type: StakingActionTypes.STAKING_INIT,
    payload,
  };
}

export function update(payload: StakingUpdateProps) {
  return {
    type: StakingActionTypes.STAKING_UDPATE,
    payload,
  };
}

export function addOperator(payload: StakingAddOperatorProps) {
  return {
    type: StakingActionTypes.STAKING_ADD_OPERATOR,
    payload,
  };
}

export function updateOperator(payload: StakingUpdateOperatorProps) {
  return {
    type: StakingActionTypes.STAKING_UPDATE_OPERATOR,
    payload,
  };
}
