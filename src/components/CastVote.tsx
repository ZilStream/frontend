import React, { useState, Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { useSelector } from 'react-redux'
import { AccountState, RootState, TokenInfo } from 'store/types'
import { fromBech32Address } from '@zilliqa-js/zilliqa'
import sendGovernanceMessage from 'lib/zilliqa/sendGovernanceMessage'
import { Vote } from 'types/vote.interface'
import BigNumber from 'bignumber.js'
import useMoneyFormatter from 'utils/useMoneyFormatter'

interface Props {
  token: string
  proposal: string
  choices: string[]
  balance: BigNumber
  tokenInfo: TokenInfo
  onVoted: (() => void)
}

const CastVote = (props: Props) => {
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const [selectedChoice, setSelectedChoice] = useState<string|null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const moneyFormat = useMoneyFormatter()

  const handleVote = () => {
    castVote()
  }

  const castVote = async () => {
    if(!selectedChoice) return

    setIsLoading(true)

    const msg: any = {
      address: fromBech32Address(accountState.address),
      msg: JSON.stringify({
        token: props.token,
        type: 'vote',
        timestamp: (Date.now() / 1e3).toFixed(),
        version: '0.1.2',
        payload: {
          proposal: props.proposal,
          choice: props.choices.indexOf(selectedChoice)+1,
          metadata: {}
        },
      })
    }

    const zilPay = (window as any).zilPay
    msg.sig = await zilPay.wallet.sign(msg.msg)

    await sendGovernanceMessage(msg)

    props.onVoted()
  }

  return (
    <div className="bg-white dark:bg-gray-800 py-4 px-5 rounded-lg mt-4">
      <div className="font-medium flex items-center">
        <div className="flex-grow">Cast your vote</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{moneyFormat(props.balance, {compression: props.tokenInfo.decimals, maxFractionDigits: 2})} {props.tokenInfo.symbol}</div>
      </div>
      {!isLoading ? (
        <>
          <div className="mt-2 max-w-full relative">
            <Listbox value={selectedChoice} onChange={setSelectedChoice}>
              <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white dark:bg-gray-700 rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                <span className="block truncate">{selectedChoice ? selectedChoice : 'Select a choice'}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <SelectorIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white dark:bg-gray-600 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {props.choices.map((choice, index) => (
                    <Listbox.Option key={choice} value={choice} className={({ active }) => `${active ? 'text-primary bg-gray-700' : 'text-gray-900'} cursor-default select-none relative py-2 pl-10 pr-4`}>
                      {({ selected, active }) => (
                        <>
                          <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>{choice}</span>
                          {selected ? (
                            <span
                              className={`${
                                active ? 'text-primary' : ''
                              }
                                    absolute inset-y-0 left-0 flex items-center pl-3`}
                            >
                              <CheckIcon className="w-5 h-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </Listbox>
          </div>
          <button onClick={handleVote} className="bg-primary rounded-lg py-2 px-2 w-full font-medium mt-2 text-sm">Vote</button>
        </>
      ) : (
        <span className="text-gray-500 dark:text-gray-400 italic">Sending in your vote..</span>
      )}
    </div>
  )
}

export default CastVote