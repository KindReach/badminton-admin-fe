import { createSlice } from "@reduxjs/toolkit";

interface LoadingState {
  isLoading1: boolean;
  isLoading2: boolean;
}

const initialState: LoadingState = {
  isLoading1: false,
  isLoading2: false,
};

const loadingSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLoading1: (state, action) => {
      state.isLoading1 = action.payload;
    },
    setLoading2: (state, action) => {
      state.isLoading2 = action.payload
    }
  },
});

export const { setLoading1, setLoading2 } = loadingSlice.actions;
export default loadingSlice.reducer;