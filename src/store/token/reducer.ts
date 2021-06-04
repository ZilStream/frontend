import {HYDRATE} from 'next-redux-wrapper';
import { AnyAction } from 'redux'
import { TokenActionTypes } from "./actions";
import { TokenAddProps, TokenInitProps, TokenPoolUpdateProps, TokenState, TokenUpdateProps } from "./types";

const initialState: TokenState = {
  initialized: false,
  zilRate: 0,
  tokens: []
}

const reducer = (state: TokenState = initialState, action: AnyAction) => {
  const { payload } = action

  switch (action.type) {
    case HYDRATE:
      return {...state, ...action.payload.token}

    case TokenActionTypes.TOKEN_INIT:
      const initProps: TokenInitProps = payload
      return {
        ...state,
        tokens: [
          ...initProps.tokens
        ]
      }
    
    case TokenActionTypes.TOKEN_INITIALIZED:
      return {
        ...state,
        initialized: true
      }
    
    case TokenActionTypes.TOKEN_UPDATE:
      const updateProps: TokenUpdateProps = payload
      return {
        ...state,
        zilRate: (updateProps.address_bech32 === 'zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz' && updateProps.rate) ? updateProps.rate : state.zilRate,
        tokens: state.tokens.map(token => token.address_bech32 === updateProps.address_bech32 ?
          {...token, ...updateProps} :
          token
          )
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

    case TokenActionTypes.TOKEN_UPDATE_POOL:
      const poolProps: TokenPoolUpdateProps = payload
      return {
        ...state,
        tokens: state.tokens.map(token => {
          if(token.address_bech32 === poolProps.address) {
            return {
              ...token,
              pool: {
                ...token.pool,
                ...poolProps
              }
            }
          } else {
            return token
          }
        })
      }

    default:
      return state
  }
}

export default reducer