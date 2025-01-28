import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./login/login";
import loadingReducer from "./loading/loading";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    loading: loadingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
