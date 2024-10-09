import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {Provider} from "react-redux"
import store from "./store/store.js" //store object holds the application's global state and provides methods for dispatching actions and accessing the current state.

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
