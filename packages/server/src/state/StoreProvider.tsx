'use client'

import { PropsWithChildren, useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore, RootState } from './store'
import { setCommonInitialData } from './commonSlice'

type Props = PropsWithChildren & {
  // Данные с сервера
  initialData?: {
    common: Partial<RootState['common']>
  }
}

export default function StoreProvider({
  children,
  initialData
}: Props) {
  const storeRef = useRef<AppStore | undefined>(undefined);

  // eslint-disable-next-line react-hooks/refs
  if (!storeRef.current) {
    storeRef.current = makeStore()
    // Диспатчим данные сразу при создании хранилища
    if (initialData?.common) {
      // eslint-disable-next-line react-hooks/refs
      storeRef.current.dispatch(setCommonInitialData(initialData?.common));
    }
  }

  // eslint-disable-next-line react-hooks/refs
  return <Provider store={storeRef.current}>{children}</Provider>
}