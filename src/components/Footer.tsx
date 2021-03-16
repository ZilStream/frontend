import React from 'react'
import { GitHub, Twitter } from 'react-feather'

export default function Footer() {
  return (
    <div className="px-4 py-12 text-gray-500 dark:text-gray-400 text-sm text-center">
      <div className="font-medium mb-2">ZilStream</div>
      <div className="flex items-center justify-center text-gray-400">
        <a href="https://github.com/ZilStream" className="mr-2">
          <GitHub size={18} />
        </a>
        <a href="https://twitter.com/zilstream">
          <Twitter size={18} />
        </a>
      </div>
      <div className="mt-6 text-xs text-gray-400 dark:text-gray-500">
        <div className="mb-1">Telegram: <a href="https://t.me/zilstream" target="_blank">t.me/zilstream</a></div>
        <div>Tip jar: <span className="font-medium">zil1me2dr2za36mdxy0uygfx3s5eh9xckd227efqdx</span></div>
      </div>
    </div>
  )
}