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
        <script async defer data-domain="zilstream.com" src="https://plausible.zilstream.com/js/plausible.js"></script>
      </Head>
      <div className="flex flex-col h-full">
        <Header />
        <div className="container">
          <div className="px-3 md:px-4 my-4 flex-grow">{children}</div>
        </div>
        <Footer />
      </div>
    </>
  )
}