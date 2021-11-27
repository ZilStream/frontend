import createSagaMiddleware from "@redux-saga/core";
import blockchain from "./sagas/blockchain";

const sagaMiddleware = createSagaMiddleware()

export function startSagas() {
  sagaMiddleware.run(blockchain)
}

export default sagaMiddleware;