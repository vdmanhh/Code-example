import { call, put, takeLatest } from 'redux-saga/effects';
import { postSignInApi } from 'services/Authentication';
import { getClans, getCurrencies, getRarities } from 'services/init';
import { ResponseGenerator } from 'types';
import {
  handleGetClans,
  handleGetClansSuccess,
  handleGetCurrencies,
  handleGetCurrenciesSuccess,
  handleGetRarities,
  handleGetRaritiesSuccess,
} from './slice';

function* getClansSaga() {
  try {
    const response: ResponseGenerator = yield getClans();
    if (response.meta.code === 0) {
      yield put(handleGetClansSuccess({ clans: response.data }));
    }
  } catch (error) {
    console.error(error);
  }
}

function* getRaritiesSaga() {
  try {
    const response: ResponseGenerator = yield getRarities();
    if (response.meta.code === 0) {
      yield put(handleGetRaritiesSuccess({ rarities: response.data }));
    }
  } catch (error) {
    console.error(error);
  }
}

function* getCurrenciesSaga() {
  try {
    const response: ResponseGenerator = yield getCurrencies();
    if (response.meta.code === 0) {
      yield put(handleGetCurrenciesSuccess({ currencies: response.data }));
    }
  } catch (error) {
    console.error(error);
  }
}

function* watchInit() {
  yield takeLatest(handleGetClans, getClansSaga);
  yield takeLatest(handleGetRarities, getRaritiesSaga);
  yield takeLatest(handleGetCurrencies, getCurrenciesSaga);
}

export default watchInit;
