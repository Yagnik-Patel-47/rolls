import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Profile } from "../utils/interfaces";

const initialState: Profile = {
  fullName: "",
  email: "",
  photo: "",
  rolls: [],
  id: "",
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    initData: (state, action: PayloadAction<Profile | any>) => {
      return {
        fullName: action.payload.fullName,
        email: action.payload.email,
        photo: action.payload.photo,
        rolls: action.payload.rolls,
        id: action.payload.id,
      };
    },
  },
});

export const { initData } = profileSlice.actions;
export default profileSlice.reducer;
