import { call, put, takeLatest } from 'redux-saga/effects';
import { handleCreateNftActionSuccess } from 'redux/createNft/slice';
import { getListNft } from 'services/nftList';
import { ResponseGenerator } from 'types';
import { handleGetListNft, handleGetListNftSuccess } from './slice';

function* handleGetListNftSaga({ payload }: any) {
  const { data } = payload;
  try {
    const response: ResponseGenerator = yield getListNft(data);
    if (response.meta.code === 0) {
      yield put(
        handleGetListNftSuccess({
          data: response.data.data,
          dortTotal: response.data.dortQuantity,
          itemTotal: response.data.itemQuantity,
          total: response.data.dortQuantity + response.data.itemQuantity,
        })
      );
    }
  } catch (error) {
    console.error(error);
  }
}

function* watchCreateNft() {
  yield takeLatest(handleGetListNft, handleGetListNftSaga);
}

export default watchCreateNft;
