import { setFilters, setSort } from "@/app-pages/HomePage/homeSlice";
import { useAppDispatch, useAppSelector } from "@/state/store";
import { Button, Input, Space } from "antd";
import { useFormik } from "formik"

type Values = {
    search: string;
    minProfit: string;
}

export function SharesFilter() {
    const dispatch = useAppDispatch();

    const { filters, sort } = useAppSelector(state => state.home);

    const { values, handleChange, handleSubmit } = useFormik<Values>({
        initialValues: {
            search: filters.search,
            minProfit: filters.minProfit ? filters.minProfit.toString() : '',
        },
        onSubmit: (values) => {
            dispatch(setFilters({
                search: values.search,
                minProfit: values.minProfit ? Number(values.minProfit) : undefined
            }));
        }
    });

    const handleClickPrice = () => {
        dispatch(setSort({ price: !sort.price }))
    }

    return (
        <Space vertical>
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
            <div>
                <div onClick={handleClickPrice}>Цена</div>
            </div>
        </Space>
    )
}