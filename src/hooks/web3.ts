import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store';

import { injected, walletConnect } from '../connectors';
import { handleSetAddressNetwork } from 'redux/address/slice';
import { handleSetIsAdminAction } from 'redux/auth/slice';
import selectedAddress from 'redux/address/selector';

declare let window: any;

export const useInactiveListener = () => {
  const dispatch = useAppDispatch();

  const { active, error, activate, chainId, deactivate } = useWeb3React();
  const { address } = useAppSelector(selectedAddress.getAddress);

  // handle metamask
  useEffect(() => {
    const { ethereum } = window;
    if (ethereum && ethereum.on && !error && address) {
      const handleConnect = () => {
        if (address) activate(injected);
      };

      const handleChainChanged = async () => {
        activate(injected, undefined, true).catch((error) => {
          console.error('Failed to activate after chain changed', error);
        });
      };

      const handleAccountsChanged = (accounts: string[]) => {
        // if (accounts.length > 0) {
        //   deactivate();
        //   // activate(injected, undefined, true).catch((error) => {
        //   //   console.error('Failed to activate after accounts changed', error);
        //   // });
        // } else {
        dispatch(handleSetAddressNetwork({}));
        dispatch(handleSetIsAdminAction({ isAdmin: false }));
        if (active) {
          deactivate();
        }
        // }
      };

      const handleNetworkChanged = async () => {
        activate(injected);
        // dispatch(handleSetAddressNetwork({}));
        // dispatch(handleSetIsAdminAction({ isAdmin: false }));
        // if (active) {
        //   deactivate();
        // }
      };

      ethereum.on('connect', handleConnect);
      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('networkChanged', handleNetworkChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleConnect);
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          ethereum.removeListener('networkChanged', handleNetworkChanged);
        }
      };
    }
    return undefined;
  }, [active, error, activate, chainId]);
};
