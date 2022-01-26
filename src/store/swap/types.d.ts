import { Token } from "store/types";
import { SwapExchange } from "types/swapExchange.interface";

export type SwapState = {
  exchange: SwapExchange
  tokenInAddress: string|null
  tokenOutAddress: string|null
  slippage: number
  selectedDirection: "in"|"out"
}

export interface SwapUpdateProps extends Partial<SwapState> {}