import AlertFormModal from "components/AlertFormModal"
import EmptyRow from "components/EmptyRow"
import TokenIcon from "components/TokenIcon"
import { ZIL_ADDRESS } from "lib/constants"
import dynamic from "next/dynamic"
import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { deleteAlert } from "store/alert/actions"
import { Alert, AlertState, RootState, TokenState } from "store/types"
import { labelForIndicator, labelForMetric, Metric } from "types/metric.interface"
import { cryptoFormat, currencyFormat, numberFormat } from "utils/format"

const NotificationPermission = dynamic(
  () => import("components/NotifcationPermission"),
  { ssr: false }
)

function Alerts() {
  let tokenState = useSelector<RootState, TokenState>(state => state.token)
  let alertState = useSelector<RootState, AlertState>(state => state.alert)
  let [dialogOpen, setDialogOpen] = useState(false)
  let [currentAlert, setCurrentAlert] = useState<Alert|undefined>()
  let dispatch = useDispatch()

  function removeAlert(alert: Alert) {
    dispatch(deleteAlert({alert}))
  }

  if(!tokenState.initialized) return <></>

  return (
    <>
      <div className="pt-8 pb-2 md:pb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center">
          <div className="flex-grow">
            <h2 className="mb-1">Alerts</h2>
            <div className="text-gray-500 dark:text-gray-400 text-lg">Be the first to know about market changes.</div>
          </div>
          <div>
            <button
              onClick={() => {
                setCurrentAlert(undefined)
                setDialogOpen(true)
              }} 
              className="bg-primary py-1 px-3 rounded font-medium"
            >Create new alert</button>
          </div>
        </div>
      </div>

      <NotificationPermission />

      <div className="scrollable-table-container max-w-full overflow-x-scroll">
        <table className="zilstream-table table-fixed border-collapse w-full">
          <colgroup>
            <col style={{width: '140px', minWidth: 'auto'}} />
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
            {alertState.alerts.map((alert, index) => {
              let token = tokenState.tokens.filter(token => token.address === alert.token_address)?.[0]
              let currentRate = alert.metric === Metric.Price && alert.token_address !== ZIL_ADDRESS ? token.market_data.rate_usd : token.market_data.rate_zil
              let targetRate = alert.value
              let difference  = (1 - (currentRate / targetRate)) * 100

              return (
                <tr key={alert.token_address+alert.indicator+alert.metric+alert.value} role="row" className="border-b dark:border-gray-700 last:border-b-0">
                  <td className={`pl-4 pr-2 py-3 text-left ${index === 0 ? 'rounded-tl-lg' : ''} ${index === alertState.alerts.length-1 ? 'rounded-bl-lg' : ''}`}>
                    <div className="flex items-center">
                      <div className="w-6 h-6 flex-shrink-0 flex-grow-0 mr-1 sm:mr-3">
                        <TokenIcon address={alert.token_address} />
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span className="hidden lg:inline whitespace-nowrap">{token.name}</span>
                            <span className="lg:font-normal ml-2 lg:text-gray-500 whitespace-nowrap">{token.symbol}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-right">
                    {labelForMetric(alert.metric)}
                  </td>
                  <td className="px-2 py-3 text-right">
                    {labelForIndicator(alert.indicator)} {alert.value}
                  </td>
                  <td className="px-2 py-3 text-right">
                    {alert.metric === Metric.PriceZIL &&
                      <span>{cryptoFormat(currentRate)} <span className="text-red-500">(-{numberFormat(difference, 2)}%)</span></span>
                    }
                    {alert.metric === Metric.Price &&
                      <span>{currencyFormat(currentRate)} <span className="text-red-500">(-{numberFormat(difference, 2)}%)</span></span>
                    }
                  </td>
                  <td className={`px-2 py-3 text-right ${index === 0 ? 'rounded-tr-lg' : ''} ${index === alertState.alerts.length-1 ? 'rounded-br-lg' : ''}`}>
                    <button onClick={() => {
                      setCurrentAlert(alert)
                      setDialogOpen(true)
                    }} className="text-xs bg-gray-100 dark:bg-gray-900 py-1 px-2 rounded">Edit</button>
                    <button onClick={() => removeAlert(alert)} className="text-xs bg-gray-100 dark:bg-gray-900 py-1 px-2 rounded ml-1">Remove</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {alertState.alerts.length === 0 &&
          <EmptyRow message="You currently don't have any alerts setup." />
        }
      </div>

      <AlertFormModal isOpen={dialogOpen} alert={currentAlert} onClose={() => setDialogOpen(false)} />
    </>
  )
}

export default Alerts