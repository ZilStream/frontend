import Tippy from '@tippyjs/react'
import React from 'react'
import { Info } from 'react-feather'

interface Props {
  link?: string
}

const SponsorBlock = (props: Props) => {
  const { link } = props
  
  return (
    <a href={`${link ?? ''}?ref=zilstream`} target="_blank">
      <div className={`h-48 rounded-xl py-2 px-3 shadow bg-white dark:bg-gray-800 text-white dark:text-white relative flex flex-col bg-center bg-cover bg-[url('https://zilstream.b-cdn.net/sponsorships/ludo-tournament.jpg')]`}>
        <div className="mb-2">
          <div className="flex items-center text-lg -mb-1">
            <div className="flex-grow flex items-center">
              <span className="font-semibold mr-2"></span>
              <span className="mr-2"></span>
            </div>
            <div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end justify-start h-full gap-4 text-sm -mt-1">
          <div className="flex items-center text-xs text-gray-400 dark:text-gray-400">
            {/* Provided by ZilStream */}
            <Tippy content={<div className="bg-white dark:bg-gray-700 border dark:border-gray-800 px-4 py-3 rounded-lg shadow-md text-sm">
              ZilStream sponsorships directly support the ongoing development and maintenance costs of the site.
            </div>}>
              <button className="ml-2 focus:outline-none flex items-centered gap-1 text-gray-100 opacity-75">
                <Info size={14} className="text-gray-100" /> Sponsored
              </button>
            </Tippy>
          </div>
        </div>
      </div>
    </a>
  )
}

export default SponsorBlock