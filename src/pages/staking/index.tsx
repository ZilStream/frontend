import { toBech32Address } from '@zilliqa-js/zilliqa'
import Head from 'next/head'
import React from 'react'
import { CheckCircle } from 'react-feather'
import { useSelector } from 'react-redux'
import { RootState, StakingState } from 'store/types'
import { cryptoFormat, numberFormat } from 'utils/format'

function Staking() {
  const stakingState = useSelector<RootState, StakingState>(state => state.staking)

  const zilOperators = stakingState.operators.filter(operator => operator.symbol === 'ZIL')
  const sortedOperators = zilOperators.sort((a, b) => {
    return a.stake_amount.isGreaterThan(b.stake_amount) ? -1 : 1
  })

  return (
    <>
      <Head>
        <title>Staking | ZilStream</title>
        <meta property="og:title" content={`Staking | ZilStream`} />
      </Head>

      <div className="pt-8 pb-2 md:pb-8">
        <div className="flex flex-col lg:flex-row items-start">
          <div className="flex-grow">
            <h1 className="mb-1">Staking nodes</h1>
          </div>
        </div>
      </div>
      <div className="scrollable-table-container max-w-full overflow-x-scroll">
        <table className="zilstream-table table-fixed border-collapse">
          <colgroup>
            <col style={{width: '22px', minWidth: 'auto', maxWidth: '22px'}} />
            <col style={{width: '300px', minWidth: 'auto'}} />
            <col style={{width: '100px', minWidth: 'auto'}} />
            <col style={{width: '100px', minWidth: 'auto'}} />
            <col style={{width: '120px', minWidth: 'auto'}} />
            <col style={{width: '160px', minWidth: 'auto'}} />
          </colgroup>
          <thead className="text-gray-500 dark:text-gray-400 text-xs">
            <tr>
              <th className="text-left pl-4 pr-1 sm:pr-2 py-2">#</th>
              <th className="pl-3 pr-2 py-2 text-left">SSN</th>
              <th className="px-2 py-2 text-right">Staked</th>
              <th className="px-2 py-2 text-right">Buffered</th>
              <th className="px-2 py-2 text-right">Commission</th>
              <th className="px-2 py-2 text-right">Supports ecosystem</th>
            </tr>
          </thead>
          <tbody>
            {sortedOperators.map((operator, index) => (
              <tr key={operator.name} role="row" className="text-sm border-b dark:border-gray-700 last:border-b-0">
                <td className={`text-left pl-4 pr-1 sm:pr-2 py-3 ${index === 0 ? 'rounded-tl-lg' : ''} ${index === sortedOperators.length-1 ? 'rounded-bl-lg' : ''}`}>{index+1}</td>
                <td className="pl-3 pr-2 py-3 text-left">{operator.name}</td>
                <td className="px-2 py-3 text-right">{cryptoFormat(operator.stake_amount.shiftedBy(-12).toNumber())}</td>
                <td className="px-2 py-3 text-right">{cryptoFormat(operator.buffered_deposit.shiftedBy(-12).toNumber())}</td>
                <td className="px-2 py-3 text-right">{numberFormat(operator.comission.shiftedBy(-7).toNumber())}%</td>
                <td className={`px-2 py-3 text-right ${index === 0 ? 'rounded-tr-lg' : ''} ${index === sortedOperators.length-1 ? 'rounded-br-lg' : ''}`}><CheckCircle color="green" size={16} className="inline-block" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Staking