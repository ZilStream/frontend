import { StakingAddProps, StakingInitProps, StakingUpdateProps } from "./types";

export const StakingActionTypes = {
  STAKING_INIT: "STAKING_INIT",
  STAKING_ADD: "STAKING_ADD",
  STAKING_UPDATE: "STAKING_UPDATE"
}

export function init(payload: StakingInitProps) {
  return {
    type: StakingActionTypes.STAKING_INIT,
    payload
  }
}

export function add(payload: StakingAddProps) {
  return {
    type: StakingActionTypes.STAKING_ADD,
    payload
  }
}

export function update(payload: StakingUpdateProps) {
  return {
    type: StakingActionTypes.STAKING_UPDATE,
    payload
  }
}