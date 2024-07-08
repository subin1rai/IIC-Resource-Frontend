import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

export const itemSlice = createSlice({
  name: "items",
  initialState,
});
