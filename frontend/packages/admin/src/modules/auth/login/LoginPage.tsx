import styles from './LoginPage.module.css';
import { LoginPageForm } from './LoginPageForm';
import { observer } from "mobx-react-lite";

export const LoginPage = observer(() => {
    console.log('LoginPage');

    return (
        <div className={styles.self}>
            <div>Login page</div>
            <LoginPageForm />
        </div>
    )
});