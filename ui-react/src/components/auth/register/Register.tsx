import * as React from "react";
import {FormEvent, memo, useCallback, useState} from "react";
import styles from './Register.module.scss'
import {Button, FormControl, TextField} from "@mui/material";
import {IRegisterModel} from "../../../models";
import {registerAsyncAction} from "../../../store/auth/auth.action-creators";
import {useDispatch} from "react-redux";
import {useUser} from "../../../store/users/users.hooks";

const Register = () => {
    const dispatch = useDispatch();
    const user = useUser();
    const [state, setState] = useState<IRegisterModel>({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
    });

    const register = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(registerAsyncAction(state));
    }, [dispatch, state]);

    const updateState = useCallback((e: { target: { value: any, name: string } }) => {
        setState(prev => ({...prev, [e.target.name]: e.target.value}));
    }, [])

    return (<div className={styles.container}>
        <form className={styles.form} onSubmit={register}>
            <h2>Register</h2>
            <FormControl>
                <TextField value={state?.firstName} onChange={updateState} label='First Name' name='firstName'/>
            </FormControl>
            <FormControl>
                <TextField value={state?.lastName} onChange={updateState} label='Last Name' name='lastName'/>
            </FormControl>
            <FormControl>
                <TextField value={state?.username} onChange={updateState} label='Username' name='username'/>
            </FormControl>
            <FormControl>
                <TextField value={state?.email} onChange={updateState} label='Email' name='email'/>
            </FormControl>
            <FormControl>
                <TextField type='password' value={state?.password} onChange={updateState} label='Password'
                           name='password'/>
            </FormControl>
            <Button type='submit'>Register</Button>
        </form>
    </div>)
}

export default memo(Register);