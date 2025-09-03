import { observer } from "mobx-react-lite";
import { Sidebar } from 'primereact/Sidebar';
import { useTemplatesFormPageContext } from "../TemplatesFormPageState";
import { DefaultEditor } from "../../../../common/components/Markup/Editors/DefaultEditor";
import { useEffect } from "react";

export const NodePanel = observer(() => {
    const pageState = useTemplatesFormPageContext();

    useEffect(() => {
        if (pageState.selectedNode) {
            pageState.selectedNode.label = `${pageState.selectedNode.data.type}(.${pageState.selectedNode.data.className})`
        }
    }, [pageState.selectedNode?.data.type, pageState.selectedNode?.data.className]);

    const handleChangeProps = (props: any) => {
        if (pageState.selectedNode) {
            pageState.selectedNode.data = props;
        }
    }

    return (
        <Sidebar visible={pageState.isNodeOpen} onHide={() => pageState.setIsNodeOpen(false)}>
            <div>
                {pageState.selectedNode?.label}
            </div>

            <div>
                <DefaultEditor props={pageState.selectedNode?.data} onChangeProps={handleChangeProps} />
            </div>
        </Sidebar>
    )
});