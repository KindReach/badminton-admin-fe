import { createSlice } from "@reduxjs/toolkit";

const publishSlice = createSlice({
  name: "publish_state",
  initialState: {
    single_state: false,
    multi_state: false,
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
