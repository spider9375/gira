import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField
} from "@mui/material"
import {FC, memo, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useIssue} from "../../../store/issues/issues.hooks";
import styles from "./IssueDialogl.module.scss";
import {IIssue, ISprint, IUser} from "../../../models";
import {UserApi} from "../../../api/user.api";
import {SprintApi} from "../../../api/sprint.api";
import {useProject} from "../../../store/projects/projects.hooks";
import {Status} from "../../../shared/status.enum";

interface IssueDialogProps {
    open: boolean,
    onClose: (issue: IIssue | null) => void
}

const IssueDialog: FC<IssueDialogProps> = ({open = false, onClose}) => {
    const issue = useIssue();
    const project = useProject();
    const formRef = useRef(null);

    const [state, setState] = useState<IIssue>({
        title: '',
        description: '',
        assignedTo: '',
        deleted: false,
        id: '',
        storyPoints: 0,
        project: '',
        sprint: '',
        status: '',
        addedBy: '',
    });
    const [developers, setDevelopers] = useState<IUser[]>([]);
    const [sprints, setSprints] = useState<ISprint[]>([]);
    const statuses = useMemo(() => Object.keys(Status).map((key) => ({value: key, label: Status[key]})), [])

    useEffect(() => {
        if (issue) {
            setState(issue);
        }
    }, [issue])

    useEffect(() => {
        UserApi.getUsers({role: 'developer'}).then((res) => setDevelopers(res));
        SprintApi.getAllSprints(project.id).then((res) => setSprints(res))
    }, [project])

    const updateState = useCallback((e: { target: { value: any, name: string } }) => {
        setState(prev => ({...prev, [e.target.name]: e.target.value}));
    }, [])

    const closeHandler = useCallback((submit: boolean) => () => {
        onClose(submit ? state : null);
    }, [onClose, state]);

    return <Dialog open={open} onClose={closeHandler(false)}>
        <DialogTitle>{issue ? 'Edit issue' : 'Create issue'}</DialogTitle>
        <DialogContent>
            <form className={styles.form} ref={formRef}>
                <FormControl>
                    <TextField value={state?.title} onChange={updateState} label='Title' name='title'/>
                    {/*<FormHelperText className={styles.error}>must be between 3 and 128 characters no special*/}
                    {/*    symbols</FormHelperText>*/}
                </FormControl>
                <FormControl>
                    <TextField name='description' value={state?.description} onChange={updateState}
                               label='Description'
                               id='description'/>
                </FormControl>
                <FormControl>
                    <InputLabel>Assigned To</InputLabel>
                    <Select
                        name="assignedTo"
                        value={state?.assignedTo}
                        onChange={updateState}
                        input={<OutlinedInput label="Assigned To"/>}
                    >
                        {developers.map((developer) => (
                            <MenuItem
                                key={developer.id}
                                value={developer.id}
                            >
                                {developer.firstName + ' ' + developer.lastName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel>Sprint</InputLabel>
                    <Select
                        name="team"
                        value={state?.sprint}
                        onChange={updateState}
                        input={<OutlinedInput label="Sprint"/>}
                    >
                        {sprints.map((sprint) => (
                            <MenuItem
                                key={sprint.id}
                                value={sprint.id}
                            >
                                {sprint.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <TextField name='storyPoints' type='number' value={state?.storyPoints} onChange={updateState}
                               label='Story points'
                               id='description'/>
                </FormControl>
                <FormControl>
                    <InputLabel>Status</InputLabel>
                    <Select
                        name="status"
                        value={state?.status}
                        onChange={updateState}
                        input={<OutlinedInput label="Status"/>}
                    >
                        {statuses.map((status) => (
                            <MenuItem
                                key={status.value}
                                value={status.value}
                            >
                                {status.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </form>
        </DialogContent>
        <DialogActions>
            <Button onClick={closeHandler(true)}>Submit</Button>
            <Button onClick={closeHandler(false)}>Cancel</Button>
        </DialogActions>
    </Dialog>
}

export default memo(IssueDialog)