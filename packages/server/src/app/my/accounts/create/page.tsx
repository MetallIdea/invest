import styles from './page.module.css';
import { db } from "common/src/data/db"
import { and, eq } from "drizzle-orm"
import { getUser, setUser } from "@/utils/user"
import { Button, Input } from "antd"
import { accounts } from 'common/src/entities/accounts';

export default function Login() {
    async function createInvoice(formData: FormData) {
        'use server'
        const user = await getUser();

        const userData = {
            name: formData.get('name') ?? '',
        }

        await db.insert(accounts).values({
            eq(accounts.name, userData.name.toString()),
            eq(accounts.userId, user.id)
    });
}

return <div className={styles.root}>
    <form className={styles.form} action={createInvoice}>
        <Input name={'login'} placeholder={'Логин'} type={'text'} />
        <Input name={'password'} placeholder="Пароль" type={'password'} />
        <Button type="primary" htmlType={'submit'}>Submit</Button>
    </form>
</div>
}