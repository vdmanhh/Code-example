import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import { Prompt } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Route, Switch, withRouter, useHistory, useLocation } from 'react-router-dom';
import { Layout, message } from 'antd';

import { routes, privateRoutes } from 'Routes';
import HeaderCommon from 'components/Header';

import { SiderLayout } from 'components/Sider/SiderLayout';
import ModalWrongNetwork from 'components/Modal/ModalWrongNetwork';

import { ALL_SUPPORTED_CHAIN_IDS } from 'common/chainConstant';
import { useInactiveListener } from 'hooks/web3';
import { useAppDispatch, useAppSelector } from 'hooks/store';
import { setupNetwork } from 'utils/wallet';
import MetamaskService from 'services/accounts/MetamaskService';
import { getAddedTime, getCurrentTime } from 'utils/time';
import { handleAddAddressNetWork, handleSetAddressNetwork } from 'redux/address/slice';
import selectedAddress from 'redux/address/selector';
import { useInit } from 'hooks';
import { injected } from 'connectors';
import {
  handleSetIsAdminAction,
  handleVisibleModalConnectWallet,
  handleVisibleModalWrongNetwork,
  loginAction,
} from 'redux/auth/slice';
import ModalProcessMetaMask from './components/ModalProcessMetaMask';
import _ from 'lodash';

const { Content } = Layout;

function LayoutCommon() {
  const { isAdmin, visibleModalConnectWallet, visibleModalWrongNetwork } = useAppSelector((state) => state.auth);
  // const isAdmin = true;

  const { t } = useTranslation();
  const { listAddress, address } = useAppSelector(selectedAddress.getAddress);
  const { chainId, account, library, active, activate, deactivate } = useWeb3React();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const location = useLocation();

  const toggleModalConnectWallet = () => dispatch(handleVisibleModalConnectWallet(!visibleModalConnectWallet));

  const goToPage = (e: any) => {
    history.push(e.key);
  };

  const selectedKey =
    location.pathname.includes('transaction') || location.pathname.includes('profit')
      ? location.pathname
      : `/${location.pathname?.split('/')[1]}`;

  useInactiveListener();
  useInit(isAdmin);

  useEffect(() => {
    const setUpAddress = async () => {
      if (account && chainId) {
        const hasSetup = await setupNetwork(chainId);
        if (ALL_SUPPORTED_CHAIN_IDS.includes(chainId)) {
          if (!listAddress?.[account]) {
            dispatch(handleVisibleModalConnectWallet(true));
            const wallet = new MetamaskService().getInstance();
            const startTime = getCurrentTime();
            const expiredTime = getAddedTime(30);
            const signature = await wallet.signToVerify({ creator: account, library, startTime, expiredTime });
            dispatch(handleVisibleModalConnectWallet(false));
            const data = {
              data: {
                startTime,
                expiredTime,
                address: account,
              },
              signature: signature,
            };
            if (signature) {
              dispatch(handleAddAddressNetWork({ address: account, startTime, expiredTime, signature }));
              dispatch(handleSetAddressNetwork({ currentNetworkId: chainId, address: account }));
              dispatch(
                loginAction({
                  data,
                })
              );
            } else {
              deactivate();
            }
          } else {
            setTimeout(() => {
              dispatch(handleVisibleModalConnectWallet(false));
            }, 1000);
            const data = {
              data: {
                address: account,
                startTime: listAddress?.[account]?.startTime,
                expiredTime: listAddress?.[account]?.expiredTime,
              },
              signature: listAddress?.[account]?.signature,
            };
            dispatch(handleSetAddressNetwork({ currentNetworkId: chainId, address: account }));
            dispatch(
              loginAction({
                data,
              })
            );
          }
        }
      }
    };
    setUpAddress();
  }, [active, account, chainId]);

  useEffect(() => {
    if (chainId && !ALL_SUPPORTED_CHAIN_IDS.includes(chainId)) {
      dispatch(handleVisibleModalWrongNetwork(true));
      dispatch(handleVisibleModalConnectWallet(false));
    } else {
      dispatch(handleVisibleModalWrongNetwork(false));
    }
  }, [chainId]);

  useEffect(() => {
    if (!active && address) {
      activate(injected);
    }
  }, [address, active, chainId]);

  return (
    <Layout className="layout">
      <Layout className="layout-content">
        {isAdmin && <SiderLayout selectedKey={selectedKey} goToPage={goToPage} />}
        <Layout className="layout-sider-content">
          {isAdmin && <HeaderCommon />}
          <Content>
            <Switch>
              {isAdmin
                ? privateRoutes.map((route, index) => (
                    <Route path={route.path} component={route.component} exact={route.exact} key={index} />
                  ))
                : routes.map((route, index) => (
                    <Route path={route.path} component={route.component} exact={route.exact} key={index} />
                  ))}
            </Switch>
          </Content>
        </Layout>
      </Layout>
      {!isAdmin && <div className="footer">© Copyright Planet Eaters. All Rights Reserved</div>}
      <ModalWrongNetwork visible={visibleModalWrongNetwork} />
      <ModalProcessMetaMask visible={visibleModalConnectWallet} toggleModal={toggleModalConnectWallet} />
    </Layout>
  );
}
export default memo(withRouter(LayoutCommon));
