import React from 'react'
import { Copy, ExternalLink } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { AccountActionTypes } from 'store/account/actions'
import { AccountState, RootState } from 'store/types'

interface Props {
  innerRef: React.RefObject<HTMLDivElement>
  dismissAction: () => void
}

const Account = (props: Props) => {
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const dispatch = useDispatch()

  const logout = () => {
    dispatch({ type: AccountActionTypes.WALLET_UPDATE, payload: '' })
    props.dismissAction()
  }

  return (
    <div className="absolute z-50 top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center bg-black bg-opacity-40">
      <div ref={props.innerRef} className="p-6 w-128 bg-white dark:bg-gray-700 rounded-lg flex flex-col items-center">
        <div className="font-bold text-xl">Your wallet</div>
        <div className="py-12 flex flex-col items-stretch">
          <div 
            className="bg-gray-300 dark:bg-gray-800 bg-opacity-30 py-3 px-6 rounded-full font-medium focus:outline-none"
          >{accountState.address}</div>
          <div className="flex items-center text-xs mt-2">
            <button 
              className="flex items-center px-2 py-1 rounded mr-2 focus:outline-none font-medium">
              Copy address 
              <Copy size={12} className="ml-2 text-gray-700 dark:text-gray-300" />
            </button>
            <a 
              href={`https://viewblock.io/zilliqa/address/${accountState.address}`} 
              target="_blank" 
              className="flex items-center px-2 py-1 rounded mr-2 font-medium">
              ViewBlock 
              <ExternalLink size={12} className="ml-2 text-gray-700 dark:text-gray-300" />
            </a>
          </div>
        </div>
        <button
          className="bg-gray-300 dark:bg-gray-800 py-2 px-4 rounded-full font-medium text-sm focus:outline-none"
          onClick={() => logout()}
        >Logout</button>
      </div>
    </div>
  )
}

export default Account