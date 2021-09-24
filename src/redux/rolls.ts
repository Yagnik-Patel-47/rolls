import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Rolls } from "../utils/interfaces";

const initialState: Rolls = [];

const appRolls = createSlice({
  name: "profile",
  initialState,
  reducers: {
    initRolls: (state, action: PayloadAction<Rolls | any>) => {
      return action.payload;
    },
  },
});

export const { initRolls } = appRolls.actions;
export default appRolls.reducer;
