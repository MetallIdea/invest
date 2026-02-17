'use client';

import { Button, Input } from "antd";
import { CandleParams } from "common/src/entities/candlesParams";
import { submitForm } from './actions';
import { useFormik } from "formik";
import { useRouter } from "next/navigation";

type Props = {
    item?: CandleParams;
}

export function ParamsForm({ item }: Props) {
    const router = useRouter();

    const { values, handleSubmit, handleChange } = useFormik({
        initialValues: {
            id: item?.id,
            name: item?.name ?? '',
            order: item?.order ?? '',
            calculate: item?.calculate ?? '',
        },
        onSubmit: async (values) => {
            await submitForm(values);
            router.push('/params')
        },
    })
    return (<div>
        <form onSubmit={handleSubmit}>
            <Input type={'hidden'} name={'id'} value={item?.id} />
            <div>
                <Input name={'name'} value={values.name} onChange={handleChange} />
            </div>
            <div>
                <Input name={'order'} value={values.order} onChange={handleChange} />
            </div>
            <div>
                <Input.TextArea name={'calculate'} value={values.calculate} onChange={handleChange} />
            </div>
            <div>
                <Button htmlType='submit'>Сохранить</Button>
            </div>
        </form>
    </div>)
}