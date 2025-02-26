import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./login/login";
import loadingReducer from "./loading/loading";
import singleCreateReducer from "./singleCreate/singleCreate";
import publishReducer from "./publish/publish";
import modalReducer from "./modal/modal";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    loading: loadingReducer,
    publish: publishReducer,
    modal: modalReducer,
    // singleCreateReducer: singleCreateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
