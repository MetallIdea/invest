import styles from './page.module.css';
import { db } from "common/src/data/db"
import { getUser } from "common/src/utils/user";
import { accounts } from 'common/src/entities/accounts';

export default function Login() {
    async function createInvoice(formData: FormData) {
        'use server'
        const user = await getUser();

        if (!user) {
            throw new Error('Не залогинены')
        }

        const userData = {
            name: formData.get('name')?.toString() ?? '',
        }

        await db.insert(accounts).values({
            accountId: '11',
            name: userData.name,
            userId: user.id!,
            money: 0,
        });
    }

    return <div className={styles.root}>
        <form className={styles.form} action={createInvoice}>
        </form>
    </div>
}