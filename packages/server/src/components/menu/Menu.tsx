import Link from "next/link";
import { memo } from "react";
import styles from './Menu.module.css';

export const Menu = memo(function Menu() {
    return (
        <div className={styles.root}>
            <Link className={styles.item} href='/'>
                Главная
            </Link>
            <Link className={styles.item} href='/shares'>
                Акции
            </Link>
            <Link className={styles.item} href='/params'>
                Параметры
            </Link>
            <Link className={styles.item} href='/my'>
                Профиль
            </Link>
        </div>
    )
});