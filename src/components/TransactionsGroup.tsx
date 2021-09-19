import dayjs from 'dayjs'
import React from 'react'
import { ArrowDown, ArrowRight, ArrowUp, ExternalLink } from 'react-feather'
import { useSelector } from 'react-redux'
import { AccountState, RootState, TokenInfo, TokenState } from 'store/types'
import { Transaction } from 'types/transaction.interface'
import { shortenAddress } from 'utils/addressShortener'
import useMoneyFormatter from 'utils/useMoneyFormatter'
import TokenIcon from './TokenIcon'

interface Props {
  transactions: Transaction[]
}

const TransactionsGroup = (props: Props) => {
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const moneyFormat = useMoneyFormatter()

  function findToken(address: string): TokenInfo|null {
    const tokens = tokenState.tokens.filter(token => token.address_bech32 === address)
    if(tokens.length > 0) {
      return tokens[0]
    }
    return null
  }

  return (
    <>
      {props.transactions.map(transaction => {
        if(transaction.sub_type === 'swap') {
          const inToken = findToken(transaction.token_in_address)
          const outToken = findToken(transaction.token_out_address)
          
          return (
            <div className="px-4 py-3 border-b dark:border-gray-700 last:border-b-0 flex flex-col md:flex-row md:items-center text-sm md:text-base">
              <div className="md:w-64 flex items-center">
                <div className="flex mr-2 md:mr-6">
                  <div className="bg-gray-100 dark:bg-gray-700 h-6 w-6 md:w-10 md:h-10 p-1 md:p-3 rounded-full flex items-center justify-center">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="transactions-type" xmlns="http://www.w3.org/2000/svg"><path d="M131.3 231.1L32 330.6l99.3 99.4v-74.6h174.5v-49.7H131.3v-74.6zM480 181.4L380.7 82v74.6H206.2v49.7h174.5v74.6l99.3-99.5z"></path></svg>
                  </div>
                </div>
                <div className="flex-grow mr-4 flex items-center md:items-start md:flex-col">
                  <div className="mr-1">Swap</div>
                  <time className="text-sm text-gray-500">{dayjs(transaction.timestamp).format('h:mm a')}</time>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-300 block md:hidden">
                  <a 
                    href={`https://viewblock.io/zilliqa/tx/0x${transaction.hash}`} 
                    target="_blank" 
                    className="flex items-center py-1 rounded font-normal">
                    ViewBlock 
                    <ExternalLink size={12} className="ml-2 text-gray-500 dark:text-gray-300" />
                  </a>
                </div>
              </div>
              <div className="flex-grow flex items-center mt-1 md:mt-0">
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
        } else if(transaction.sub_type === 'add_liquidity') {
          const token = findToken(transaction.token_in_address)
          return (
            <div className="px-4 py-3 border-b dark:border-gray-700 last:border-b-0 flex flex-col md:flex-row md:items-center text-sm md:text-base">
              <div className="md:w-64 flex items-center">
                <div className="flex mr-2 md:mr-6">
                  <div className="bg-gray-100 dark:bg-gray-700 h-6 w-6 md:w-10 md:h-10 p-1 md:p-3 rounded-full flex items-center justify-center">
                    <ArrowUp size={16} />
                  </div>
                </div>
                <div className="flex-grow mr-4 flex items-center md:items-start md:flex-col">
                  <div className="mr-1">Liquidity</div>
                  <time className="text-sm text-gray-500">{dayjs(transaction.timestamp).format('h:mm a')}</time>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-300 block md:hidden">
                  <a 
                    href={`https://viewblock.io/zilliqa/tx/0x${transaction.hash}`} 
                    target="_blank" 
                    className="flex items-center py-1 rounded font-normal">
                    ViewBlock 
                    <ExternalLink size={12} className="ml-2 text-gray-500 dark:text-gray-300" />
                  </a>
                </div>
              </div>
              <div className="flex-grow flex items-center">
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
                        compression: token?.decimals,
                        maxFractionDigits: 2
                      })} {token?.symbol}
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
        } else if(transaction.sub_type === 'remove_liquidity') {
          const token = findToken(transaction.token_in_address)
          return (
            <div className="px-4 py-3 border-b dark:border-gray-700 last:border-b-0 flex flex-col md:flex-row md:items-center text-sm md:text-base">
              <div className="md:w-64 flex items-center">
                <div className="flex mr-2 md:mr-6">
                  <div className="bg-gray-100 dark:bg-gray-700 h-6 w-6 md:w-10 md:h-10 p-1 md:p-3 rounded-full flex items-center justify-center">
                    <ArrowUp size={16} />
                  </div>
                </div>
                <div className="flex-grow mr-4 flex items-center md:items-start md:flex-col">
                  <div className="mr-1">Liquidity</div>
                  <time className="text-sm text-gray-500">{dayjs(transaction.timestamp).format('h:mm a')}</time>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-300 block md:hidden">
                  <a 
                    href={`https://viewblock.io/zilliqa/tx/0x${transaction.hash}`} 
                    target="_blank" 
                    className="flex items-center py-1 rounded font-normal">
                    ViewBlock 
                    <ExternalLink size={12} className="ml-2 text-gray-500 dark:text-gray-300" />
                  </a>
                </div>
              </div>
              <div className="flex-grow flex items-center">
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
                        compression: token?.decimals,
                        maxFractionDigits: 2
                      })} {token?.symbol}
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
        } else if(transaction.type === 'payment') {
          var incoming = true
          if(transaction.from_address === accountState.selectedWallet?.address) {
            incoming = false
          }
    
          return (
            <div className="px-4 py-3 border-b dark:border-gray-700 last:border-b-0 flex flex-col md:flex-row md:items-center text-sm md:text-base">
              <div className="md:w-64 flex items-center">
                <div className="flex mr-2 md:mr-6">
                  <div className="bg-gray-100 dark:bg-gray-700 h-6 w-6 md:w-10 md:h-10 p-1 md:p-3 rounded-full flex items-center justify-center">
                    {incoming ? (
                      <ArrowDown size={16} />
                    ) : (
                      <ArrowUp size={16} />
                    )}
                  </div>
                </div>
                <div className="flex-grow mr-4 flex items-center md:items-start md:flex-col">
                  {incoming ? (
                    <div className="mr-1">Receive</div>
                  ) : (
                    <div className="mr-1">Send</div>
                  )}
                  <time className="text-sm text-gray-500">{dayjs(transaction.timestamp).format('h:mm a')}</time>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-300 block md:hidden">
                  <a 
                    href={`https://viewblock.io/zilliqa/tx/0x${transaction.hash}`} 
                    target="_blank" 
                    className="flex items-center py-1 rounded font-normal">
                    ViewBlock 
                    <ExternalLink size={12} className="ml-2 text-gray-500 dark:text-gray-300" />
                  </a>
                </div>
              </div>
              <div className="flex-grow flex items-center">
                <div className="w-48 flex flex-col font-medium">
                  {incoming ? (
                    <>
                      <div className="text-gray-500">From</div>
                      <a 
                        href={`https://viewblock.io/zilliqa/address/${transaction.from_address}`} 
                        target="_blank" 
                        className="font-medium">
                        {shortenAddress(transaction.from_address)}
                      </a>
                    </>
                  ) : (
                    <>
                      <div className="text-gray-500">To</div>
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
        } else {
          return (
            <div className="px-4 py-3 border-b dark:border-gray-700 last:border-b-0 flex flex-col md:flex-row md:items-center text-sm md:text-base">
              <div className="md:w-64 flex items-center">
                <div className="flex mr-2 md:mr-6">
                  <div className="bg-gray-100 dark:bg-gray-700 h-6 w-6 md:w-10 md:h-10 p-1 md:p-3 rounded-full flex items-center justify-center">
                    <ArrowUp size={16} />
                  </div>
                </div>
                <div className="flex-grow mr-4 flex items-center md:items-start md:flex-col">
                  <div className="mr-1 flex items-center gap-2">Send {transaction.success === false && <span className="bg-red-500 rounded-full px-1 text-xs font-medium">Failed</span>}</div>
                  <time className="text-sm text-gray-500">{dayjs(transaction.timestamp).format('h:mm a')}</time>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-300 block md:hidden">
                  <a 
                    href={`https://viewblock.io/zilliqa/tx/0x${transaction.hash}`} 
                    target="_blank" 
                    className="flex items-center py-1 rounded font-normal">
                    ViewBlock 
                    <ExternalLink size={12} className="ml-2 text-gray-500 dark:text-gray-300" />
                  </a>
                </div>
              </div>
              <div className="flex-grow flex items-center">
                <div className="w-48 flex flex-col font-medium">
                  <div className="text-gray-500">From</div>
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
                  <div className="text-gray-500">To</div>
                  <a 
                    href={`https://viewblock.io/zilliqa/address/${transaction.to_address}`} 
                    target="_blank" 
                    className="font-medium">
                    {shortenAddress(transaction.to_address)}
                  </a>
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
      })}
    </>
  )
}

export default TransactionsGroup

