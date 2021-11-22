import { UpdateBlockchainProps } from "./types";

export const BlockchainActionsTypes = {
  BLOCKCHAIN_UPDATE: "BLOCKCHAIN_UPDATE"
}

export function updateBlockchain(payload: UpdateBlockchainProps) {
  return {
    type: BlockchainActionsTypes.BLOCKCHAIN_UPDATE,
    payload
  }
}