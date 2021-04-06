import { createStore } from 'redux'
import { MakeStore, createWrapper, Context } from 'next-redux-wrapper'
import reducer from './reducer'
import { RootState } from './types'

const makeStore: MakeStore<RootState> = (context: Context) => createStore(reducer)

export const wrapper = createWrapper<RootState>(makeStore, {debug: true})