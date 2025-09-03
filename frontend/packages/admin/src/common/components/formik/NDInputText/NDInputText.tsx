import { InputText } from "primereact/inputtext";
import { InputLabel } from "../InputLabel/InputLabel";
import { useField } from 'formik';

type Props = {
    name: string;
    label: string;
}

export const NDInputText = ({ name, label }: Props) => {
    const [input] = useField(name);
    return (
        <InputLabel id={name} label={label}>
            <InputText id={name} name={name}
                onChange={input.onChange} onBlur={input.onBlur} value={input.value} />
        </InputLabel>
    )
}