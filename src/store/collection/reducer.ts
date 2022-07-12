import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux'
import { CollectionActionTypes } from './actions';
import { CollectionAddProps, CollectionInitProps, CollectionState, CollectionUpdateProps } from "./types";

const initialState: CollectionState = {
  initialized: false,
  collections: []
}

const reducer = (state: CollectionState = initialState, action: AnyAction) => {
  const { payload } = action

  switch (action.type) {
    case HYDRATE:
      return {...state, ...action.payload.collection}

    case CollectionActionTypes.COLLECTION_INIT:
      const initProps: CollectionInitProps = payload
      return {
        ...state,
        initialized: true,
        collections: [
          ...initProps.collections
        ]
      }

    case CollectionActionTypes.COLLECTION_INITIALIZED:
      return {
        ...state,
        initialized: true
      }

    case CollectionActionTypes.COLLECTION_UPDATE:
      const updateProps: CollectionUpdateProps = payload
      return {
        ...state,
        collections: state.collections.map(collection => collection.address === updateProps.address ?
          {...collection, ...updateProps} :
          collection
          )
      }

    case CollectionActionTypes.COLLECTION_ADD:
      const addProps: CollectionAddProps = payload
      return {
        ...state,
        collections: [
          ...state.collections,
          addProps.collection
        ]
      }

    default:
      return state
  }
}

export default reducer