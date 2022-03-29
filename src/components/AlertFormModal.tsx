import { Dialog, Listbox, Transition } from "@headlessui/react"
import { SelectorIcon } from "@heroicons/react/solid"
import React, { useState, Fragment, useEffect } from "react"
import { X } from "react-feather"
import { useDispatch, useSelector } from "react-redux"
import { addAlert, updateAlert } from "store/alert/actions"
import { Alert, RootState, TokenState } from "store/types"
import { Indicator, labelForIndicator, labelForMetric, Metric } from "types/metric.interface"
import TokenIcon from "./TokenIcon"

interface Props {
  isOpen: boolean
  alert?: Alert
  onClose: () => void
}

const AlertFormModal = (props: Props) => {
  let { isOpen, alert } = props
  let tokenState = useSelector<RootState, TokenState>(state => state.token)
  let tokens = tokenState.tokens
  let streamToken = tokens.filter(token => token.isZil)?.[0]
  let alertToken = tokens.filter(token => token.address === alert?.token_address)?.[0]
  let dispatch = useDispatch()

  let [formState, setFormState] = useState({
    token: alert ? alertToken : streamToken,
    metric: alert ? alert.metric : Metric.Price,
    indicator: alert ? alert.indicator : Indicator.Above,
    value: alert ? alert.value : ''
  })

  useEffect(() => {
    setFormState({
      ...formState,
      token: streamToken
    })
  }, [tokens])

  useEffect(() => {
    setFormState({
      token: alert ? alertToken : streamToken,
      metric: alert ? alert.metric : Metric.Price,
      indicator: alert ? alert.indicator : Indicator.Above,
      value: alert ? alert.value : ''
    })
  }, [alert])

  function save() {
    if(formState.value === '') return

    if(alert) {
      dispatch(updateAlert({
        previous: alert,
        token_address: formState.token.address,
        metric: formState.metric,
        indicator: formState.indicator,
        value: +formState.value,
        triggered: false
      }))
    } else {
      dispatch(addAlert({
        alert: {
          token_address: formState.token.address,
          metric: formState.metric,
          indicator: formState.indicator,
          value: +formState.value,
          triggered: false
        }
      }))
    }
    
    props.onClose()
  }
  
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog 
        open={isOpen} 
        onClose={() => props.onClose()}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-70" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-12 rounded-lg shadow-lg max-w-md mx-auto text-center">
              <Dialog.Title className="text-xl font-bold mb-1">Add an alert</Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 dark:text-gray-400">Be the first to know about market changes by setting an alert for important metrics.</Dialog.Description>

              <div className="text-left py-8">
                <div>
                  <div className="font-semibold">Token</div>
                  <Listbox value={formState.token} onChange={value => setFormState({...formState, token: value})} disabled={alert !== undefined}>
                    <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                      <span className="flex items-center truncate">
                        <span className="inline-block w-4 h-4 mr-2">
                          <TokenIcon url={formState.token?.icon} />
                        </span>
                        <span className="mr-1">{formState.token?.name}</span>
                        <span className="text-gray-500 dark:text-gray-400">{formState.token?.symbol}</span>
                      </span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <SelectorIcon
                          className="w-5 h-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white dark:bg-gray-800 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
                      {tokens.sort((a,b) => a.name > b.name ? 1 : -1).map(token => (
                        <Listbox.Option 
                          key={token.address}
                          value={token}
                          className="py-2 pl-3 pr-10 border-b dark:border-gray-700 last:border-b-0"
                        >
                          <span className="flex items-center truncate">
                            <span className="inline-block w-4 h-4 mr-2">
                              <TokenIcon url={token.icon} />
                            </span>
                            <span className="mr-1">{token.name}</span>
                            <span className="text-gray-500 dark:text-gray-400">{token.symbol}</span>
                          </span>
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Listbox>
                </div>
                <div className="mt-3">
                  <div className="font-semibold">Metric</div>
                  <Listbox value={formState.metric} onChange={value => setFormState({...formState, metric: value})}>
                    <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-primary focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                      <span className="block truncate">
                        {labelForMetric(formState.metric)}
                      </span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <SelectorIcon
                          className="w-5 h-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white dark:bg-gray-800 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
                      {Object.values(Metric).filter(metric => typeof metric !== 'string').map(metric => {
                        if(typeof metric === 'string') return <></>
                        return (
                          <Listbox.Option 
                            key={metric}
                            value={metric}
                            className="py-2 pl-3 pr-10 border-b dark:border-gray-700 last:border-b-0"
                          >
                            <span className="block truncate">
                              {labelForMetric(metric)}
                            </span>
                          </Listbox.Option>
                        )
                      })}
                    </Listbox.Options>
                  </Listbox>
                </div>
                <div className="mt-3">
                  <div className="font-semibold">Value</div>
                  <div className="flex items-center gap-2">
                    <Listbox value={formState.indicator} onChange={value => setFormState({...formState, indicator: value})}>
                      <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                        <span className="block truncate">
                          {labelForIndicator(formState.indicator)}
                        </span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <SelectorIcon
                            className="w-5 h-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white dark:bg-gray-800 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
                        <Listbox.Option key={Indicator.Above} value={Indicator.Above} className="py-2 pl-3 pr-10 border-b dark:border-gray-700 last:border-b-0">
                          <span className="block truncate">Above</span>
                        </Listbox.Option>
                        <Listbox.Option key={Indicator.Below} value={Indicator.Below} className="py-2 pl-3 pr-10 border-b dark:border-gray-700 last:border-b-0">
                          <span className="block truncate">Below</span>
                        </Listbox.Option>
                      </Listbox.Options>
                    </Listbox>

                    <input 
                      type="number"
                      placeholder="0"
                      value={formState.value}
                      onChange={e => setFormState({...formState, value: e.target.value})}
                      className="relative w-full py-2 pl-3 pr-3 text-right bg-white dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-primary focus-visible:ring-offset-2 sm:text-sm" 
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-stretch">
                <button onClick={save} className="bg-primary rounded py-2 font-medium">Save</button>
              </div>

              <button onClick={() => props.onClose()} className="absolute right-4 top-4 text-gray-500 dark:text-gray-400"><X /></button>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default AlertFormModal