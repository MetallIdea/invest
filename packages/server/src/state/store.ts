import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch as useReduxDispatch,
  TypedUseSelectorHook,
  useSelector as useReduxSelector,
} from "react-redux";
import { commonReducer } from "./commonSlice";
import { homeReducer } from "@/app-pages/HomePage/homeSlice";

export const makeStore = () =>
  configureStore({
    reducer: { common: commonReducer, home: homeReducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

// Тип самого хранилища
export type AppStore = ReturnType<typeof makeStore>;
// Тип глобального стейта
export type RootState = ReturnType<AppStore["getState"]>;
// Тип функции dispatch
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = () => useReduxDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
