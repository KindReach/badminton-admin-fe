import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./login/login";
import loadingReducer from "./loading/loading";
import singleCreateReducer from "./singleCreate/singleCreate";
import publishReducer from "./publish/publish";
import modalReducer from "./modal/modal";
import sessionStateReducer from "./sessionState/sessionState";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    loading: loadingReducer,
    publish: publishReducer,
    modal: modalReducer,
    sessionState: sessionStateReducer,
    // singleCreateReducer: singleCreateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
