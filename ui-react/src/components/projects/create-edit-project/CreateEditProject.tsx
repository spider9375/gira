import {memo, MutableRefObject, useCallback, useEffect, useRef, useState} from "react";
import {Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField} from "@mui/material";
import {IProject, IUser} from "../../../models";
import {useLoadingProject, useProject} from "../../../store/projects/projects.hooks";
import {getProjectAsyncAction, updateProjectAsyncAction} from "../../../store/projects/projects.action-creators";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import styles from './CreateEditProject.module.scss'
import {UserApi} from "../../../api/user.api";

const CreateEditProject = () => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const project = useProject();
    const loading = useLoadingProject();
    const firstLoad = useRef(true);
    const formRef: MutableRefObject<HTMLFormElement | null> = useRef(null);
    const [state, setState] = useState<IProject>({
        name: '',
        description: '',
        team: [],
        deleted: false,
        managerId: '',
        id: '',
        issues: [],
        photo: '',
    });
    const [managers, setManagers] = useState<IUser[]>([]);
    const [developers, setDevelopers] = useState<IUser[]>([]);

    useEffect(() => {
        if (project) {
            setState(project);
        }
    }, [project])

    useEffect(() => {
        if (firstLoad.current) {
            if (params.id !== project?.id) {
                dispatch(getProjectAsyncAction(params.id))
            }
            firstLoad.current = false;
            UserApi.getUsers({role: 'manager'}).then((res) => setManagers(res));
            UserApi.getUsers({role: 'developer'}).then((res) => setDevelopers(res));
        }
    }, [dispatch, params.id, project]);

    const validations = {
        name: (value: string) => value.length > 3 && value.length < 128 && RegExp('^[a-zA-Z]+$').test(value)
    }

    const updateState = useCallback((e: { target: { value: any, name: string } }) => {
        setState(prev => ({...prev, [e.target.name]: e.target.value}));
    }, [])

    const submit = useCallback((e: any) => {
        e.preventDefault();
        const payload = state;
        payload.team = payload.team.filter(x => x);
        dispatch(updateProjectAsyncAction({projectId: project.id, payload}))
            .then(() => navigate(-1))
    }, [dispatch, navigate, project, state])

    const cancel = useCallback(() => {
        navigate(-1);
    }, [navigate])

    return <>
        {!loading ? <div>
            <form className={styles.form} onSubmit={submit} ref={formRef}>
                <FormControl>
                    <TextField value={state?.name} onChange={updateState} label='Name' name='name'/>
                    {/*<FormHelperText className={styles.error}>must be between 3 and 128 characters no special*/}
                    {/*    symbols</FormHelperText>*/}
                </FormControl>
                <FormControl>
                    <TextField name='description' value={state?.description} onChange={updateState}
                               label='Description'
                               id='description'/>
                </FormControl>
                <FormControl>
                    <InputLabel>Manager</InputLabel>
                    <Select
                        name="managerId"
                        value={state?.managerId}
                        onChange={updateState}
                        input={<OutlinedInput label="Manager"/>}
                    >
                        <MenuItem key={''} value={''}>None</MenuItem>
                        {managers.map((manager) => (
                            <MenuItem
                                key={manager.id}
                                value={manager.id}
                            >
                                {manager.firstName + ' ' + manager.lastName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel>Developers</InputLabel>
                    <Select
                        name="team"
                        multiple
                        value={state?.team}
                        onChange={updateState}
                        input={<OutlinedInput label="Developers"/>}
                    >
                        <MenuItem key={''} value={''}>None</MenuItem>
                        {developers.map((manager) => (
                            <MenuItem
                                key={manager.id}
                                value={manager.id}
                            >
                                {manager.firstName + ' ' + manager.lastName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button type='submit'>Submit</Button>
                <Button onClick={cancel} color='error'>Cancel</Button>
            </form>
        </div> : null}
    </>
};

export default memo(CreateEditProject);
