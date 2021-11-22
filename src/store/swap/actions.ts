import { SwapUpdateProps } from "./types";

export const SwapActionTypes = {
  SWAP_UPDATE: "SWAP_UPDATE"
}

export function updateSwap(payload: SwapUpdateProps) {
  return {
    type: SwapActionTypes.SWAP_UPDATE,
    payload
  }
}