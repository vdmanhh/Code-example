import React, { useState, useEffect } from 'react';
import { Image, message } from 'antd';
import { useWeb3React } from '@web3-react/core';
import { useTranslation } from 'react-i18next';

import MetamaskIcon from 'resources/images/metamask-logo.png';
import IconArrowRight from 'resources/svg/IconArrowRight';
import Logo from 'resources/images/logo.png';
import LoadingIcon from 'resources/svg/IconLoading';
import ThemeBackground from 'resources/images/theme-background.png';

import ButtonComponent from 'components/Button';
import ModalComponent from 'components/Modal';
import { injected } from 'connectors';
import { getAddedTime, getCurrentTime } from 'utils/time';
import MetamaskService from 'services/accounts/MetamaskService';
import { ALL_SUPPORTED_CHAIN_IDS } from 'common/chainConstant';
import { useAppDispatch, useAppSelector } from 'hooks/store';
import selectedAddress from 'redux/address/selector';
import { handleAddAddressNetWork, handleSetAddressNetwork } from 'redux/address/slice';
import { setupNetwork } from 'utils/wallet';
import ModalProcessMetaMask from './components/ModalProcessMetaMask';
import ModalMetaMaskNotFound from './components/ModalMetaMaskNotFound';
import { handleVisibleModalConnectWallet, handleVisibleModalWrongNetwork, loginAction } from 'redux/auth/slice';

declare let window: any;

function LoginPage() {
  const dispatch = useAppDispatch();
  const { address, listAddress } = useAppSelector((state) => state.address) as any;

  const { t } = useTranslation();

  const [visibleMetamaskNotFoundModal, setVisibleMetamaskNotFoundModal] = useState(false);

  const { active, account, activate, chainId, error, library, connector } = useWeb3React();

  const toggleModalMetamaskNotFound = () => setVisibleMetamaskNotFoundModal((prev) => !prev);

  const handleActivateMetaMask = () => {
    dispatch(handleVisibleModalConnectWallet(true));
    activate(injected, () => dispatch(handleVisibleModalConnectWallet(false)));
  };

  const handleWrongNetwork = async () => {
    dispatch(handleVisibleModalWrongNetwork(true));
    await setupNetwork(chainId as any);
    dispatch(handleVisibleModalWrongNetwork(false));
  };

  const handleLogin = () => {
 
    const data = {
      data: {
        address: address,
        startTime: listAddress?.[address]?.startTime,
        expiredTime: listAddress?.[address]?.expiredTime,
      },
      signature: listAddress?.[address]?.signature,
    };
    dispatch(loginAction({ data }));
  };

  const handleConnectWallet = async () => {
    if (window?.ethereum) {
      if (!active) {
        handleActivateMetaMask();
      } else {
        if (!ALL_SUPPORTED_CHAIN_IDS.includes(chainId as any)) {
          await handleWrongNetwork();
        } else handleLogin();
      }
    } else toggleModalMetamaskNotFound();
  };

  useEffect(() => {
    if (error) {
      connector?.deactivate();
    }
  }, [error, connector]);

  useEffect(() => {
    if (chainId && !ALL_SUPPORTED_CHAIN_IDS.includes(chainId)) {
      setVisibleMetamaskNotFoundModal(false);
    }
  }, [chainId]);

  return (
    <div className="login-page container">
      <div className="theme-background">
        <img className="theme-background__image" src={ThemeBackground} />
      </div>
      <div className="body">
        <div className="body__content-box">
          <img className="body__content-box--image" src={Logo} />
          <h1 className="body__content-box--title">{t('login.txt_select_wallet_connection')}</h1>
          <div className="body__content-box--description">{t('login.txt_select_wallet_connection_desc')}</div>
          <ButtonComponent
            onClick={handleConnectWallet}
            customClassName="body__content-box--btn"
            variant="light"
            text={'MetaMask'}
            prefixIcon={<Image preview={false} width={40} src={MetamaskIcon} />}
            afterIcon={<IconArrowRight />}
          />
        </div>
      </div>
      {/* <ModalProcessMetaMask visible={visibleModalConnectWallet} toggleModal={toggleModalConnectWallet} /> */}
      <ModalMetaMaskNotFound visible={visibleMetamaskNotFoundModal} toggleModal={toggleModalMetamaskNotFound} />
    </div>
  );
}
export default LoginPage;
