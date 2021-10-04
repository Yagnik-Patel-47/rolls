import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profile";
import rollReducer from "./rolls";
import modalReducer from "./modal";
import interactedReducer from "./interacted";

const store = configureStore({
  reducer: {
    profile: profileReducer,
    rolls: rollReducer,
    modalState: modalReducer,
    interacted: interactedReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
