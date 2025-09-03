import { observer } from "mobx-react-lite";
import { TablesActions } from "./TablesActions";
import { useTablesPageContext } from "./TablesPageState";
import { useEffect } from "react";
import { Link } from "react-router";
import { Button } from "primereact/button";
import { TableItem } from "./TableItem";

export const TablesPage = observer(() => {
    const page = useTablesPageContext();

    useEffect(() => {
        page.fetchItems();
    }, []);

    return (
        <div>
            <TablesActions />

            <div>
                {page.tables.map((table) => (
                    <TableItem table={table} />
                ))}
            </div>
        </div>
    )
});
