import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ShareWithCandles } from "common/src/entities/shares";

export type HomeState = {
    sharesWithCandles?: ShareWithCandles[];
    filters: {
        search: string;
        minProfit?: number;
    };
    sort: {
        price?: boolean;
    }
};

const initialState: HomeState = {
    filters: {
        search: '',
    },
    sort: {},
};

export const homeSlice = createSlice({
    name: "home",
    initialState,
    reducers: {
        setHomeInitialData: (state, action: PayloadAction<Partial<HomeState>>) => {
            return { ...state, ...action.payload };
        },
        setFilters: (state, action: PayloadAction<HomeState['filters']>) => {
            state.filters = action.payload;
        },
        setSort: (state, action: PayloadAction<HomeState['sort']>) => {
            state.sort = action.payload;
        },
    },
});

export const { setHomeInitialData, setFilters, setSort } = homeSlice.actions;
export const homeReducer = homeSlice.reducer;
