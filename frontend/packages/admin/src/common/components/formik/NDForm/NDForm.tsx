import { Form, Formik, type FormikHelpers } from "formik"
import type { PropsWithChildren } from "react"

type Props = PropsWithChildren & {
    initialValues: any;
    onSubmit: (values: any, helpers: FormikHelpers<any>) => void;
}

export const NDForm = ({ initialValues, onSubmit, children }: Props) => {
    return (
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
            <Form>
                {children}
            </Form>
        </Formik>
    )
}