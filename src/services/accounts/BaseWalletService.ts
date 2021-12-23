import { formatUnits } from '@ethersproject/units';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { ethers, Contract } from 'ethers';
import { AddressZero } from '@ethersproject/constants';
import Web3 from 'web3';

import { contractAddress, INIT_UNIT_256 } from 'common/chainConstant';
import ExchangeABI from 'common/abi/exchange.json';

// import {
//   CANCEL_SELL_ORDER_TYPE,
//   CHAIN_INFO,
//   CHAIN_TYPE_ERC,
//   COLLECTION_ITEM_TYPE,
//   CONTRACT_RECEIPT_STATUS,
//   ERROR_METAMASK,
//   INIT_UNIT_256,
//   KEY_ACCEPT_OFFER,
//   STAKING_STATUS,
//   STEP_CANCEL_RESELL,
//   STEP_CANCEL_SELL_ORDER,
//   TYPE_OF_ANT_DESIGN,
// } from '@common//constant';
// import { OFFER_MODE } from 'common/constant';

// import TokenJSON from 'common/abi/token.json';
// import NftifyExchangeJSON from 'common/abi/nftifyExchange.json';
// import Nftify1155CollectionAbi from 'common/abi/nftify1155CollectionAbi.json';
// import Nftify1155CollectionByeCode from 'common/abi/nftify1155Bytecode.json';
// import Nftify721CollectionAbi from 'common/abi/nftify721CollectionAbi.json';
// import Nftify721CollectionByeCode from 'common/abi/nftify721Bytecode.json';
// import CollectionMetadataAbi from 'common/abi/collectionMetadataAbi.json';
// import { checkEnoughBalance, convertEToNumber, convertPrice, convertTokenIdToHex, getCurrentTime } from 'utils';
// import { getContract, getContractFactory } from 'utils/helpers';
// import { get } from 'lodash';
// import showMessage from '@components//Message';
// import tokenEthData from 'common/data/tokenEth.json';
// import tokenBsc1Data from 'common/data/tokenBsc1.json';
// import tokenBsc2Data from 'common/data/tokenBsc2.json';

export function isAddress(address: string) {
  return Web3.utils.isAddress(address);
}

export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any);
}
export default class BaseWalletService {
  address: string | null;
  needTobeInitiated: any;
  initUnit256: any;

  constructor(props: any) {
    this.address = props?.address;
    this.initUnit256 = INIT_UNIT_256;
  }

  /**
   *
   * @param data cancel sale order
   */
  cancelSaleOrder = async (
    library: any,
    data: any,
    nftifyExchangeAddress: string,
    tokenAddress: string,
    creator: string,
    callback: any,
    coinDecimal: number
  ) => {
    // const { metadata } = data;
    // const { nftify } = data;
    // const tokenID = convertTokenIdToHex(nftify.tokenId);
    // const saleOrderSupply = data.saleQuantity.toString();
    // const price = convertPrice(data.price.toString(), coinDecimal);
    // const saleOrderSalt = metadata.saleOrderSalt;
    // const enableMakeOffer = data.offerMode ? OFFER_MODE[1].toString() : OFFER_MODE[0].toString();
    // const contractAddress = nftifyExchangeAddress;
    // const signature = metadata.signSaleOrder;
    // const nftifyInst = getContract(nftifyExchangeAddress, NftifyExchangeJSON.output.abi, library, creator);
    // const dataContract = [tokenID, saleOrderSupply, price, saleOrderSalt];
    // const val = [enableMakeOffer, CANCEL_SELL_ORDER_TYPE.STORE];
    // const addr = [creator, tokenAddress, contractAddress];
    // const _id = data._id;
    // await nftifyInst
    //   .cancelSaleOrder(dataContract, val, addr, signature, _id)
    //   .then(async (res: any) => {
    //     callback(STEP_CANCEL_SELL_ORDER.CANCEL_PROCESSING, res.hash, data._id);
    //     const receipt = await library.waitForTransaction(res.hash);
    //     if (receipt.status) {
    //       callback(STEP_CANCEL_SELL_ORDER.SUCCESS);
    //     } else {
    //       callback(STEP_CANCEL_SELL_ORDER.FAIL);
    //     }
    //   })
    //   .catch((e: any) => {
    //     callback(STEP_CANCEL_SELL_ORDER.FAIL);
    //   });
  };

