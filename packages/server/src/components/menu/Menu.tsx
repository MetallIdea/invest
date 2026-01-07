import Link from "next/link";
import { memo } from "react";
import styles from './Menu.module.css';

export const Menu = memo(function Menu() {
    return (
        <div className={styles.root}>
            <Link href='/'>
                Главная
            </Link>
        </div>
    )
});