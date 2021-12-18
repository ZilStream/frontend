import React from 'react'

interface Props {
  link?: string
}

const SponsorBlock = (props: Props) => {
  const { link } = props
  
  return (
    <a href={`${link ?? ''}?ref=zilstream`} target="_blank">
      <div className={`h-48 rounded-lg py-2 px-3 shadow bg-white dark:bg-gray-800 text-black dark:text-white relative flex flex-col bg-center bg-cover bg-[url('https://zilstream.sgp1.cdn.digitaloceanspaces.com/sponsorships/zilchill-zilo.png')]`}>
        <div className="mb-2">
          <div className="flex items-center text-lg -mb-1">
            <div className="flex-grow flex items-center">
              <span className="font-semibold mr-2"><span className="font-bold">$PLAY</span> ZILO</span>
              <span className="mr-2"></span>
            </div>
            <div>
              Now live
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-end h-full gap-4 text-sm mt-1">
          <div className="text-xs  text-gray-500 dark:text-gray-400">Sponsored</div>
        </div>
      </div>
    </a>
  )
}

export default SponsorBlock