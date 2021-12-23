import { NETWORK_URLS } from 'connectors';
import { ALL_SUPPORTED_CHAIN_IDS, SupportedChainId } from 'common/chainConstant';

declare let window: any;

export const setupNetwork = async (currentChainId: number) => {
  const provider = window.ethereum;
  if (provider) {
    const chainId = parseInt(SupportedChainId.BSC.toString(), 10);
    if (!ALL_SUPPORTED_CHAIN_IDS.includes(currentChainId)) {
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${chainId.toString(16)}`,
              chainName: 'Binance Smart Chain',
              nativeCurrency: {
                name: 'BNB',
                symbol: 'bnb',
                decimals: 18,
              },
              rpcUrls: [NETWORK_URLS[SupportedChainId.BSC]],
              // blockExplorerUrls: [`${NETWORK_URLS[SupportedChainId.BSC]}`],
            },
          ],
        });
        return true;
      } catch (error) {
        console.error('Failed to setup the network in Metamask:', error);
        return false;
      }
    } else return true;
  } else {
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined");
    return false;
  }
};
