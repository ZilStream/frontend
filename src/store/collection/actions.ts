import { CollectionAddProps, CollectionInitProps, CollectionUpdateProps } from "./types";

export const CollectionActionTypes = {
  COLLECTION_INIT: "COLLECTION_INIT",
  COLLECTION_UPDATE: "COLLECTION_UPDATE",
  COLLECTION_ADD: "COLLECTION_ADD",
  COLLECTION_INITIALIZED: "COLLECTION_INITIALIZED"
}

export function init(payload: CollectionInitProps) {
  return {
    type: CollectionActionTypes.COLLECTION_INIT,
    payload
  }
}

export function update(payload: CollectionUpdateProps) {
  return {
    type: CollectionActionTypes.COLLECTION_UPDATE,
    payload
  }
}

export function add(payload: CollectionAddProps) {
  return {
    type: CollectionActionTypes.COLLECTION_ADD,
    payload
  }
}