import TokenIcon from 'components/TokenIcon'
import { ZIL_ADDRESS } from 'lib/constants'
import dynamic from 'next/dynamic'
import React from 'react'

const NotificationPermission = dynamic(
  () => import('components/NotifcationPermission'),
  { ssr: false }
)

function Alerts() {



  return (
    <>
      <div className="pt-8 pb-2 md:pb-8">
        <div className="flex flex-col lg:flex-row items-start">
          <div className="flex-grow">
            <h2 className="mb-1">Alerts</h2>
            <div className="text-gray-500 dark:text-gray-400 text-lg">Be the first to know about market changes.</div>
          </div>
        </div>
      </div>

      <NotificationPermission />

      <div className="scrollable-table-container max-w-full overflow-x-scroll">
        <table className="zilstream-table table-fixed border-collapse w-full">
          <colgroup>
            <col style={{width: '260px', minWidth: 'auto'}} />
            <col style={{width: '100px', minWidth: 'auto'}} />
            <col style={{width: '100px', minWidth: 'auto'}} />
            <col style={{width: '100px', minWidth: 'auto'}} />
            <col style={{width: '100px', minWidth: 'auto'}} />
          </colgroup>
          <thead className="text-gray-500 dark:text-gray-400 text-xs">
            <tr className="py-2">
              <th className="pl-4 pr-2 py-3 text-left">Token</th>
              <th className="px-2 py-3 text-right">Type</th>
              <th className="px-2 py-3 text-right">Value</th>
              <th className="px-2 py-3 text-right">Current</th>
              <th className="px-2 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr role="row" className="border-b dark:border-gray-700 last:border-b-0">
              <td className="pl-4 pr-2 py-3 text-left">
                <div className="flex items-center">
                  <div className="w-6 h-6 flex-shrink-0 flex-grow-0 mr-1 sm:mr-3">
                    <TokenIcon address={ZIL_ADDRESS} />
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <span className="hidden lg:inline whitespace-nowrap">Zilliqa</span>
                        <span className="lg:font-normal ml-2 lg:text-gray-500 whitespace-nowrap">ZIL</span>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-2 py-3 text-right">
                Price
              </td>
              <td className="px-2 py-3 text-right">
                Above $1.00
              </td>
              <td className="px-2 py-3 text-right">
                $0.04893
              </td>
              <td className="px-2 py-3 text-right">
                <button className="text-xs bg-gray-900 py-1 px-2 rounded">Edit</button>
                <button className="text-xs bg-gray-900 py-1 px-2 rounded ml-1">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Alerts