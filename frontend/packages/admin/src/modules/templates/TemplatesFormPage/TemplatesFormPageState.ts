import { makeAutoObservable, runInAction } from "mobx";
import { createContext, useContext } from "react";
import { GET, POST } from "../../../common/utils/requests";
import type { BlockTemplate } from "../types";
import type { TreeNode } from "primereact/treenode";
import { moveNodeToDown, moveNodeToTop } from "../../../common/utils/tree";

export class TemplatesFormPageState {
    item?: BlockTemplate;
    setItem(value: BlockTemplate) {
        this.item = {
            ...this.item,
            ...value,
        }
    }

    nodes: TreeNode[] = [];
    setNodes(nodes: TreeNode[]) {
        this.nodes = nodes;
    }

    isDomOpen = false;
    setIsDomOpen(value:  boolean) {
        this.isDomOpen = value;
    }

    isNodeOpen = false;
    setIsNodeOpen(value:  boolean) {
        this.isNodeOpen = value;
    }

    selectedNode?: TreeNode;
    setSelectedNode(node: TreeNode) {
        this.selectedNode = node;
    }

    nextId = 0;

    constructor() {
        makeAutoObservable(this);
    }

    createElement() {
        if (this.selectedNode)  {
            this.selectedNode.children = this.selectedNode.children ?? [];

            this.selectedNode.children =  [...this.selectedNode.children, {
                key: this.nextId,
                label: 'div',
                data: {
                    type: 'div',
                    className: `div${this.nextId}`,
                }
            }];
            this.nodes = [...this.nodes];
        } else {
            this.nodes =  [...this.nodes, {
                key: this.nextId,
                label: 'div',
                data: {
                    type: 'div',
                    className: `div${this.nextId}`,
                }
            }];
        }
        this.nextId++;
    }

    moveTop() {
        moveNodeToTop(this.nodes, this.selectedNode);
        this.nodes = [...this.nodes];
    }

    moveDown() {
        moveNodeToDown(this.nodes, this.selectedNode);
        this.nodes = [...this.nodes];
    }

    async fetchItem(id: number) {
        const result = await GET<BlockTemplate>(`/api/block_templates/${id}`);

        runInAction(() => {
            this.item = result;
            this.nodes = JSON.parse(result.TemplateJSON);
        });
    }

    async saveItem() {
        return await POST<BlockTemplate>(`/api/block_templates`, [
            {
                ...this.item,
                TemplateJSON: JSON.stringify(this.nodes),
            }
        ]);
    }
}

export const TemplatesFormPageContext = createContext(new TemplatesFormPageState());

export function useTemplatesFormPageContext() {
    return useContext(TemplatesFormPageContext);
}