import React, { useEffect, useState } from 'react'
import getGovernanceSpaces from 'lib/zilliqa/getGovernanceSpaces'
import { Space } from 'types/space.interface'
import TokenIcon from 'components/TokenIcon'
import Link from 'next/link'
import LoadingSpaces from 'components/LoadingSpaces'
import Head from 'next/head'

function Vote() {
  const [spaces, setSpaces] = useState<Space[]>([])

  async function getSpaces() {
    const spacesRes = await getGovernanceSpaces()
    const newSpaces = Object.values(spacesRes)
    Object.keys(spacesRes).forEach((key, index) => {
      newSpaces[index].slug = key
    })
    setSpaces(newSpaces)
  }

  useEffect(() => {
    getSpaces()
  }, [])

  if(spaces.length === 0) {
    return <LoadingSpaces />
  }

  return (
    <>
      <Head>
        <title>Vote | ZilStream</title>
        <meta property="og:title" content={`Vote | ZilStream`} />
        <meta name="description" content={`Vote on governance proposals`} />
        <meta property="og:description" content={`Vote on governance proposals`} />
      </Head>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mt-8">
        {spaces.map(space => {
          return (
            <Link key={space.token} href={`/vote/${space.slug.toLowerCase()}`}>
              <a className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg flex flex-col px-4 py-10 items-center">
                <div className="w-16 h-16"><TokenIcon address={space.token} /></div>
                <div className="mt-4 font-semibold">{space.name}</div>
              </a>
            </Link>
          )
        })}
      </div>
    </>
  )
}

export default Vote