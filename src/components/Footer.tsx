import { useTheme } from 'next-themes'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { GitHub, Twitter, Send } from 'react-feather'

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const {resolvedTheme} = useTheme()

  useEffect(() => setMounted(true), [])

  if(!mounted) return null

  return (
    <div className="border-t dark:border-gray-800 mt-12 py-10">
      <div className="container">
        <div className="flex items-start px-4">
          <div className="flex-grow">
            <div>
              {resolvedTheme === 'dark' ? (
                <img className="hidden lg:block h-8 w-auto" src="/logo-text-dark.svg" />
              ) : (
                <img className="hidden lg:block h-8 w-auto" src="/logo-text.svg" />
              )}
            </div>
            <div className="text-gray-400 dark:text-gray-500 font-medium mt-4 text-sm">© 2021 ZilStream. All rights reserved</div>
          </div>
          <div className="text-gray-400 dark:text-gray-500 mr-10">
            <Link href="/membership"><a className="hover:underline mr-6 mb-4">Membership</a></Link>
            <Link href="/disclaimer"><a className="hover:underline mr-6 mb-4">Disclaimer</a></Link>
            <Link href="/terms"><a className="hover:underline mr-6 mb-4">Terms</a></Link>
            <Link href="/api_terms"><a className="hover:underline mr-6 mb-4">API Terms</a></Link>
            <Link href="https://github.com/zilstream/tokens"><a className="hover:underline mb-4">Request listing</a></Link>
          </div>
          <div className="flex items-center gap-5 justify-end text-gray-500 dark:text-gray-400">
            <a href="https://t.me/zilstream">
              <Send size={20} />
            </a>
            <a href="https://twitter.com/zilstream">
              <Twitter size={20} />
            </a>
            <a href="https://github.com/ZilStream">
              <GitHub size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}