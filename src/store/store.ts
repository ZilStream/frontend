import { createStore, AnyAction } from 'redux'
import { MakeStore, createWrapper, Context, HYDRATE } from 'next-redux-wrapper'
import reducer, { State } from './reducer'

const makeStore: MakeStore<State> = (context: Context) => createStore(reducer)

export const wrapper = createWrapper<State>(makeStore, {debug: true})