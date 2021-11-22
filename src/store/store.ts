import { createStore, Store, applyMiddleware } from 'redux'
import { createWrapper, Context } from 'next-redux-wrapper'
import reducer from './reducer'
import { RootState } from './types'
import createSagaMiddleware, { Task } from 'redux-saga'
import rootSaga from 'saga/saga'

export interface SagaStore extends Store {
  sagaTask?: Task;
}

export const makeStore = (context: Context) => {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(reducer, applyMiddleware(sagaMiddleware));

  (store as SagaStore).sagaTask = sagaMiddleware.run(rootSaga);

  return store
}

export const wrapper = createWrapper<Store<RootState>>(makeStore, {debug: false})