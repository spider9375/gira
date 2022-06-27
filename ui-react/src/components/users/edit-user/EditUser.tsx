import * as React from "react";
import {memo, MutableRefObject, useCallback, useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {IUser} from "../../../models";
import styles from "./EditUser.module.scss";
import {Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField} from "@mui/material";
import {useLoadingUser, useUser} from "../../../store/users/users.hooks";
import {RolesDict} from "../../../shared/roles.dict";
import {getUserAsyncAction, updateUserAsyncAction} from "../../../store/users/users.action-creators";

const EditUser = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const loading = useLoadingUser();
    const navigate = useNavigate();
    const user = useUser();
    const firstLoad = useRef(true);
    const formRef: MutableRefObject<HTMLFormElement | null> = useRef(null);
    const [state, setState] = useState<Partial<IUser>>({
        firstName: '',
        lastName: '',
        username: '',
        role: '',
        email: '',
    });

    useEffect(() => {
        if (user) {
            setState(user);
        }
    }, [user])

    useEffect(() => {
        if (firstLoad.current) {
            if (params.id !== user?.id) {
                dispatch(getUserAsyncAction(params.id))
                firstLoad.current = false;
            }
        }
    }, [dispatch, params.id, user]);

    const validations = {
        name: (value: string) => value.length > 3 && value.length < 128 && RegExp('^[a-zA-Z]+$').test(value)
    }

    const updateState = useCallback((e: { target: { value: any, name: string } }) => {
        setState(prev => ({...prev, [e.target.name]: e.target.value}));
    }, [])

    const submit = useCallback((e: any) => {
        e.preventDefault();
        dispatch(updateUserAsyncAction({userId: user.id, payload: state}))
            .then(() => navigate(-1))
    }, [dispatch, user, state, navigate]);

    return (<div className={styles.container}>
        <form className={styles.form} onSubmit={submit}>
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
                <InputLabel>Roles</InputLabel>
                <Select
                    name="role"
                    value={state?.role}
                    onChange={updateState}
                    input={<OutlinedInput label="Role"/>}
                >
                    {Object.keys(RolesDict).map((role) => (
                        <MenuItem
                            key={role}
                            value={role}
                        >
                            {RolesDict[role]}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button type='submit'>Submit</Button>
        </form>
    </div>)
}

export default memo(EditUser)
