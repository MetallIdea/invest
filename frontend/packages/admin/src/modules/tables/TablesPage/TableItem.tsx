import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Link } from "react-router";
import type { NdTable } from "../types";
import { useTablesPageContext } from "./TablesPageState";

type Props = {
    table: NdTable;
}

export const TableItem = observer(({ table }: Props) => {
    const page = useTablesPageContext();

    const handleDelete = () => {
        page.deleteTable({ id: table.ID });
    }

    return (
        <div>
            <div>
                <Link to={`/tables/${table.ID}`}>{table.Name}</Link>
            </div>
            <div>
                <Button onClick={handleDelete} label="Удалить" />
            </div>
        </div>
    )
});