  signToVerify = async ({ library, creator, startTime, expiredTime }: any) => {
    let signVerify: any = null;
    let hasnVerify = null;

    try {
      hasnVerify = ethers.utils.solidityKeccak256(['address', 'uint256', 'uint256'], [creator, startTime, expiredTime]);

      const signHashBytes = ethers.utils.arrayify(hasnVerify);

      if (library?.provider?.wc) {
        const wcMessage = ethers.utils.hexlify(signHashBytes);
        signVerify = await library.provider.wc.signPersonalMessage([wcMessage, creator]);
      } else {
        const signer = await library.getSigner(creator);
        signVerify = await signer.signMessage(signHashBytes);
      }
      return new Promise((resolve, reject) => {
        if (signVerify) {
          resolve(signVerify);
        } else {
          reject();
        }
      });
    } catch (e) {
      console.log('error', e);
    }
  };

  /**
   * sign Nft Item
   * @param txObject
   */
  signNftItem = async ({
    library,
    creator,
    tokenType,
    quantity,
    saleOrderSupply,
    price,
    saleOrderSalt,
    owner,
    id,
  }: any) => {
    let signVerify: any = null;
    let hasnVerify = null;

    try {
      hasnVerify = ethers.utils.solidityKeccak256(
        ['uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'address', 'address'],
        [id, tokenType, quantity, saleOrderSupply, price, saleOrderSalt, creator, owner]
      );

      const signHashBytes = ethers.utils.arrayify(hasnVerify);

      if (library?.provider?.wc) {
        const wcMessage = ethers.utils.hexlify(signHashBytes);
        signVerify = await library.provider.wc.signPersonalMessage([wcMessage, creator]);
      } else {
        const signer = await library.getSigner(creator);
        signVerify = await signer.signMessage(signHashBytes);
      }
      return new Promise((resolve, reject) => {
        if (signVerify) {
          resolve(signVerify);
        } else {
          reject();
        }
      });
    } catch (e) {
      console.log('error', e);
    }
  };

  removeFromSaleNft = async ({
    account,
    library,
    tokenId,
    tokenType,
    quantity,
    saleOrderSupply,
    price,
    saleOrderSalt,
    creator,
    owner,
    uri,
    internalTxID,
    saleOrderSignature,
    callback,
  }: {
    account: any;
    library: any;
    tokenId: any;
    tokenType: number;
    quantity: number;
    saleOrderSupply: number;
    price: string;
    saleOrderSalt: string;
    creator: string;
    owner: string;
    uri: string;
    internalTxID: string;
    saleOrderSignature: string;
    callback: any;
  }) => {
    try {
      const contract = getContract(contractAddress, ExchangeABI.output.abi, library, account);
      const data = [tokenId, tokenType, quantity, saleOrderSupply, price, saleOrderSalt];
      const addr = [creator, owner];
      const str = [uri, internalTxID];
      const signature = [saleOrderSignature];

      contract.once('CancelSaleOrderEvent', (onSaleQuantity, unitPrice, saleOrderSalt, seller, _internalTxID) => {
        console.log('CancelSaleOrderEvent');
        console.log('onSaleQuantity', Web3.utils.hexToNumberString(onSaleQuantity));
        console.log('unitPrice', Web3.utils.hexToNumberString(unitPrice));
        console.log('saleOrderSalt', saleOrderSalt);
        console.log('seller', seller);
        console.log('_internalTxID', _internalTxID);
        if (internalTxID === _internalTxID) {
          callback && callback.success(internalTxID);
        }
      });

      const response = await contract.cancelSaleOrder(data, addr, str, signature);
      return new Promise((resolve, reject) => {
        if (response) {
          resolve(response);
        } else {
          reject();
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  checkBuyerBalance = async (library: any, data: any, tokenAddress: string) => {
    // const buyerAdress = data.user[0].networkAddress;
    // const balances = await this._getBalanceBuyer(library, buyerAdress, tokenAddress);
    // const balance = balances.balance;
    // return checkEnoughBalance(data, balance);
  };

  /**
   * get Balance
   * @returns balance
   */
  _getBalanceBuyer = async (library: any, buyerAddress: string, tokenAddress: string) => {
    // const tokenInst = getContract(tokenAddress, TokenJSON.output.abi, library);
    // if (buyerAddress) {
    //   const balance = await tokenInst.balanceOf(buyerAddress);
    //   const decimals = await tokenInst.decimals();
    //   return {
    //     balance: convertEToNumber(formatUnits(balance, 'wei'), decimals),
    //   };
    // } else {
    //   return {
    //     balance: 0,
    //   };
    // }
  };

  cancelResell = async ({
    library,
    nft,
    resellOrderData,
    nftifyExchangeAddress,
    tokenAddress,
    creator,
    callback,
    coinDecimal,
  }: {
    library: any;
    nft: any;
    resellOrderData: any;
    nftifyExchangeAddress: string;
    tokenAddress: string;
    creator: string;
    callback: any;
    coinDecimal: number;
  }) => {
    // const { metadata, _id: resellOrderId } = resellOrderData;
    // const { resellOrderSalt, signResell } = metadata || {};
    // const tokenID = convertTokenIdToHex(nft.tokenId);
    // const resellOrderQuantity = resellOrderData.saleQuantity?.toString();
    // const price = convertPrice(resellOrderData.price?.toString(), coinDecimal);
    // const enableMakeOffer = OFFER_MODE[0].toString();
    // const collectionAddress = nft?.collection?.contractAddress;
    // const contractInst = getContract(nftifyExchangeAddress, NftifyExchangeJSON.output.abi, library, creator);
    // const data = [tokenID, resellOrderQuantity, price, resellOrderSalt];
    // const val = [enableMakeOffer, CANCEL_SELL_ORDER_TYPE.RESELL];
    // const addr = [creator, tokenAddress, collectionAddress];
    // await contractInst
    //   .cancelSaleOrder(data, val, addr, signResell, resellOrderId)
    //   .then(async (res: any) => {
    //     callback({ step: STEP_CANCEL_RESELL.PROCESSING, txId: res.hash, resellOrderId });
    //     const receipt = await library.waitForTransaction(res.hash);
    //     if (receipt.status) {
    //       callback({ step: STEP_CANCEL_RESELL.SUCCESS, txId: res.hash, resellOrderId });
    //     } else {
    //       showMessage(TYPE_OF_ANT_DESIGN.ERROR, 'message.E65');
    //       callback({ step: STEP_CANCEL_RESELL.FAIL });
    //     }
    //   })
    //   .catch((e: any) => {
    //     if (e.code !== ERROR_METAMASK.CANCEL_METAMASK) {
    //       showMessage(TYPE_OF_ANT_DESIGN.ERROR, 'message.E65');
    //     }
    //     callback({ step: STEP_CANCEL_RESELL.FAIL });
    //   });
  };

  signResell = async ({
    library,
    creator,
    callbackError,
    callbackSuccess,
    nft,
    resellOrderData,
    coinDecimal,
    tokenAddress,
  }: {
    library: any;
    creator: string;
    contractAddress: string;
    callbackError: any;
    callbackSuccess: any;
    collectionId: string;
    nft: any;
    resellOrderData: any;
    coinDecimal: any;
    tokenAddress: any;
  }) => {
    // let signResellData = null;
    // let hashResell = null;
    // const resellOrderSalt = getCurrentTime();
    // if (!nft) {
    //   callbackError();
    // }
    // try {
    //   const tokenId = nft.tokenId;
    //   const quantity = resellOrderData?.quantity;
    //   const price = resellOrderData?.price;
    //   const offerMode = OFFER_MODE[0];
    //   const collectionAddress = nft.collection?.contractAddress;
    //   hashResell = ethers.utils.solidityKeccak256(
    //     ['uint256', 'uint256', 'uint256', 'uint256', 'uint8', 'address', 'address', 'address'],
    //     [
    //       convertTokenIdToHex(tokenId),
    //       quantity,
    //       convertPrice(price, coinDecimal),
    //       resellOrderSalt,
    //       offerMode,
    //       creator,
    //       tokenAddress,
    //       collectionAddress,
    //     ],
    //   );
    //   const sigHashBytes = ethers.utils.arrayify(hashResell);
    //   if (library.provider?.wc) {
    //     const wcMessage = ethers.utils.hexlify(sigHashBytes);
    //     signResellData = await library.provider.wc.signPersonalMessage([wcMessage, creator]);
    //   } else {
    //     const signer = await library.getSigner(creator);
    //     signResellData = await signer.signMessage(sigHashBytes);
    //   }
    //   callbackSuccess({ signResell: signResellData, resellOrderSalt, hashResell });
    // } catch (e) {
    //   console.log('error', e);
    //   callbackError();
    // }
  };
}
