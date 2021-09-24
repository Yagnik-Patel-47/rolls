import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  tab: "likes" | "comments";
}

const initialState: ModalState = {
  isOpen: false,
  tab: "likes",
};

const modalSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setModalState: (state, action: PayloadAction<ModalState>) => {
      return action.payload;
    },
  },
});

export const { setModalState } = modalSlice.actions;
export default modalSlice.reducer;
