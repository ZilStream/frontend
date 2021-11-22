import BigNumber from "bignumber.js";

export type ExchangeRate = {
  expectedAmount: BigNumber
  expectedSlippage: BigNumber
}

export type TxParams = {
  version: number
  gasPrice: BN
  gasLimit: Long
  nonce: number
}