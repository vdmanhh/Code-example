import { all } from 'redux-saga/effects';

import watchAuth from './auth/saga';
import watchAdress from './address/saga';
import watchInit from './init/saga';
import watchCreateNft from './createNft/saga';
import watchNftList from './nftList/saga';
import watchNftDetail from './nftDetail/saga';

function* rootSaga() {
  yield all([watchInit(), watchAuth(), watchAdress(), watchCreateNft(), watchNftList(), watchNftDetail()]);
}
export default rootSaga;
