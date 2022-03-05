import { SelectWalletProps, UpdateWalletProps } from "store/types"
import { AddWalletProps, DeleteWalletProps } from "./types"

export const AccountActionTypes = {
  INIT_ACCOUNT: "INIT_ACCOUNT",
  NETWORK_UPDATE: "NETWORK_UPDATE",
  ADD_WALLET: "ADD_WALLET",
  UPDATE_WALLET: "UPDATE_WALLET",
  DELETE_WALLET: "DELETE_WALLET",
  SELECT_WALLET: "SELECT_WALLET",
  LOGOUT: "LOGOUT"
}

export function updateNetwork(payload: string) {
  return {
    type: AccountActionTypes.NETWORK_UPDATE,
    payload
  }
}

export function addWallet(payload: AddWalletProps) {
  return {
    type: AccountActionTypes.ADD_WALLET,
    payload
  }
}

export function updateWallet(payload: UpdateWalletProps) {
  return {
    type: AccountActionTypes.UPDATE_WALLET,
    payload
  }
}

export function deleteWallet(payload: DeleteWalletProps) {
  return {
    type: AccountActionTypes.DELETE_WALLET,
    payload
  }
}

export function selectWallet(payload: SelectWalletProps) {
  return {
    type: AccountActionTypes.SELECT_WALLET,
    payload
  }
}

export function logout() {
  return {
    type: AccountActionTypes.LOGOUT
  }
}