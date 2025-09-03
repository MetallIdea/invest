import { observer } from "mobx-react-lite";
import { NDInputText } from "../../../common/components/formik/NDInputText/NDInputText";
import { FieldForm } from "./FieldForm";
import { useTablesFormPageContext } from "./TablesFormPageState";

export const TablesFormFields = observer(() => {
    const page = useTablesFormPageContext();

    return (
        <div>
            <div>
                <NDInputText name="Name" label="Название" />
            </div>
            <div>
                {page.table?.Fields.map((field) => (
                    <FieldForm field={field} />
                ))}

                {
                    page.editField && page.editField.ID === undefined ? 
                    <FieldForm field={page.editField} /> : null
                }
            </div>
        </div>
    )
});