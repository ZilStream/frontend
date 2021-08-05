import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import React from 'react'
import { TokenLaunch } from 'types/tokenLaunch.interface'
import useMoneyFormatter from 'utils/useMoneyFormatter'

function Calendar() {
  const moneyFormat = useMoneyFormatter({ maxFractionDigits: 5 })

  const launches: TokenLaunch[] = [
    {
      name: 'Zilliqa Royale',
      symbol: 'BLOX',
      icon: 'https://dr297zt0qngbx.cloudfront.net/calendar/blox.png',
      sale_type: 'ZILO',
      sale_date: new Date('2021-08-12T00:00:00'),
      goal: new BigNumber(550000),
      tags: ['Game'],
      website: 'https://zilliqaroyale.com/',
      telegram: 'https://t.me/zilliqaroyale'
    },
    {
      name: 'AO Sports',
      symbol: 'ATHLETE',
      icon: 'https://dr297zt0qngbx.cloudfront.net/calendar/aosports.png',
      sale_type: 'Public Sale',
      sale_date: new Date('2021-08-18T14:00:00'),
      goal: new BigNumber(2160000),
      tags: ['Media'],
      website: 'https://aosports.tv',
      twitter: 'https://twitter.com/AOSportsTV',
      telegram: 'https://t.me/AthleteToken'
    },
    {
      name: 'DeMons',
      symbol: 'DMZ',
      icon: 'https://dr297zt0qngbx.cloudfront.net/calendar/demons.png',
      tags: ['NFT'],
      website: 'https://demons.world/',
      twitter: 'https://twitter.com/de_monsters'
    },
    // {
    //   name: 'Blackhole',
    //   symbol: 'BLK',
    //   icon: 'https://dr297zt0qngbx.cloudfront.net/calendar/blackhole.png',
    //   tags: ['Privacy'],
    //   website: 'https://blackhole-docs.carbontoken.info/',
    // },
    {
      name: 'Pele',
      symbol: 'PELE',
      icon: 'https://dr297zt0qngbx.cloudfront.net/calendar/pele.png',
      tags: ['Media'],
      website: 'https://pele.network/',
    },
    {
      name: 'GodZilliqa DeFi',
      symbol: 'GDFI',
      icon: 'https://meta.viewblock.io/zilliqa.zil1gtx89hjfagnhuhhfmr947p2g865r4dq0fmaxkt/logo',
      tags: ['Community'],
      telegram: 'https://t.me/GodZilliqaDeFi'
    },
    {
      name: 'Coral',
      symbol: 'CRL',
      icon: 'https://dr297zt0qngbx.cloudfront.net/calendar/coral.png',
      tags: ['Community'],
      website: 'https://www.mycoralapp.tech',
      telegram: 'https://t.me/coraltribe'
    },
    {
      name: 'Okimoto',
      symbol: '?',
      icon: 'https://dr297zt0qngbx.cloudfront.net/calendar/okimoto.png',
      tags: ['NFT'],
      website: 'https://okimoto.io/'
    },
  ]

  return (
    <>
      <div className="pt-8 pb-2 md:pb-8">
        <div className="flex flex-col lg:flex-row items-start">
          <div className="flex-grow">
            <h2 className="mb-1">Token launch calendar</h2>
            <div className="text-gray-500 dark:text-gray-400 text-lg">The non-exhaustive list of tokens launching on Zilliqa</div>
          </div>
        </div>
      </div>

      <div className="scrollable-table-container max-w-full overflow-x-scroll">
        <table className="zilstream-table table-fixed border-collapse w-full">
          <colgroup>
            <col style={{width: '260px', minWidth: 'auto'}} />
            <col style={{width: '100px', minWidth: 'auto'}} />
            <col style={{width: '100px', minWidth: 'auto'}} />
            <col style={{width: '100px', minWidth: 'auto'}} />
            <col style={{width: '160px', minWidth: 'auto'}} />
          </colgroup>
          <thead className="text-gray-500 dark:text-gray-400 text-xs">
            <tr className="py-2">
              <th className="pl-4 pr-2 py-2 text-left">Token</th>
              <th className="px-2 py-2 text-right">Type</th>
              <th className="px-2 py-2 text-right">Sale</th>
              <th className="px-2 py-2 text-right">Goal</th>
              <th className="pl-2 pr-4 py-2 text-right">Links</th>
            </tr>
          </thead>
          <tbody>
            {launches.map((launch, index) => {
              console.log(launch.sale_date)
              return (
                <tr key={launch.symbol} role="row" className="text-sm border-b dark:border-gray-700 last:border-b-0">
                  <td className={`pl-4 pr-2 py-3 ${index === 0 ? 'rounded-tl-lg' : ''} ${index === launches.length-1 ? 'rounded-bl-lg' : ''}`}>
                    <div className="flex items-center">
                      <div className="w-10 h-10 p-1 flex-grow-0 flex-shrink-0 overflow-hidden mr-3 rounded-lg flex items-center justify-center">
                        {launch.icon ? (
                          <img src={launch.icon} className="rounded-lg" />
                        ) : (
                          <div className="w-9 h-9 flex-grow-0 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        )}
                        
                      </div>
                      <div className="flex-grow">
                        <div className="flex gap-2">
                          <div className="font-semibold text-base">{launch.name}</div>
                          <div className="font-normal text-base text-gray-500 dark:text-gray-400">{launch.symbol}</div>
                        </div>
                        {launch.description &&
                          <div className="text-sm">{launch.description}</div>
                        }
                        {launch.tags.length > 0 &&
                          <div className="flex gap-2 text-xs font-medium mt-1">
                            {launch.tags.map(tag => (
                              <span key={tag} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full" style={{padding: '1px 7px'}}>{tag}</span>
                            ))}
                          </div>
                        }
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-right">
                    {launch.sale_type ? (
                      <span>{launch.sale_type}</span>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">--</span>
                    )}
                  </td>
                  <td className="px-2 py-3 text-right">
                    {launch.sale_date ? (
                      <span>{dayjs(launch.sale_date).format('MMM D, YYYY')}</span>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">--</span>
                    )}
                  </td>
                  <td className="px-2 py-3 text-right">
                    {launch.goal ? (
                      <span>${moneyFormat(launch.goal, { decPlaces: 0})}</span>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">--</span>
                    )}
                  </td>
                  <td className={`pl-2 pr-4 py-3 text-right ${index === 0 ? 'rounded-tr-lg' : ''} ${index === launches.length-1 ? 'rounded-br-lg' : ''}`}>
                    <div className="flex justify-end gap-2">
                      {launch.website &&
                        <a href={launch.website} className="bg-gray-200 dark:bg-gray-900 font-normal py-1 px-2 rounded">Website</a>
                      }
                      
                      {launch.twitter &&
                        <a href={launch.twitter} className="bg-gray-200 dark:bg-gray-900 font-normal py-1 px-2 rounded">Twitter</a>
                      }

                      {launch.telegram &&
                        <a href={launch.telegram} className="bg-gray-200 dark:bg-gray-900 font-normal py-1 px-2 rounded">Telegram</a>
                      }
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Calendar