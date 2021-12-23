import { call, put, takeLatest } from 'redux-saga/effects';
import { postNfts } from 'services/createnft';
import { deleteNft, editNfts, getNftDetail, getNftTransction, getSellOrderDetail, postSellOrder } from 'services/nftDetail';
import { ResponseGenerator } from 'types';
import {
  hadnleSellNftSuccessAction,
  handleDeleteNftAction,
  handleDeleteNftSuccessAction,
  handleEditNftAction,
  handleEditNftSuccessAction,
  handleGetNftDetailAction,
  handleGetNftDetailSuccessAction,
  handleGetNftTransactionAction,
  handleGetNftTransactionSuccessAction,
  handleGetSellOrderDetailAction,
  handleGetSellOrderDetailSuccessAction,
  handleSellNftAction,
} from './slice';

function* handleGetNftDetailSaga({ payload }: any) {
  const { data } = payload;
  try {
    const response: ResponseGenerator = yield getNftDetail(data);
    if (response.meta.code === 0) {
      yield put(handleGetNftDetailSuccessAction({ data: response?.data }));
    }
  } catch (error) {
    console.error(error);
  }
}

function* handleDeleteNftSaga({ payload }: any) {
  const { data, callback } = payload;
  try {
    const response: ResponseGenerator = yield deleteNft(data);
    if (response.meta.code === 0) {
      yield put(handleDeleteNftSuccessAction({}));
      yield call(callback);
    }
  } catch (error) {
    console.error(error);
  }
}

function* handleGetNftTransactionSaga({ payload }: any) {
  const { id, data } = payload;
  try {
    const response: ResponseGenerator = yield getNftTransction(id, data);
    if (response.meta.code === 0) {
      yield put(handleGetNftTransactionSuccessAction({ data: response?.data?.data, total: response?.data?.total }));
    }
  } catch (error) {
    console.error(error);
  }
}

function* handleEditNftSaga({ payload }: any) {
  const { data, callback, id } = payload;
  const formData = new FormData();

  for (const field in data) {
    formData.append(field, data[field]);
  }

  try {
    const response: ResponseGenerator = yield editNfts(formData, id);
    if (response.meta.code === 0) {
      yield put(handleEditNftSuccessAction({}));
      yield call(callback(response?.data?._id));
    }
  } catch (error) {
    console.error(error);
  }
}

function* handleSellNftSaga({ payload }: any) {
  const { data, callback } = payload;
  try {
    const response: ResponseGenerator = yield postSellOrder(data);
    if (response.meta.code === 0) {
      yield put(hadnleSellNftSuccessAction({}));
      yield call(callback(response?.data?._id));
    }
  } catch (error) {
    console.error(error);
  }
}

function* handleGetSellOrderDetailSaga({ payload }: any) {
  const { id } = payload;
  try {
    const response: ResponseGenerator = yield getSellOrderDetail(id);
    if (response.meta.code === 0) {
      yield put(handleGetSellOrderDetailSuccessAction({data: response.data}));
    }
  } catch (error) {
    console.error(error);
  }
}



function* watchCreateNft() {
  yield takeLatest(handleGetNftDetailAction, handleGetNftDetailSaga);
  yield takeLatest(handleDeleteNftAction, handleDeleteNftSaga);
  yield takeLatest(handleGetNftTransactionAction, handleGetNftTransactionSaga);
  yield takeLatest(handleEditNftAction, handleEditNftSaga);
  yield takeLatest(handleSellNftAction, handleSellNftSaga);
  yield takeLatest(handleGetSellOrderDetailAction, handleGetSellOrderDetailSaga)
}

export default watchCreateNft;
