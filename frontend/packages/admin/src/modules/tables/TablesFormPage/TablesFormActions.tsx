import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { useTablesFormPageContext } from "./TablesFormPageState";

export const TablesFormActions = observer(() => {
    const page = useTablesFormPageContext();

    const handleCreate = () => {
        page.setEditField({});
    }

    return (
        <div>
            <Button onClick={handleCreate} label="Создать поле" />
        </div>
    )
});