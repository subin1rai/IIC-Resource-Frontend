import { createSlice } from "@reduxjs/toolkit";

// Initial State
const initialState = {
  userInfo: JSON.parse(localStorage.getItem("userInfo")) || null,
  isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
      state.isLoggedIn = true;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
      localStorage.setItem("isLoggedIn", "true");
    },

    clearUserInfo: (state) => {
      state.userInfo = null;
      state.isLoggedIn = false;
      localStorage.removeItem("userInfo");
      localStorage.setItem("isLoggedIn", "false");
    },
  },
});

export const { setUserInfo, updateUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
