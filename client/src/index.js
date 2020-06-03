import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
// redux에서 제공
import { Provider } from 'react-redux';
// antd
import 'antd/dist/antd.css';
// redux
import { applyMiddleware, createStore } from 'redux';
import pormiseMiddleware from 'redux-promise';
import reduxThunk from 'redux-thunk';
import Reducer from './_reducers';

const createStoreWithMiddleware = applyMiddleware(pormiseMiddleware, reduxThunk)(createStore);

ReactDOM.render(
  
    <Provider
      store = {createStoreWithMiddleware(Reducer, 
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()  
      )}
    >
      <App />
    </Provider>
    ,document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
