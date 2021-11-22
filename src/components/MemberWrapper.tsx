import React from 'react'
import useBalances from 'utils/useBalances'
import Link from 'next/link'

interface Props {
  children: React.ReactNode
}

const MemberWrapper = (props: Props) => {
  const { membership } = useBalances()
  return (
    <>
      {membership.isMember ? (
        <>{props.children}</>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg px-5 py-4">
          <div className="font-bold">Membership</div>
          <div>This feature requires STREAM membership. <Link href="/membership"><a className="underline">Find out more</a></Link>.</div>
        </div>
      )}
    </>
  )
}

export default MemberWrapper