import { Button, Input, Space } from "antd";
import { useFormik } from "formik"

type Props = {
    onSubmit: (value: any) => void
}

export function SharesFilter({ onSubmit }: Props) {
    const { values, handleChange, handleSubmit } = useFormik({
        initialValues: {
            search: '',
            minProfit: '',
        },
        onSubmit: (values) => {
            onSubmit(values);
        }
    })
    return (
        <form onSubmit={handleSubmit}>
            <Space vertical={true}>
                <Space.Compact>
                    <Space.Addon>Найти</Space.Addon>
                    <Input name={'search'} value={values.search} onChange={handleChange} />
                </Space.Compact>
                <Space.Compact>
                    <Space.Addon>Рост больше %</Space.Addon>
                    <Input name={'minProfit'} value={values.minProfit} onChange={handleChange} />
                </Space.Compact>
                <Button htmlType={'submit'}>Поиск</Button>
            </Space>
        </form>
    )
}