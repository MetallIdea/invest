import { InputText } from 'primereact/inputtext';
import styles from './LoginPageForm.module.css';

import { Button } from 'primereact/button';
import { observer } from 'mobx-react-lite';
import { useLoginPageContext } from './LoginPageState';
import { useNavigate } from 'react-router';
import { InputLabel } from '../../../common/components/formik/InputLabel/InputLabel';

export const LoginPageForm = observer(() =>  {
    const loginPageState = useLoginPageContext();
    
    const navigate = useNavigate();

    const handleSubmit = async  () => {
        const result = await loginPageState.submitForm();

        if (!result)  {
            return;
        }

        navigate('/');
    }

    return (
        <div className={styles.self}>
            <InputLabel id="username" label="Логин">
                <InputText id="username" value={loginPageState.login} onChange={(e) => loginPageState.setLogin(e.target?.value)} />
            </InputLabel>
            
            <InputLabel id="password" label="Пароль">
                <InputText id="password" value={loginPageState.password} onChange={(e) => loginPageState.setPassword(e.target?.value)} />
            </InputLabel>
            
            <Button label='Войти' onClick={handleSubmit} />
        </div>
    )
});