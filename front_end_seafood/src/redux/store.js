import {combineReducers, configureStore} from '@reduxjs/toolkit'
import authReducer from "./authSlice";
import cartReducer from './cartSlice'
import authAdminReducer from './authAdminSlice';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
  }
  const rootReducer = combineReducers({auth: authReducer ,cart: cartReducer,authAdmin: authAdminReducer})
  const persistedReducer = persistReducer(persistConfig, rootReducer)

  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  })
  export let persistor = persistStore(store);
export default store;