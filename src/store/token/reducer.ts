import { ZIL_ADDRESS } from 'lib/constants';
import {HYDRATE} from 'next-redux-wrapper';
import { AnyAction } from 'redux'
import { TokenActionTypes } from "./actions";
import { TokenAddProps, TokenInitProps, TokenPool, TokenPoolUpdateProps, TokenState, TokenUpdateProps } from "./types";

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
        initialized: true,
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
        zilRate: (updateProps.address === ZIL_ADDRESS && updateProps.market_data?.rate_zil) ? updateProps.market_data.rate_zil : state.zilRate,
        tokens: state.tokens.map(token => token.address === updateProps.address ?
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
      var foundPool = false
      var newState = {
        ...state,
        tokens: state.tokens.map(token => {
          if(token.address === poolProps.address) {
            return {
              ...token,
              pools: token.pools?.map(pool => {
                if(pool.dex == poolProps.dex && pool.baseAddress == poolProps.baseAddress && pool.quoteAddress == poolProps.quoteAddress) {
                  foundPool = true
                  return {
                    ...pool,
                    ...poolProps
                  }
                } else {
                  return pool
                }
              })
            }
          } else {
            return token
          }
        })
      }

      // If there's no pool to updated, insert the pool instead.
      if(!foundPool) {
        let tokenPool: TokenPool = {
          ...poolProps
        }
        newState = {
          ...state,
          tokens: state.tokens.map(token => {
            if(token.address === poolProps.address) {
              return {
                ...token,
                pools: [
                  ...token.pools ?? [],
                  tokenPool
                ]
              }
            } else {
              return token
            }
          })
        }
      }

      return newState

    default:
      return state
  }
}

export default reducer