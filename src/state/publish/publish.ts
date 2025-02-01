import { createSlice } from "@reduxjs/toolkit";

export enum Mode {
  CHECK, PUBLISH
};

const publishSlice = createSlice({
  name: "publish_state",
  initialState: {
    single_state: Mode.CHECK,
    multi_state: Mode.PUBLISH,
  },
  reducers: {
    setSingleState: (state, action) => {
      state.single_state = action.payload;
    },
    setMultiState: (state, action) => {
      state.multi_state = action.payload;
    },
  },
});

export const { setSingleState, setMultiState } = publishSlice.actions;
export default publishSlice.reducer;
