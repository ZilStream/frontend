import { createStore } from 'redux'
import { MakeStore, createWrapper, Context } from 'next-redux-wrapper'
import reducer from './reducer'
import { RootState } from './types'

const makeStore: MakeStore<RootState> = (context: Context) => {
  const store = createStore(reducer)

  if(module.hot) {
    module.hot.accept('./reducer', () => {
      console.log('Replacing reducer')
      store.replaceReducer(require('./reducer').default)
    })
  }

  return store
}

export const wrapper = createWrapper<RootState>(makeStore, {debug: true})