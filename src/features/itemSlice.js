import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [
    {
      item_name: "",
      category: "",
      itemCategory: "",
      measuring_unit: "",
      productCategory: "",
      low_limit: 0,
    },
  ],
};

export const itemSlice = createSlice({
  name: "items",
  initialState,
});
