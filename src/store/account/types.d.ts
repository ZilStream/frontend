import BigNumber from "bignumber.js";

export interface AccountState {
  network: Network,
  isConnected: boolean,
  address: string,
  totalBalance: BigNumber,
  holdingBalance: BigNumber,
  liquidityBalance: BigNumber,
  stakingBalance: BigNumber
}

export interface BalanceUpdateProps {
  totalBalance: BigNumber,
  holdingBalance: BigNumber,
  liquidityBalance: BigNumber,
  stakingBalance: BigNumber
}