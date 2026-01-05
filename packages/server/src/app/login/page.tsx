import styles from './page.module.css';
import { db } from "common/src/data/db"
import { users } from "common/src/entities/users"
import { and, eq } from "drizzle-orm"
import { setUser } from "common/src/utils/user"
import { Button, Input } from "antd"

export default function Login() {
    async function createInvoice(formData: FormData) {
        'use server'
        const userData = {
            login: formData.get('login') ?? '',
            password: formData.get('password') ?? '',
        }

        const [user] = await db.select().from(users).where(
            and(
                eq(users.login, userData.login.toString()),
                eq(users.password, userData.password.toString())
            )
        );

        if (user) {
            await setUser(user);
        }
    }

    return <div className={styles.root}>
        <form className={styles.form} action={createInvoice}>
            <Input name={'login'} placeholder={'Логин'} type={'text'} />
            <Input name={'password'} placeholder="Пароль" type={'password'} />
            <Button type="primary" htmlType={'submit'}>Submit</Button>
        </form>
    </div>
}