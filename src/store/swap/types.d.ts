import { Token } from "store/types";

export type SwapState = {
  tokenInAddress: string|null
  tokenOutAddress: string|null
  slippage: number
  selectedDirection: "in"|"out"
}

export interface SwapUpdateProps extends Partial<SwapState> {}