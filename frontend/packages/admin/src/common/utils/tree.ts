export function moveNodeToTop(nodes: any[], moveNode: any) {
    if (nodes) {
        for(let i=1; i<nodes.length; i++) {
            // Если не первая
            if (moveNode === nodes[i]) {
                const prevNode = nodes[i - 1];
                nodes[i - 1] = nodes[i];
                nodes[i] = prevNode;
                return true;
            }

            if (moveNodeToTop(nodes[i].children, moveNode)) {
                return true;
            }
        }
    }
}

export function moveNodeToDown(nodes: any[], moveNode: any) {
    if (nodes) {
        for(let i=0; i<nodes.length - 1; i++) {
            // Если не последняя
            if (moveNode === nodes[i]) {
                const nextNode = nodes[i + 1];
                nodes[i + 1] = nodes[i];
                nodes[i] = nextNode;
                return true;
            }

            if (moveNodeToDown(nodes[i].children, moveNode)) {
                return true;
            }
        }
    }
}