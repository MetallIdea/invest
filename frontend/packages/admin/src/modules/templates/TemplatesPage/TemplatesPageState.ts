import { makeAutoObservable, runInAction } from "mobx";
import { createContext, useContext } from "react";
import { GET, POST } from "../../../common/utils/requests";
import type { BlockTemplate } from "../types";
import type { PageResult } from "../../../common/types";

export class TemplatesPageState {
    items: BlockTemplate[] = [];

    isExportVisible = false;
    setIsExportVisible(value: boolean) {
        this.isExportVisible = value;
    }

    constructor() {
        makeAutoObservable(this);
    }

    async fetchItems() {
        const { Data } = await GET<PageResult<BlockTemplate>>('/api/block_templates');

        runInAction(() => {
            this.items = Data;
        });
    }

    async exportFile(file: File) {
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onload = async (e) => {
            await POST('/api/block_templates', e.target?.result);
        };
        reader.readAsText(file);
    }
}

export const TemplatesPageContext = createContext(new TemplatesPageState());

export function useTemplatesPageContext() {
    return useContext(TemplatesPageContext);
}