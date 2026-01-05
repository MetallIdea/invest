import styles from './not-found.module.css'

export default function NotFound() {
    return (
        <div className={styles.root}>
            <h2>Тут ничего нет</h2>
            <p>Не можем найти то, что вы хотели</p>
        </div>
    );
}