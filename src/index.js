import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'

import App from './App'
import reducer from './reducers'
import registerServiceWorker from './registerServiceWorker'
import { loadState, saveState } from './localStorage'
import throttle from 'lodash/throttle'

import './index.css'

// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistedState = loadState();
const store = createStore(
  reducer,
  persistedState,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware
    )
  )
)

// Save the state to localStorage any time it changes, using throttle to make
// sure this doesn't happen too often, given the use of JSON.stringify()
store.subscribe(throttle(() => {
  saveState(store.getState());
}), 1000)

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()
