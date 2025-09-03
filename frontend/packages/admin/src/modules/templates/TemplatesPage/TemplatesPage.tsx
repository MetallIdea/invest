import { observer } from "mobx-react-lite";
import { useTemplatesPageContext } from "./TemplatesPageState";
import { useEffect } from "react";
import { ActionsPanel } from "./ActionsPanel";
import { Link } from "react-router";
import { ExportModal } from "./modals/ExportModal";

export const TemplatesPage = observer(() => {
    const pageState = useTemplatesPageContext();

    useEffect(() => {
        pageState.fetchItems();
    }, []);

    return (
        <div>
            <ActionsPanel />
            {pageState.items.map((item) => 
                <Link to={`/templates/${item.ID}`}>{item.Name}</Link>
            )}

            <ExportModal />
        </div>
    )
});