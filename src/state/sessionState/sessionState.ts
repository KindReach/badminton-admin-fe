import { createSlice } from "@reduxjs/toolkit";

//const categories = ["全部場次", "報名中", "進行中",  "尚未開放", "已結束"];

export enum sessionState {
  ALL = "全部場次",
  ONPROGRESS = "進行中",
  OPENING = "報名中",
  CLOSED = "尚未開放",
  ENDED = "已結束",
}

interface initialStateType {
  category: sessionState;
}

const initialState: initialStateType = {
  category: sessionState.ALL,
};

const sessionStateSlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    }
  },
});

export const {
  setCategory
} = sessionStateSlice.actions;

export default sessionStateSlice.reducer;
