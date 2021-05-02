import { StakingInitProps, StakingUpdateProps } from "./types";

export const StakingActionTypes = {
  STAKING_INIT: "STAKING_INIT",
  STAKING_UPDATE: "STAKING_UPDATE"
}

export function init(payload: StakingInitProps) {
  return {
    type: StakingActionTypes.STAKING_INIT,
    payload
  }
}

export function update(payload: StakingUpdateProps) {
  return {
    type: StakingActionTypes.STAKING_UPDATE,
    payload
  }
}