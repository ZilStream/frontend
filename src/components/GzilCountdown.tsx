import { MessageType, StatusType, Zilliqa } from '@zilliqa-js/zilliqa'
import React, { useEffect, useMemo, useState } from 'react'
import { useInterval } from 'utils/interval'

interface Countdown {
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
}

function GzilCountdown() {
  const [currentBlock, setCurrentBlock] = useState<number>()
  const [countdown, setCountdown] = useState<Countdown>()
  const [secondsLeft, setSecondsLeft] = useState<number>()
  const secondsPerBlock = 34
  const endBlock = 1483713
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const zilliqa = new Zilliqa('https://ssn.ignitedao.io/api')

  const connectSocket = async () => {
    const subscriber = zilliqa.subscriptionBuilder.buildNewBlockSubscriptions('wss://api-ws.zilliqa.com')

    subscriber.emitter.on(StatusType.SUBSCRIBE_NEW_BLOCK, (event) => {
    });

    subscriber.emitter.on(MessageType.NEW_BLOCK, (event) => {
      setCurrentBlock(+event.value.TxBlock.header.BlockNum)
    });

    subscriber.emitter.on(MessageType.UNSUBSCRIBE, (event) => {
    });

    await subscriber.start();
  }

  useEffect(() => {
    const getInfo = async () => {
      
      const info = await zilliqa.blockchain.getBlockChainInfo()
      if(info.result) {
        setCurrentBlock(+info.result.NumTxBlocks-1)
      }
    }
    
    getInfo()
    connectSocket()
  }, [])

  useEffect(() => {
    if(!currentBlock) return

    const blocksLeft = endBlock - currentBlock
    setSecondsLeft(blocksLeft * secondsPerBlock)
    setIsLoading(false)
  }, [currentBlock])

  useInterval(() => {
    if(!secondsLeft) return
    setSecondsLeft(secondsLeft - 1)
  }, 1000)

  useEffect(() => {
    if(!secondsLeft) return
    setCountdown({
      days: Math.floor(secondsLeft / (24 * 3600)),
      hours: Math.floor(secondsLeft % (3600 * 24) / 3600),
      minutes: Math.floor(secondsLeft % 3600 / 60),
      seconds: Math.floor(secondsLeft % 60)
    })
  }, [secondsLeft])

  if(isLoading || !currentBlock || !countdown) {
    return (
      <div className="bg-white dark:bg-gray-800 py-4 px-5 rounded-lg">
        <span className="text-gray-500 dark:text-gray-400 italic">Loading..</span>
      </div>
    )
  }

  var countdownNode = (<div></div>)
  
  if(countdown.days > 0) {
    countdownNode = (
      <div className={`grid grid-cols-4 gap-2 sm:gap-4 md:gap-6`}>
        <div className="flex flex-col items-center">
          <span className="font-semibold">{countdown?.days}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">days</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-semibold">{countdown?.hours}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">hours</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-semibold">{countdown?.minutes}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">mins</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-semibold">{countdown?.seconds}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">secs</span>
        </div>
      </div>
    )
  } else if(countdown.hours > 0) {
    countdownNode = (
      <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
        <div className="flex flex-col items-center">
          <span className="font-semibold">{countdown?.hours}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">hours</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-semibold">{countdown?.minutes}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">mins</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-semibold">{countdown?.seconds}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">secs</span>
        </div>
      </div>
    )
  } else if(countdown.minutes > 0) {
    countdownNode = (
      <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-6 text-2xl">
        <div className="flex flex-col items-center">
          <span className="font-semibold">{countdown?.minutes}</span>
          <span className="text-base text- text-gray-500 dark:text-gray-400">mins</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-semibold">{countdown?.seconds}</span>
          <span className="text-base text-gray-500 dark:text-gray-400">secs</span>
        </div>
      </div>
    )
  } else if(countdown.seconds > 0) {
    countdownNode = (
      <div className="grid grid-cols-1 gap-2 sm:gap-4 md:gap-6 text-3xl">
        <div className="flex flex-col items-center">
          <span className="font-semibold">{countdown?.seconds}</span>
          <span className="text-base text-gray-500 dark:text-gray-400">secs</span>
        </div>
      </div>
    )
  }
  
  return (
    <>
      <div className="bg-white dark:bg-gray-800 py-3 sm:py-4 px-2 sm:px-5 rounded-lg">
       {currentBlock >= endBlock ? (
          <div className="font-bold">gZIL minting has finished</div>
        ) : (
          <>{countdownNode}</>
        )}
      </div>
      
      <div className="flex items-center text-xs mt-1 text-gray-400 dark:text-gray-600">
        <div className="flex-grow">Current block: {currentBlock}</div>
        <div>End: {endBlock}</div>
      </div>
    </>
  )
}

export default GzilCountdown