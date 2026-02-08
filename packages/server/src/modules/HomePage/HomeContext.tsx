'use client';

import { Candle } from "common/src/entities/candles";
import { Share } from "common/src/entities/shares";
import { Suggestion } from "common/src/entities/suggestions";
import { createContext, PropsWithChildren, useContext } from "react";

export type HomeContextType = {
    allSharesWithLastCandles: {
        invest_candles: Candle;
        invest_shares: Share;
    }[];
    lastSuggestions: {
        invest_suggestions: Suggestion;
        invest_shares: Share;
    }[];
    allSuggestions: {
        invest_suggestions: Suggestion;
        invest_shares: Share;
    }[];
}

export const HomeContext = createContext<HomeContextType>({
    allSharesWithLastCandles: [],
    lastSuggestions: [],
    allSuggestions: [],
});

export function useHomeContext() {
    const context = useContext(HomeContext);

    if (!context) {
        throw new Error('Use HomeContext provider')
    }

    return context;
}

type Props = PropsWithChildren & {
    value: HomeContextType;
}

export const HomeContextProvider = ({ value, children }: Props) => {
    return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>
}