import {HYDRATE} from 'next-redux-wrapper';
import { TokenActionTypes } from "./actions";
import { TokenAddProps, TokenInitProps, TokenState, TokenUpdateProps } from "./types";

const initialState: TokenState = {
  initialized: false,
  tokens: []
}

const reducer = (state: TokenState = initialState, action: any) => {
  const { payload } = action

  switch (action.type) {
    case HYDRATE:
      return {...state, ...action.payload}

    case TokenActionTypes.TOKEN_ADD:
      const initProps: TokenInitProps = payload
      return {
        ...state,
        initialized: true,
        tokens: [
          ...initProps.tokens
        ]
      }
    
    case TokenActionTypes.TOKEN_UPDATE:
      const updateProps: TokenUpdateProps = payload
      return {
        ...state,
        tokens: [
          ...state.tokens,
        ]
      }

    case TokenActionTypes.TOKEN_ADD:
      const addProps: TokenAddProps = payload
      return {
        ...state,
        tokens: [
          ...state.tokens,
          addProps.token
        ]
      }

    default:
      return state
  }
}

export default reducer