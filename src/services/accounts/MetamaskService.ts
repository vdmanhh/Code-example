import BaseWalletService from 'services/accounts/BaseWalletService';

import { WALLET_TYPES } from 'common/chainConstant';

let instance: any;

export default class MetamaskService extends BaseWalletService {
  constructor(props?: any) {
    super(props);
  }
  getInstance = () => {
    if (instance == null) {
      instance = new MetamaskService();
      instance.constructor = null;
    }
    return instance;
  };

  removeInstance = () => {
    instance = null;
  };

  getWalletType = () => {
    return WALLET_TYPES.METAMASK;
  };
}
