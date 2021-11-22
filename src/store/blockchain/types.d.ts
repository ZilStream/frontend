import { Zilliqa } from "@zilliqa-js/zilliqa";
import { Network } from "utils/network";
import { Node, TestnetNode } from "utils/node";

export interface BlockchainState {
  network: Network
  node: Node|TestnetNode
  client: Zilliqa
  blockHeight: number|null
}

export interface UpdateBlockchainProps extends Partial<BlockchainState> {}