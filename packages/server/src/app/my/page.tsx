import styles from "./page.module.css";

import { db } from "common/src/data/db";
import { accounts } from "common/src/entities/accounts";
import { eq } from "drizzle-orm";
import { getUser } from "common/src/utils/user";
import Link from "next/link";

export default async function MyPage() {
    const user = await getUser();

    if (!user) {
        throw new Error('User not auth')
    }

    const allAccounts = await db.select().from(accounts).where(eq(accounts.id, user.id));

    return (
        <div className={styles.root}>
            <div><Link href={'/my/accounts/create'}>Создать</Link></div>
            {allAccounts.map((account) => (
                <div key={account.id}>
                    {account.name}
                </div>
            ))}
        </div>
    );
}
