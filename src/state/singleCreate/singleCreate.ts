import { createSlice } from "@reduxjs/toolkit";

const singleCreateSlice = createSlice({
  name: "single_create",
  initialState: {
    location: "",
    date: "",
    time: "",
    limit_of_member: 0,
    price: 0,
    description: "",
  },
  reducers: {
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setDate: (state, action) => {
      state.date = action.payload;
    },
    setTime: (state, action) => {
      state.time = action.payload;
    },
    setLimitOfMember: (state, action) => {
      state.limit_of_member = action.payload;
    },
    setPrice: (state, action) => {
      state.price = action.payload;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
    },
  },
});

export const {
  setLocation,
  setLimitOfMember,
  setPrice,
  setTime,
  setDate,
  setDescription,
} = singleCreateSlice.actions;

export default singleCreateSlice.reducer;
