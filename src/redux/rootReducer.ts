import { combineReducers } from 'redux';

import authReducer from './auth/slice';
import addressReducer from './address/slice';
import initReducer from './init/slice';
import createNFTReducer from './createNft/slice';
import nftListReducer from './nftList/slice';
import nftDetailReducer from './nftDetail/slice';

export default combineReducers({
  init: initReducer,
  auth: authReducer,
  address: addressReducer,
  createNft: createNFTReducer,
  nftList: nftListReducer,
  nftDetail: nftDetailReducer
});
