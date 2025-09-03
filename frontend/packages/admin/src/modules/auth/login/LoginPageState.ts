import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";

export class LoginPageState {
    login = '';

    password = '';

    constructor() {
        makeAutoObservable(this);
    }

    setLogin(value: string) {
        this.login = value;
    }

    setPassword(value: string) {
        this.password = value;
    }

    submitForm = async () => {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: this.login,
                password: this.password,
            })
        });

        if (!response.ok) {
            return null;
        }

        return response.json();
    }
}

export const LoginPageContext = createContext<LoginPageState>(new LoginPageState());

export function useLoginPageContext() {
    return useContext(LoginPageContext);
}