import { EventChannel, eventChannel } from "@redux-saga/core"
import { Zilliqa } from "@zilliqa-js/zilliqa";
import { MessageType, StatusType } from "@zilliqa-js/subscriptions";
import { fork, put, take, call } from "redux-saga/effects";
import { Node } from "utils/node";
import actions from "store/actions";

const blocks = (): EventChannel<number> => {
  return eventChannel<number>(emitter => {
    const zilliqa = new Zilliqa(Node.ZilStream)
    const subscriber = zilliqa.subscriptionBuilder.buildNewBlockSubscriptions('wss://api-ws.zilliqa.com')
    
    subscriber.subscribe({ query: MessageType.NEW_BLOCK })

    subscriber.emitter.on(StatusType.SUBSCRIBE_NEW_BLOCK, (event) => {
      // console.log('[Socket] Subscribed to new blocks')
    })

    subscriber.emitter.on(MessageType.NEW_BLOCK, (event) => {
      emitter(+event.value.TxBlock.header.BlockNum)
    })

    subscriber.emitter.on(MessageType.UNSUBSCRIBE, (event) => {
      //if unsubscribe success, it will echo the unsubscription info
      // console.log('[Socket]: Unsubscribed from new events, reconnecting');
      subscriber.reconnect()
    });

    subscriber.onConnect
    subscriber.start()

    return () => {
      subscriber.stop()
    }
  })
}

function* watchBlockHeight() {
  const chan: EventChannel<number> = yield call(blocks)

  try {
    while(true) {
      let blockHeight: number = yield take(chan)
      yield put(actions.Blockchain.updateBlockchain({blockHeight: blockHeight}))
    }
  } finally {
    console.log("Channel terminated")
  }
}

export default function* blockchain() {
  yield fork(watchBlockHeight)
}