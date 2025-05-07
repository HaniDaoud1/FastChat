// ./store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./state"; // ou le nom que tu utilises

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// Types pour TypeScript (optionnel mais recommandé)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
