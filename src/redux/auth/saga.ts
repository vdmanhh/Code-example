import { call, put, takeLatest } from 'redux-saga/effects';
import { postSignInApi } from 'services/Authentication';
import { ResponseGenerator } from 'types';
import { loginAction, loginSuccesccAction } from './slice';

function* loginSaga({ payload }: any) {
  const { data } = payload;
  try {
    const response: ResponseGenerator = yield postSignInApi(data);
    if (response.meta.code === 0) {
      yield put(loginSuccesccAction({ isAdmin: response.data.result }));
    }
  } catch (error) {
    console.error(error);
  }
}

function* watchAuth() {
  yield takeLatest(loginAction, loginSaga);
}

export default watchAuth;
