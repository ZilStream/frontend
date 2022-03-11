import { Popover, Transition } from '@headlessui/react'
import React, { Fragment, useEffect, useState } from 'react'
import { Bell, Check, Copy, ExternalLink, X } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { Currency, CurrencyState, NotificationState, RootState, TokenState } from 'store/types'
import useBalances from 'utils/useBalances'
import Link from 'next/link'
import { addNotification, removeNotification } from 'store/notification/actions'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { shorten, shortenAddress } from 'utils/shorten'
import LoadingSpinner from 'components/LoadingSpinner'

const NotificationsPopover = () => {
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const notificationState = useSelector<RootState, NotificationState>(state => state.notification)
  const dispatch = useDispatch()
  const [txHash, setTxHash] = useState('')
  const notifications = notificationState.notifications.sort((a,b) => a.timestamp > b.timestamp ? -1 : 1)
  const pendingNotifications = notifications.filter(notification => notification.status === "pending")

  dayjs.extend(relativeTime)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key !== 'Enter' || txHash === '') return

    dispatch(addNotification({
      notification: {
        timestamp: dayjs().unix(),
        hash: txHash,
        status: "pending",
      }
    }))
  }

  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button className="menu-item-active focus:outline-none flex items-center mr-2 relative">
            <Bell size={20} className="text-gray-800 dark:text-gray-200 p-[2px]" />

            {pendingNotifications.length > 0 &&
              <span className="font-bold ml-2">{pendingNotifications.length}</span>
            }
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
            <Popover.Panel className="origin-top-right absolute mt-1 right-0 z-50 bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-900 rounded-lg p-4 w-72">
              <div className="flex flex-col">
                <div className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Notifications</div>
                <div className="flex flex-col gap-2">
                  {notifications.map(notification => (
                    <div key={notification.hash} className="bg-gray-100 dark:bg-gray-900 rounded p-3 relative">
                      <div className="font-medium flex items-center gap-2 mb-1">
                        {shortenAddress(notification.hash, 5)}
                        <a onClick={() => navigator.clipboard.writeText(notification.hash)} className="text-gray-500 dark:text-gray-400"><Copy size={14} /></a>
                        <a href={`https://viewblock.io/zilliqa/tx/${notification.hash}`} target="_blank" className="text-gray-500 dark:text-gray-400"><ExternalLink size={14} /></a>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="flex-grow capitalize flex items-center">
                          {notification.status === "pending" &&
                            <LoadingSpinner className="text-inherit w-4 h-4 mr-1" />
                          }

                          {notification.status === "confirmed" &&
                            <span className="w-4 h-4 rounded-full inline-flex items-center justify-center bg-green-500 mr-1"><Check size={12} /></span>
                          }

                          {notification.status === "rejected" &&
                            <span className="w-4 h-4 rounded-full inline-flex items-center justify-center bg-red-500 mr-1"><X size={12} /></span>
                          }
                          
                          {notification.status}
                        </div>
                        <time className="text-gray-500 dark:text-gray-400">{dayjs.unix(notification.timestamp).fromNow()}</time>
                      </div>
                      <button onClick={() => dispatch(removeNotification({hash: notification.hash}))} className="absolute right-2 top-2 text-gray-500 dark:text-gray-400"><X size={14} /></button>
                    </div>
                  ))}
                </div>
                {notificationState.notifications.length === 0 &&
                  <div className="text-sm italic text-gray-500 dark:text-gray-400">You currently don't have any notifications.</div>
                }
              </div>

              {process.env.NODE_ENV === `development` &&
                <div className="mt-3 border-t dark:border-gray-700 pt-3">
                  <div className="text-sm font-semibold">[DEV] Add transaction</div>
                  <input 
                    value={txHash}
                    onChange={e => setTxHash(e.target.value)}
                    onKeyDown={handleKeyDown}
                    type="text" 
                    placeholder="tx hash" 
                    className="bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-700 rounded py-3 px-3 text-sm w-full" 
                  />
                </div>
              }

              <div className="mt-3 border-t dark:border-gray-700 pt-3">
                <Link href="/alerts">
                  <a className="block bg-gray-200 dark:bg-gray-700 text-center text-sm font-medium py-2 px-3 rounded">Manage alerts</a>
                </Link>
              </div>
            </Popover.Panel>
          </Transition>
          </>
      )}
    </Popover>
  )
}

export default NotificationsPopover