import * as React from "react";
import {FC, FormEvent, memo, useCallback, useRef} from "react";
import {useDispatch} from "react-redux";
import {Button, Input, InputLabel} from "@mui/material";
import {loginAsyncAction} from "../../../store/auth/auth.action-creators";
import styles from './Login.module.scss';

const Login: FC<any> = () => {
    const dispatch = useDispatch();
    const username = useRef(null);
    const password = useRef(null);

    const login = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(loginAsyncAction({username: username.current!['value'], password: password.current!['value']}));
    }, [dispatch]);

    return (<div className={styles.container}>
        <form className={styles.form} onSubmit={login}>
            <h2>Login</h2>
            <>
                <InputLabel>Username</InputLabel>
                <Input inputRef={username}/>
            </>
            <>
                <InputLabel>Password</InputLabel>
                <Input inputRef={password} type='password'/>
            </>
            <Button type='submit'>Login</Button>
        </form>
    </div>)
}

export default memo(Login);