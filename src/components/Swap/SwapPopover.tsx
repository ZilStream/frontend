import { Popover, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import Swap from './Swap'

interface Props {
  className?: string
}

const SwapPopover = (props: Props) => {
  return (
    <Popover className={props.className ?? ''}>
      {({ open }) => (
        <>
          <Popover.Button className="fixed bottom-10 right-5 sm:right-10 bg-primary rounded-full font-semibold py-3 px-5 flex items-center focus:outline-none">
            <svg width="22" height="22" className="fill-current stroke-current mr-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 3L20 7L16 11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 7H20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 21L3 17L7 13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 17H3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm">Swap</span>
          </Popover.Button>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Popover.Panel className="origin-bottom-right fixed mt-1 bottom-24 right-0 sm:right-10 z-50 bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-900 rounded-lg p-4 w-96 max-w-full">
              <Swap showFullscreen />
            </Popover.Panel>
          </Transition>
          </>
      )}
    </Popover>
  )
}

export default SwapPopover