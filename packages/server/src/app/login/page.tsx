import { Button, Input } from "@vkontakte/vkui"
import { db } from "common/data/db"
import { users } from "common/entities/users"
import { and, eq } from "drizzle-orm"
import { setUser } from "@/utils/user"

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
        )
        setUser(user);
    }

    return <form action={createInvoice}>
        <Input name={'login'} type={'text'} />
        <Input name={'password'} type={'password'} />
        <Button type={'submit'} />
    </form>
}