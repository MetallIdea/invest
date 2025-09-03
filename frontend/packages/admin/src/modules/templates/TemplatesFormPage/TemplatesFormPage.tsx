import { observer } from "mobx-react-lite";
import { DomPanel } from "./panels/DomPanel";
import { useTemplatesFormPageContext } from "./TemplatesFormPageState";
import { useParams } from "react-router";
import { useEffect } from "react";
import { ActionsPanel } from "./panels/ActionsPanel";
import { MarkupItem } from "../../../common/components/Markup/MarkupItem";
import { NodePanel } from "./panels/NodePanel";

export const TemplatesFormPage = observer(() => {
    const pageState = useTemplatesFormPageContext();

    const { id } = useParams();

    useEffect(() => {
        if (id &&  id !== 'new') {
            pageState.fetchItem(Number(id));
        }
    }, [id]);

    return (
        <div>
            <ActionsPanel />

            <style>
                {pageState.item?.Css}
            </style>

            <div>
                {pageState.nodes.length > 0 ? <MarkupItem node={pageState.nodes[0]} />: null }
            </div>

            <DomPanel />
            <NodePanel />
        </div>
    )
});