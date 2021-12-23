import { randomRPCTesnet } from 'utils';

export enum SupportedChainId {
  BSC = 97,
}

export const BRIDGE_URL = 'https://pancakeswap.bridge.walletconnect.org';

export const LIST_BSC_TESTNET = ['https://data-seed-prebsc-1-s1.binance.org:8545/'];

export const LIST_NETWORK_RPC_TESTNET = {
  [SupportedChainId.BSC]: randomRPCTesnet(LIST_BSC_TESTNET),
};

export const METAMASK_DEEPLINK = 'https://metamask.io/download';

export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = [SupportedChainId.BSC];

export const INIT_UNIT_256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

export const WALLET_TYPES = {
  METAMASK: 'metamask',
  WALLET_CONNECT: 'wallet connect',
  WALLET_LINK: 'wallet link',
  DAPP: 'dapp',
};

export const METAMASK = 'metamask';

export const contractAddress = '0x6DCDeAb726B53D77b991761DFa7ec08cDf409EA9';
