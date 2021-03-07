import React from 'react'
import Header from './Header'
import Head from 'next/head'
import Footer from './Footer'

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
      <div className="flex flex-col h-full">
        <Header />
        <div className="px-4 my-4 flex-grow">{children}</div>
        <Footer />
      </div>
    </>
  )
}