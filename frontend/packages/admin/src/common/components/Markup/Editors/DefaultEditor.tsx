import { InputText } from "primereact/inputtext";
import { InputLabel } from "../../formik/InputLabel/InputLabel";
import type { ChangeEvent } from "react";

type Props = {
    props: any;
    onChangeProps: (props: any) => void;
}

export function DefaultEditor({ props, onChangeProps }: Props) {
    const handleChange = (propName: string) => (e: ChangeEvent<HTMLInputElement>) => {
        onChangeProps({
            ...props,
            [propName]: e.target.value,
        });
    }

    return (
        <div>
            <InputLabel id="className" label="Класс">
                <InputText id="className" value={props['className']} onChange={handleChange('className')} />
            </InputLabel>
            <InputLabel id="text" label="Текст">
                <InputText id="text" value={props['text']} onChange={handleChange('text')} />
            </InputLabel>
        </div>
    )
}