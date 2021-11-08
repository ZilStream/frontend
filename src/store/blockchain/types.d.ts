import { Network } from "utils/network";

export interface BlockchainState {
  network: Network
  blockHeight: number|null
}

export interface UpdateBlockchainProps extends Partial<BlockchainState> {}