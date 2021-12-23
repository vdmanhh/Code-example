import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { createFilter } from 'redux-persist-transform-filter';

import rootReducer from './rootReducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import rootSaga from './rootSaga';
import { namespace as AddressNamespace } from './address/slice';
import { namespace as AuthNamespace } from './auth/slice';

/**
 *  blacklist config redux
 *  whitelist config redux persit
 */
const saveAuthenSliceFilter = createFilter(AuthNamespace, ['isAdmin']);

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: [AddressNamespace, AuthNamespace],
  blacklist: [],
  transforms: [saveAuthenSliceFilter],
};

const root = persistReducer(persistConfig, rootReducer);
export const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: root,
  middleware: [
    ...getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }),
    sagaMiddleware,
  ],
  devTools: process.env.NODE_ENV !== 'production',
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store, {});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
