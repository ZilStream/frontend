import { Zilliqa } from '@zilliqa-js/zilliqa'
import {HYDRATE} from 'next-redux-wrapper'
import { AnyAction } from 'redux'
import { Network } from 'utils/network'
import { Node } from 'utils/node'
import { BlockchainActionsTypes } from './actions'
import { BlockchainState, UpdateBlockchainProps } from './types'

const initialState: BlockchainState = {
  network: Network.MainNet,
  node: Node.ZilStream,
  client: new Zilliqa(Node.ZilStream),
  blockHeight: null,
}

const reducer = (state: BlockchainState = initialState, action: AnyAction) => {
  const { payload } = action

  switch(action.type) {
    case HYDRATE:
      return {...state, ...payload.blockchain}

    case BlockchainActionsTypes.BLOCKCHAIN_UPDATE:
      const updateProps: UpdateBlockchainProps = payload
      return {
        ...state,
        ...updateProps
      }

    default:
      return state
  }
}

export default reducer