import { call, put, takeLatest } from 'redux-saga/effects';
import { postNfts } from 'services/createnft';
import { ResponseGenerator } from 'types';
import { handleCreateNftAction, handleCreateNftActionFail, handleCreateNftActionSuccess } from './slice';

function* handleCreateNftSaga({ payload }: any) {
  const { data, callback } = payload;
  const formData = new FormData();

  for (const field in data) {
    formData.append(field, data[field]);
  }

  try {
    const response: ResponseGenerator = yield postNfts(formData);
    if (response.meta.code === 0) {
      yield put(handleCreateNftActionSuccess({}));
      yield call(callback(response?.data?._id));
    }
  } catch (error) {
    yield put(handleCreateNftActionFail({}));
    console.error(error);
  }
}

function* watchCreateNft() {
  yield takeLatest(handleCreateNftAction, handleCreateNftSaga);
}

export default watchCreateNft;
