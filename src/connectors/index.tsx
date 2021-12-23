import { UnsupportedChainIdError } from '@web3-react/core';
import { BscConnector } from '@binance-chain/bsc-connector';
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from '@web3-react/frame-connector';
import {
  WalletConnectConnector,
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
} from '@web3-react/walletconnect-connector';
import {
  InjectedConnector,
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import { AbstractConnector } from '@web3-react/abstract-connector';

import showMessage from 'components/Message';

import {
  BRIDGE_URL,
  LIST_BSC_TESTNET,
  LIST_NETWORK_RPC_TESTNET,
  METAMASK_DEEPLINK,
  SupportedChainId,
} from 'common/chainConstant';

import { TYPE_OF_ANT_DESIGN } from 'common/constant';

export const injected = new InjectedConnector({});

//@ts-ignore
export const walletConnect = new WalletConnectConnector({
  rpc: LIST_NETWORK_RPC_TESTNET,
  bridge: BRIDGE_URL,
  qrcode: true,
  // pollingInterval: POLLING_INTERVAL,
});

export function getErrorConnectMessage(
  error: Error,
  deactivate: any,
  metamaskNotFound?: any
) {
  deactivate();
  if (error instanceof NoEthereumProviderError) {
    return metamaskNotFound && metamaskNotFound();
  } else if (error instanceof UnsupportedChainIdError) {
    return showMessage(
      TYPE_OF_ANT_DESIGN.ERROR,
      "You're connected to an unsupported network."
    );
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect ||
    error instanceof UserRejectedRequestErrorFrame
  ) {
    return;
  } else {
    console.error(error);
    return showMessage(
      TYPE_OF_ANT_DESIGN.ERROR,
      'An unknown error occurred. Check the console for more details.'
    );
  }
}

export interface WalletInfo {
  connector?: AbstractConnector;
  name: string;
  description: string;
  href: string | null;
  primary?: true;
  mobile?: true;
  mobileOnly?: true;
  disableIcon: string;
  icon: string;
  deepLink?: string;
}

export enum ConnectorNames {
  MetaMask = 'MetaMask',
}

export type connectorNames = Extract<ConnectorNames, ConnectorNames.MetaMask>;

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  METAMASK: {
    connector: injected,
    name: ConnectorNames.MetaMask,
    icon: '/images/metamask.svg',
    disableIcon: '/images/metamask-disabled.svg',
    description: 'Easy-to-use browser extension.',
    href: null,
    mobile: true,
    deepLink: METAMASK_DEEPLINK,
  },
};

export const NETWORK_URLS = {
  [SupportedChainId.BSC]: LIST_BSC_TESTNET[0],
};
