import React from 'react';
import ReactDOM from 'react-dom';
import { Web3ReactProvider } from '@web3-react/core';
import BigNumber from 'bignumber.js';

import './index.css';
import './i18n/i18n';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { persistor, store } from './redux/configStore';
import { PersistGate } from 'redux-persist/es/integration/react';
import { Provider } from 'react-redux';
// import rootSaga from './redux/rootSaga';
import { getToken } from './services/api';
import getLibrary from 'utils/getLibrary';

import 'antd/dist/antd.css';
import './App.css';
import './sass/_app.scss';

const onBeforeLift = (store) => () => {
  const { address } = store.getState();
  const data = {
    data: {
      address: address.address,
      startTime: address?.listAddress?.[address?.address]?.startTime,
      expiredTime: address?.listAddress?.[address?.address]?.expiredTime,
    },
    signature: address?.listAddress?.[address?.address]?.signature,
  };
  getToken(JSON.stringify(data));
};

BigNumber.config({
  EXPONENTIAL_AT: 100,
});

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <Provider store={store}>
      <PersistGate onBeforeLift={onBeforeLift(store)} loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </Web3ReactProvider>,
  document.getElementById('root')
);
// sagaMiddleware.run(rootSaga);
serviceWorker.unregister();
