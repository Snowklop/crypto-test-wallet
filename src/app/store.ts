import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import loginReducer from '../features/login/loginSlice';
import assetsReducer from '../features/assets/assetsSlice';
import historyReducer from '../features/history/historySlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    assets: assetsReducer,
    history: historyReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
