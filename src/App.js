import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { Router, Route, Switch } from 'react-router-dom';

import { browserHistory } from './utils/history';
import Layout from './pages/layout/index';
import { routes, privateRoutes } from './Routes';
import { useAppSelector } from 'hooks/store';
import { getToken } from 'services/api';
import { useSocket } from 'hooks';

function App() {
  const { address, listAddress } = useAppSelector((state) => state.address);
  useEffect(() => {
    const data = {
      data: {
        address: address,
        startTime: listAddress?.[address]?.startTime,
        expiredTime: listAddress?.[address]?.expiredTime,
      },
      signature: listAddress?.[address]?.signature,
    };
    getToken(JSON.stringify(data));
  }, [address]);

  return (
    <div className="App bg-app">
      <Router history={browserHistory}>
        <Switch>
          <Route path={[...routes, ...privateRoutes].map((item) => item.path)} component={Layout} />
        </Switch>
      </Router>
    </div>
  );
}

export default withTranslation()(App);
