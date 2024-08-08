import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const getItems = async () => {
  try {
    const response = await axios.get("http://localhost:8898/api/items", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(first);
  }
};

const itemSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    getItems: (state, action) => {
      state.items = action.payload;
    },
  },
});

export default itemSlice.reducer;

export const { addItem } = itemSlice.actions;
