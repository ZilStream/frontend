import React from 'react'
import Header from './Header'
import Head from 'next/head'

interface Props {
  children: React.ReactNode
}

export default function Layout(props: Props) {
  const { children } = props

  return (
    <>
      <Head>
        <title>ZilStream</title>
      </Head>
      <Header />
      <div className="px-4">{children}</div>
    </>
  )
}