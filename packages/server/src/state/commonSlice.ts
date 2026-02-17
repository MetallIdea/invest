import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { User } from "common/src/entities/users";

export type CommonState = {
  isMobile?: boolean;
  user?: User;
};

const initialState: CommonState = {};

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setCommonInitialData: (state, action: PayloadAction<CommonState>) => {
      return { ...state, ...action.payload };
    },
    setUser: (state, action: PayloadAction<User | undefined>) => {
      state.user = action.payload;
    },
  },
});

export const { setCommonInitialData, setUser } = commonSlice.actions;
export const commonReducer = commonSlice.reducer;
