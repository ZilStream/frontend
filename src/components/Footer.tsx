import React from 'react'
import { GitHub, Twitter } from 'react-feather'

export default function Footer() {
  return (
    <div className="px-4 py-12 text-gray-500 text-sm text-center">
      <div className="font-medium mb-2">ZilStream</div>
      <div className="flex items-center justify-center text-gray-400">
        <a href="https://github.com/ZilStream" className="mr-2">
          <GitHub size={18} />
        </a>
        <a href="https://twitter.com/zilstream">
          <Twitter size={18} />
        </a>
      </div>
    </div>
  )
}