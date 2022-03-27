import React from 'react'
import { Transaction } from 'types/transaction.interface'
import dayjs from 'dayjs'
import { ArrowDown, ArrowRight, ArrowUp, ExternalLink } from 'react-feather'
import TokenIcon from './TokenIcon'
import useMoneyFormatter, { toBigNumber } from 'utils/useMoneyFormatter'
import { AccountState, RootState, Token, TokenState } from 'store/types'
import { useSelector } from 'react-redux'
import { shortenAddress } from 'utils/shorten'
import { ZIL_ADDRESS } from 'lib/constants'

interface Props {
  transaction: Transaction
}

const TransactionRow = (props: Props) => {
  const { transaction } = props
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const moneyFormat = useMoneyFormatter()

  const findToken = (address: string): Token|null => {
    const tokens = tokenState.tokens.filter(token => token.address === address)
    if(tokens.length > 0) {
      return tokens[0]
    }
    return null
  }

  const inToken = findToken(transaction.token_in_address)
  const outToken = findToken(transaction.token_out_address)
  
  var gasCost = toBigNumber(0)
  var data: any = null
  var receipt: any = null

  try {
    data = JSON.parse(transaction.data)
  } catch(e) {}  

  try {
    receipt = JSON.parse(transaction.receipt)
    gasCost = toBigNumber(transaction.gas_price).shiftedBy(-12).times(receipt.cumulative_gas)
  } catch(e) {}  

  var identifier = "Payment"
  if(transaction.sub_type === 'swap') {
    identifier = "Swap"
  } else if(transaction.sub_type === 'add_liquidity') {
    identifier = "Add Liquidity"
  } else if(transaction.sub_type === 'remove_liquidity') {
    identifier = "Remove Liquidity"
  } else if (transaction.type === 'contract') {
    identifier = data._tag
  }

  var incoming = true
  if(transaction.from_address === accountState.selectedWallet?.address) {
    incoming = false
  }

  return (
    <div className="px-4 py-3 border-b dark:border-gray-700 last:border-b-0 flex flex-col md:flex-row md:items-center text-sm md:text-base">
      <div className="md:w-80 flex items-center md:mr-4">
        <div className="flex mr-2 md:mr-6">
          <div className="bg-gray-100 dark:bg-gray-700 h-6 w-6 md:w-10 md:h-10 p-1 md:p-3 rounded-full flex items-center justify-center">
            {transaction.sub_type === 'swap' ? (
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="transactions-type" xmlns="http://www.w3.org/2000/svg"><path d="M131.3 231.1L32 330.6l99.3 99.4v-74.6h174.5v-49.7H131.3v-74.6zM480 181.4L380.7 82v74.6H206.2v49.7h174.5v74.6l99.3-99.5z"></path></svg>
            ) : (
              <>
                {incoming ? (
                  <ArrowDown size={16} />
                ) : (
                  <ArrowUp size={16} />
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex-grow mr-4 flex items-center md:items-start md:flex-col">
          <div className="mr-1 break-all">{identifier} {transaction.success === false && <span className="bg-red-500 rounded-full px-1 text-xs font-medium">Failed</span>}</div>
          <time className="text-sm text-gray-500 dark:text-gray-400">{dayjs(transaction.timestamp).format('h:mm a')}</time>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-300 flex gap-2 md:hidden">
          <div className="flex gap-2">
            <div className="flex items-center justify-end gap-1 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-3 h-3">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000" enableBackground="new 0 0 1000 1000" className="fill-gray-500 dark:fill-gray-400">
                  <g><path d="M663.3,888V438.7H694c16.9,0,30.6,13.8,30.6,30.6v285.9c0,73.2,59.5,132.7,132.7,132.7c73.2,0,132.7-59.5,132.7-132.7V205.6c0-28.8-11.9-54.7-30.8-73.2L850.9,24.9c-19.6-19.6-51.2-19.6-70.8,0c-19.6,19.6-19.6,51.2,0,70.8l70.3,70.5l-51.9,54.1c-16.9,17.4-16.9,45.3,0,62.8c8.4,9,19.6,13.2,30.8,13l58.5-0.2v459.5c0,16.9-13.8,30.6-30.6,30.6c-16.9,0-30.6-13.8-30.6-30.6V469.4c0-73.2-59.5-132.7-132.7-132.7h-30.6v-245c0-45.1-36.5-81.7-81.7-81.7H153c-45.1,0-81.7,36.5-81.7,81.7V888H61c-28.3,0-51,22.9-51,51c0,28.3,22.9,51,51,51h612.6c28.3,0,51-22.9,51-51c0-28.3-22.9-51-51-51H663.3L663.3,888z M218.3,112h298c25,0,45,20,45,45v216.4c0,25-20,45-45,45h-298c-25,0-45-20-45-45V157C173.3,132,193.3,112,218.3,112L218.3,112z"/></g>
                </svg>
              </div>
            </div>
            <div className="flex items-center justify-end gap-1">
              <span className="">{moneyFormat(gasCost, {
                compression: 0,
                maxFractionDigits: 2
              })}</span>
              <div className="w-4 h-4"><TokenIcon address={ZIL_ADDRESS} /></div> 
            </div>
          </div>
          <a 
            href={`https://viewblock.io/zilliqa/tx/0x${transaction.hash}`} 
            target="_blank" 
            className="flex items-center py-1 rounded font-normal">
            <ExternalLink size={14} className="ml-2 text-gray-500 dark:text-gray-300" />
          </a>
        </div>
      </div>
      <div className="flex-grow flex items-center mt-1 md:mt-0">
        {
          (() => {
            if (transaction.sub_type === 'swap')
              return <>
                <div className="w-48 flex items-center">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center mr-2" style={{padding: '5px'}}>
                    <TokenIcon address={transaction.token_in_address} />
                  </div>
                  <div className="font-medium">
                    -{moneyFormat(transaction.token_in_amount, {
                      compression: inToken?.decimals,
                      maxFractionDigits: 2
                    })} {inToken?.symbol}
                  </div>
                </div>
                <div className="mx-5">
                  <ArrowRight size={18} className="text-gray-500" />
                </div>
                <div className="w-48 flex items-center">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center mr-2" style={{padding: '5px'}}>
                    <TokenIcon address={transaction.token_out_address} />
                  </div>
                  <div className="font-medium">
                    +{moneyFormat(transaction.token_out_amount, {
                      compression: outToken?.decimals,
                      maxFractionDigits: 2
                    })} {outToken?.symbol}
                  </div>
                </div>
              </>
            if (transaction.sub_type === 'add_liquidity')
              return <>
                <div className="w-48 flex flex-col font-medium">
                  <div className="text-gray-500">Add</div>
                  <a 
                    href={`https://viewblock.io/zilliqa/address/${transaction.to_address}`} 
                    target="_blank" 
                    className="font-medium">
                    {shortenAddress(transaction.to_address)}
                  </a>
                </div>
                <div className="mx-5">
                  <ArrowRight size={18} className="text-gray-500" />
                </div>
                <div className="w-48 flex flex-col">
                  <div className="flex items-center">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-1 w-5 h-5 mr-2">
                      <TokenIcon address={transaction.token_in_address} />
                    </div>
                    <div className="font-medium">
                      -
                      {moneyFormat(transaction.token_in_amount, {
                        compression: inToken?.decimals,
                        maxFractionDigits: 2
                      })} {inToken?.symbol}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-1 w-5 h-5 mr-2">
                      <TokenIcon address={`zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz`} />
                    </div>
                    <div className="font-medium">
                      -
                      {moneyFormat(transaction.zil_amount, {
                        compression: 12,
                        maxFractionDigits: 2
                      })} ZIL
                    </div>
                  </div>
                </div>
              </>
            if (transaction.sub_type === 'remove_liquidity')
              return <>
                <div className="w-48 flex flex-col font-medium">
                  <div className="text-gray-500">Remove</div>
                  <a 
                    href={`https://viewblock.io/zilliqa/address/${transaction.to_address}`} 
                    target="_blank" 
                    className="font-medium">
                    {shortenAddress(transaction.to_address)}
                  </a>
                </div>
                <div className="mx-5">
                  <ArrowRight size={18} className="text-gray-500" />
                </div>
                <div className="w-48 flex flex-col">
                  <div className="flex items-center">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-1 w-5 h-5 mr-2">
                      <TokenIcon address={transaction.token_in_address} />
                    </div>
                    <div className="font-medium">
                      -
                      {moneyFormat(transaction.token_in_amount, {
                        compression: inToken?.decimals,
                        maxFractionDigits: 2
                      })} {inToken?.symbol}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-1 w-5 h-5 mr-2">
                      <TokenIcon address={transaction.token_out_address} />
                    </div>
                    <div className="font-medium">
                      -
                      {moneyFormat(transaction.token_out_amount, {
                        compression: 12,
                        maxFractionDigits: 2
                      })} ZIL
                    </div>
                  </div>
                </div>
              </>
            if (transaction.type === 'payment')
              return <>
                <div className="w-48 flex flex-col font-medium">
                  {incoming ? (
                    <>
                      <div className="text-gray-500 dark:text-gray-400">From</div>
                      <a 
                        href={`https://viewblock.io/zilliqa/address/${transaction.from_address}`} 
                        target="_blank" 
                        className="font-medium">
                        {shortenAddress(transaction.from_address)}
                      </a>
                    </>
                  ) : (
                    <>
                      <div className="text-gray-500 dark:text-gray-400">To</div>
                      <a 
                        href={`https://viewblock.io/zilliqa/address/${transaction.to_address}`} 
                        target="_blank" 
                        className="font-medium">
                        {shortenAddress(transaction.to_address)}
                      </a>
                    </>
                  )}
                </div>
                <div className="mx-5">
                  <ArrowRight size={18} className="text-gray-500" />
                </div>
                <div className="w-48 flex items-center">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-1 w-8 h-8 mr-2">
                    <TokenIcon address={`zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz`} />
                  </div>
                  <div className="font-medium">
                  {incoming ? (<>+</>) : (<>-</>)}
                  {moneyFormat(transaction.zil_amount, {
                    compression: 12,
                    maxFractionDigits: 2
                  })} ZIL
                  </div>
                </div>
              </>
            else
              return <>
                <div className="w-48 flex flex-col font-medium">
                  <div className="text-gray-500 dark:text-gray-400">From</div>
                  <a 
                    href={`https://viewblock.io/zilliqa/address/${transaction.from_address}`} 
                    target="_blank" 
                    className="font-medium">
                    {shortenAddress(transaction.from_address)}
                  </a>
                </div>
                <div className="mx-5">
                  <ArrowRight size={18} className="text-gray-500" />
                </div>
                <div className="w-48 flex flex-col font-medium">
                  <div className="text-gray-500 dark:text-gray-400">To</div>
                  <a 
                    href={`https://viewblock.io/zilliqa/address/${transaction.to_address}`} 
                    target="_blank" 
                    className="font-medium">
                    {shortenAddress(transaction.to_address)}
                  </a>
                </div>
              </>
          })()
        }
        
      </div>
      <div className="hidden md:flex flex-col whitespace-nowrap mr-8 ">
        <div className="flex items-center justify-end gap-1 text-sm text-gray-500 dark:text-gray-400">
          Gas fee
          <div className="w-3 h-3">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000" enableBackground="new 0 0 1000 1000" className="fill-gray-500 dark:fill-gray-400">
              <g><path d="M663.3,888V438.7H694c16.9,0,30.6,13.8,30.6,30.6v285.9c0,73.2,59.5,132.7,132.7,132.7c73.2,0,132.7-59.5,132.7-132.7V205.6c0-28.8-11.9-54.7-30.8-73.2L850.9,24.9c-19.6-19.6-51.2-19.6-70.8,0c-19.6,19.6-19.6,51.2,0,70.8l70.3,70.5l-51.9,54.1c-16.9,17.4-16.9,45.3,0,62.8c8.4,9,19.6,13.2,30.8,13l58.5-0.2v459.5c0,16.9-13.8,30.6-30.6,30.6c-16.9,0-30.6-13.8-30.6-30.6V469.4c0-73.2-59.5-132.7-132.7-132.7h-30.6v-245c0-45.1-36.5-81.7-81.7-81.7H153c-45.1,0-81.7,36.5-81.7,81.7V888H61c-28.3,0-51,22.9-51,51c0,28.3,22.9,51,51,51h612.6c28.3,0,51-22.9,51-51c0-28.3-22.9-51-51-51H663.3L663.3,888z M218.3,112h298c25,0,45,20,45,45v216.4c0,25-20,45-45,45h-298c-25,0-45-20-45-45V157C173.3,132,193.3,112,218.3,112L218.3,112z"/></g>
            </svg>
          </div>
        </div>
        <div className="flex items-center justify-end gap-1">
          <span className="">{moneyFormat(gasCost, {
            compression: 0,
            maxFractionDigits: 2
          })}</span>
          <div className="w-4 h-4"><TokenIcon address={ZIL_ADDRESS} /></div> 
        </div>
      </div>
      <div className="hidden md:block text-sm text-gray-500 dark:text-gray-300">
        <a 
          href={`https://viewblock.io/zilliqa/tx/0x${transaction.hash}`} 
          target="_blank" 
          className="flex items-center px-2 py-1 rounded mr-2 font-normal">
          ViewBlock 
          <ExternalLink size={12} className="ml-2 text-gray-500 dark:text-gray-300" />
        </a>
      </div>
    </div>
  )
}

export default TransactionRow