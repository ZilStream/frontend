import Link from 'next/link'
import React from 'react'
import { GitHub, Twitter, Send } from 'react-feather'

export default function Footer() {
  return (
    <div className="px-4 py-12 text-gray-500 dark:text-gray-400 text-sm text-center">
      <div className="font-medium mb-2">ZilStream</div>
      <div className="flex items-center justify-center text-gray-400">
        <a href="https://t.me/zilstream" className="mr-3">
          <Send size={18} />
        </a>
        <a href="https://twitter.com/zilstream" className="mr-3">
          <Twitter size={18} />
        </a>
        <a href="https://github.com/ZilStream">
          <GitHub size={18} />
        </a>
      </div>
      <div className="mt-6 text-gray-400 dark:text-gray-500">
        <div className="mb-4">
          <Link href="/terms"><a className="hover:underline mr-6 mb-4">Terms</a></Link>
          <Link href="/api_terms"><a className="hover:underline mr-6 mb-4">API Terms</a></Link>
          <Link href="/disclaimer"><a className="hover:underline mr-6 mb-4">Disclaimer</a></Link>
          <Link href="https://request.zilstream.com"><a className="hover:underline mb-4">Request listing</a></Link>
        </div>
      </div>
    </div>
  )
}