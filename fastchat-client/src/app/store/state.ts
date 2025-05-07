import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Définition des types explicites
interface UserInfo {
  username: string;
  email: string;
  picturePath?: string;
  [key: string]: unknown; // Permet d'ajouter d'autres propriétés si nécessaire
}

interface UserState {
  token: string | null;
  userInfo: UserInfo | null;
}

// État initial avec des types explicites
const initialState: UserState = {
  token: null,
  userInfo: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ token: string; userInfo: UserInfo }>
    ) => {
      state.token = action.payload.token;
      state.userInfo = action.payload.userInfo;

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "user",
          JSON.stringify({
            token: action.payload.token,
            userInfo: action.payload.userInfo,
          })
        );
      }
    },
    logout: (state) => {
      state.token = null;
      state.userInfo = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
