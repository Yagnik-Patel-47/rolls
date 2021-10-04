import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: boolean = false;

const interactedSlice = createSlice({
  name: "interacted",
  initialState,
  reducers: {
    setUserInteracted: (state, action: PayloadAction<boolean>) => {
      return action.payload;
    },
  },
});

export const { setUserInteracted } = interactedSlice.actions;
export default interactedSlice.reducer;
