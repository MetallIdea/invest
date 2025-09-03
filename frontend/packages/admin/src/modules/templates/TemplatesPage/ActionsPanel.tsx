import { observer } from "mobx-react-lite";
import { Button } from "primereact/button";
import { Link } from "react-router";
import { useTemplatesPageContext } from "./TemplatesPageState";

export const ActionsPanel = observer(() => {
    const pageState = useTemplatesPageContext();

    const handleExport = () =>  {
        pageState.setIsExportVisible(true);
    }

    return (
        <div>
            <Link to={'/templates/new'}>
                Создать
            </Link>
            <Button label="Экспорт" onClick={handleExport} />
        </div>
    )
})