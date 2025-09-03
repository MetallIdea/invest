import { observer } from "mobx-react-lite";
import type { NdField } from "../types";
import { Button } from "primereact/button";
import { useTablesFormPageContext } from "./TablesFormPageState";
import { InputText } from "primereact/inputtext";

type Props = {
    field: Partial<NdField>;
}

export const FieldForm = observer(({ field }: Props) => {
    const page = useTablesFormPageContext();

    const handleDelete = () => {
        //page.deleteField({ id: field!.ID! });
    }

    const handleChangeName = (e) => {
        page.setEditField({
            ...field,
            Name: e.target.value,
        })
    }

    const handleChangeType = (e) => {
        page.setEditField({
            ...field,
            Type: e.target.value,
        })
    }

    const handleEdit = () => {
        page.setEditField(field);
    }

    const handleSave = () => {
        page.saveField({ field });
        page.setEditField(undefined)
    }

    const isEdit = page.editField?.ID === field.ID;

    return (
        <div>
            <div>
                {isEdit ? <InputText onChange={handleChangeName} value={field.Name} /> : field.Name}
            </div>
            <div>
                {isEdit ? <InputText onChange={handleChangeType} value={field.Type} /> : field.Type}
            </div>
            <div>
                {field.ID ?
                    <>
                        <Button
                            onClick={handleEdit}
                            label="Редактировать"
                        />
                        <Button
                            onClick={handleDelete}
                            label="Удалить"
                        />
                    </>
                    :
                    <Button
                        type="button"
                        onClick={handleSave}
                        label="Сохранить"
                    />}
            </div>
        </div>
    )
});