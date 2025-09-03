import { makeAutoObservable, runInAction } from "mobx";
import type { PageResult } from "../../../common/types";
import { DELETE, GET, POST } from "../../../common/utils/requests";
import type { NdField, NdTable } from "../types";
import { createContext, useContext } from "react";

export class TablesFormPageState {
    emptyTable: NdTable = {
        ID: 0,
        Name: '',
        Fields: [],
    };

    table?: NdTable;

    editField?: Partial<NdField>;
    setEditField(field?: Partial<NdField>) {
        this.editField = field;
    }

    constructor() {
        makeAutoObservable(this);
    }
    
    async fetchItem({ id }: { id: number }) {
        const table = await GET<NdTable>(`/api/tables/${id}`);

        runInAction(() => {
            this.table = table;
        });
    }

    async saveTable({ table }: {table: NdTable}) {
        const result = await POST<NdTable>('/api/tables', {
            SiteID: 1,
            ...table,
        });

        runInAction(() => {
            this.table = result;
        });
    }
    
    async saveField({ field }: { field: Partial<NdField> }) {
        await POST(`/api/tables/${this.table!.ID}/fields`, field);

        if (this.table) {
            this.fetchItem({ id: this.table!.ID });
        }
    }
}
export const TablesFormPageContext = createContext(new TablesFormPageState());

export function useTablesFormPageContext() {
    return useContext(TablesFormPageContext);
}