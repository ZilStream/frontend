import { Token } from "store/types";
import { Pair } from "types/pair.interface";
import { SwapExchange } from "types/swapExchange.interface";

export type SwapState = {
  exchange: SwapExchange
  tokenInAddress: string|null
  tokenOutAddress: string|null
  slippage: number
  selectedDirection: "in"|"out"
  availablePairs: Pair[]
}

export interface SwapUpdateProps extends Partial<SwapState> {}