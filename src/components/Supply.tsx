import React, { useState } from 'react'
import { Token } from 'shared/token.interface'
import { numberFormat } from 'utils/format'
import { Info } from 'react-feather'
import Tippy from '@tippyjs/react'

interface Props {
  token: Token
}

const Supply = (props: Props) => {
  const [showPopup, setShowPopup] = useState(false)

  const percentage = (props.token.current_supply / props.token.max_supply) * 100
  const excludedAddresses = (props.token.supply_skip_addresses != "") ? props.token.supply_skip_addresses.split(",") : []
  
  const SupplyInfo = (
    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md text-sm">
      <div className="mb-2">The amount of tokens that are currently circulating in the market.</div>
      <div className="flex items-center">
        <div className="flex-grow">Initial Supply:</div>
        <div className="font-semibold">{numberFormat(props.token.init_supply, 0)}</div>
      </div>

      {props.token.max_supply > 0 &&
        <div className="flex items-center">
          <div className="flex-grow">Max Supply:</div>
          <div className="font-semibold">{numberFormat(props.token.max_supply, 0)}</div>
        </div>
      }
      
      {excludedAddresses.length > 0 &&
        <div className="mt-4 text-xs">
          <div>Excluded addresses:</div>
          {excludedAddresses.map(address => {                
            return (
              <div key={address} className="text-gray-600 dark:text-gray-400">
                {address}
              </div>
            )
          })}
        </div>
      }
    </div>
  )

  if(!props.token.max_supply && props.token.max_supply == 0) {
    return (
      <div className="relative">
        <div className="mb-2 flex items-center">
          <div className="flex-grow font-medium">
            { numberFormat(props.token.current_supply, 0) } {props.token.symbol}
          </div>
          <Tippy content={SupplyInfo}>
            <button className="ml-2 focus:outline-none">
              <Info size={14} className="text-gray-500" />
            </button>
          </Tippy>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="mb-2 flex items-center">
        <div className="flex-grow font-medium">
          { numberFormat(props.token.current_supply, 0) } {props.token.symbol}
        </div>
        <div className="font-medium">
          {numberFormat(percentage, 0)}%
        </div>
        <Tippy content={SupplyInfo}>
          <button className="ml-2 focus:outline-none">
            <Info size={14} className="text-gray-500" />
          </button>
        </Tippy>
      </div>
      <div className="h-3 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-700">
        <div className="h-full bg-gray-500" style={{width: numberFormat(percentage, 0) + '%'}}></div>
      </div>
    </div>
  )
}

export default Supply