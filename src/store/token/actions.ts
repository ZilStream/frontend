import { TokenAddProps, TokenInitProps, TokenPoolUpdateProps, TokenUpdateProps } from "./types";

export const TokenActionTypes = {
  TOKEN_INIT: "TOKEN_INIT",
  TOKEN_UPDATE: "TOKEN_UPDATE",
  TOKEN_ADD: "TOKEN_ADD",
  TOKEN_UPDATE_POOL: "TOKEN_UPDATE_POOL"
}

export function init(payload: TokenInitProps) {
  return {
    type: TokenActionTypes.TOKEN_INIT,
    payload
  }
}

export function update(payload: TokenUpdateProps) {
  return {
    type: TokenActionTypes.TOKEN_UPDATE,
    payload
  }
}

export function add(payload: TokenAddProps) {
  return {
    type: TokenActionTypes.TOKEN_ADD,
    payload
  }
}

export function updatePool(payload: TokenPoolUpdateProps) {
  return {
    type: TokenActionTypes.TOKEN_UPDATE_POOL,
    payload
  }
}