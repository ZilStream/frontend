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
      <div>{children}</div>
      <div>footer</div>
    </>
  )
}