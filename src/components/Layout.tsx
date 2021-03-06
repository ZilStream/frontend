import React from 'react'
import Header from './Header'

interface Props {
  children: React.ReactNode
}

export default function Layout(props: Props) {
  const { children } = props

  return (
    <>
      <Header />
      <div className="px-4">{children}</div>
    </>
  )
}