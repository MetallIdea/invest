import { observer } from "mobx-react-lite";
import type { TreeNode } from "primereact/treenode";

type Props = {
    node: TreeNode;
}

export const MarkupItem = observer(({ node }:  Props) => {
    const Tag = node.data.type;

    return (
        <Tag className={node.data.className}>
            {node.data.text}
            {node.children?.map((childNode) => <MarkupItem key={childNode.key} node={childNode} />)}
        </Tag>
    )
});