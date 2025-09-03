import { observer } from "mobx-react-lite";
import { TablesFormActions } from "./TablesFormActions";
import { useTablesFormPageContext } from "./TablesFormPageState";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { TablesFormFields } from "./TablesFormFields";
import { NDForm } from "../../../common/components/formik/NDForm/NDForm";
import { Button } from "primereact/button";

export const TablesFormPage = observer(() => {
    const page = useTablesFormPageContext();

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id && id !== 'new') {
            page.fetchItem({ id: parseInt(id) });
        }
    }, [id]);

    const handleSubmit = async (values) => {
        await page.saveTable({ table: values });

        navigate(`/tables/${page.table?.ID}`);
    }

    if (id !== 'new' && !page.table) {
        return <div>
            Not found
        </div>
    }

    return (
        <div>
            <TablesFormActions />

            <NDForm initialValues={page.table ?? page.emptyTable} onSubmit={handleSubmit}>
                <TablesFormFields />

                <Button type="submit" label="Сохранить" />
            </NDForm>
        </div>
    )
});
