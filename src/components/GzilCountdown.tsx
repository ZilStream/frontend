import { MessageType, StatusType, Zilliqa } from '@zilliqa-js/zilliqa'
import React, { createRef, useEffect, useMemo, useRef, useState } from 'react'
import Confetti from 'react-confetti'
import { X } from 'react-feather'
import { useInterval } from 'utils/interval'
import TokenIcon from './TokenIcon'

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
  const rewardsEndBlock = 1483600
  const endBlock = 1483713
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const zilliqa = new Zilliqa('https://ssn.ignitedao.io/api')
  const [isOpen, setIsOpen] = useState(false)
  const modalRef = useRef(null)

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

  const rewardsBlocksLeft = rewardsEndBlock-currentBlock
  const endBlocksLeft = endBlock-currentBlock
  
  return (
    <>
      <div onClick={() => setIsOpen(true)} className="bg-white dark:bg-gray-800 py-3 sm:py-4 px-2 sm:px-5 rounded-lg cursor-pointer shadow-sm hover:shadow-xl">
        {endBlocksLeft > 0 ? (
          <>{countdownNode}</>
        ) : (
          <div className="font-bold">gZIL minting has finished</div>
        )}
      </div>
      
      <div className="flex items-center text-xs mt-1 text-gray-400 dark:text-gray-600">
        <div className="font-bold">Click to expand the countdown</div>
      </div>

      {isOpen &&
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-stretch justify-center z-50 p-8 md:p-16 lg:p-24 bg-gray-900 bg-opacity-70">
          <div ref={modalRef} className="relative bg-white dark:bg-gray-800 flex-grow rounded-lg shadow-md flex flex-col items-center justify-center overflow-hidden">
            <div className="font-bold text-3xl lg:text-4xl mb-2">gZIL</div>
            <div className="w-24 lg:w-40 h-24 lg:h-40 flex items-center justify-center"><TokenIcon address="zil14pzuzq6v6pmmmrfjhczywguu0e97djepxt8g3e" /></div>
            {currentBlock >= endBlock ? (
              <div className="font-bold text-2xl">gZIL minting has finished</div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-10 text-2xl lg:text-4xl mt-4">
                  <div className="flex flex-col items-center">
                    <span className="font-bold">{countdown.hours}</span>
                    <span className="text-base lg:text-lg text-gray-500 dark:text-gray-400">hours</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold">{countdown.minutes}</span>
                    <span className="text-base lg:text-lg text-gray-500 dark:text-gray-400">mins</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold">{countdown.seconds}</span>
                    <span className="text-base lg:text-lg text-gray-500 dark:text-gray-400">secs</span>
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 p-4 mt-4 md:mt-12 lg:mt-16">
              <div className="text-xl lg:text-2xl text-center">
                <div>Rewards end</div>
                {rewardsBlocksLeft > 0 ? (
                  <>
                    <div className="font-bold">{rewardsBlocksLeft}</div>
                    <div className="text-base text-gray-500">blocks</div>
                  </>
                ) : (
                  <div className="font-bold py-3">Rewards have ended</div>
                )}
                
                <div className="mt-2 text-xs text-gray-500 max-w-xs">Staking rewards for gZIL have ended and the last 113 blocks can be used to claim the last rewards.</div>
              </div>

              <div className="text-xl lg:text-2xl text-center">
                <div>Minting ends</div>
                {endBlocksLeft > 0 ? (
                  <>
                    <div className="font-bold">{endBlocksLeft}</div>
                    <div className="text-base text-gray-500">blocks</div>
                  </>
                ) : (
                  <div className="font-bold py-3">Minting has ended</div>
                )}
                
                <div className="mt-2 text-xs text-gray-500 max-w-xs">At this stage minting stops and any gZIL rewards are not claimable anymore.</div>
              </div>
            </div>

            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4"><X /></button>

            {endBlocksLeft <= 0 &&
              <Confetti height={1500} />
            }
          </div>
        </div>
      }
      
    </>
  )
}

export default GzilCountdown