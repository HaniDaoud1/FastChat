// src/store/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  token: null as string | null,
  userInfo: null as any,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ token: string; userInfo: any }>) => {
      state.token = action.payload.token;
      state.userInfo = action.payload.userInfo;

      localStorage.setItem("user", JSON.stringify({
        token: action.payload.token,
        userInfo: action.payload.userInfo,
      }));
    },
    logout: (state) => {
      state.token = null;
      state.userInfo = null;

      localStorage.removeItem("user");

    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
