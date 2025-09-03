import { makeAutoObservable, runInAction } from "mobx";
import type { PageResult } from "../../../common/types";
import { DELETE, GET } from "../../../common/utils/requests";
import type { NdTable } from "../types";
import { createContext, useContext } from "react";

export class TablesPageState {
    tables: NdTable[] = [];

    constructor() {
        makeAutoObservable(this);
    }
    
    async fetchItems() {
        const { Data } = await GET<PageResult<NdTable>>('/api/tables');

        runInAction(() => {
            this.tables = Data;
        });
    }
    
    async deleteTable({ id }: {
        id: number
    }) {
        await DELETE(`/api/tables/${id}`);

        await this.fetchItems();
    }
}

export const TablesPageContext = createContext(new TablesPageState());

export function useTablesPageContext() {
    return useContext(TablesPageContext);
}