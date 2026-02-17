import { useAppDispatch } from "@/state/store";
import { useIsMounted } from "./useIsMounted";
import { PayloadAction } from "@reduxjs/toolkit";

export function useSetInitialData(action: PayloadAction<unknown>) {
  const dispatch = useAppDispatch();
  const isMounted = useIsMounted();

  if (!isMounted) {
    dispatch(action);
  }
}
