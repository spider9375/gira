import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormHelperText,
    TextField
} from "@mui/material";
import styles from "../issue-dialog/IssueDialogl.module.scss";
import {FC, memo, useCallback, useMemo, useRef, useState} from "react";
import {useProject} from "../../../store/projects/projects.hooks";
import {ISprint} from "../../../models";

export interface ISprintDialogProps {
    sprint: ISprint | null;
    onClose: (x: ISprint | null) => void;
    open: boolean,
}

const SprintDialog: FC<ISprintDialogProps> = ({sprint, onClose, open}) => {
    const project = useProject();
    const formRef = useRef(null);

    const [state, setState] = useState<ISprint>(sprint ?? {
        id: '',
        title: '',
        isActive: false,
        project: project?.id,
        issues: [],
        deleted: false,
    });

    const updateState = useCallback((e: { target: { value: any, name: string } }) => {
        setState(prev => ({...prev, [e.target.name]: e.target.value}));
    }, [])

    const closeHandler = useCallback((submit: boolean) => () => {
        onClose(submit ? state : null);
    }, [onClose, state]);

    const isTitleInvalid = useMemo(() => {
        return state.title.length < 3 || state.title.length > 128 || !new RegExp(/^[a-zA-Z0-9 ]*$/).test(state.title);
    }, [state])

    return <Dialog open={open} onClose={closeHandler(false)}>
        <DialogTitle>{sprint ? 'Edit issue' : 'Create issue'}</DialogTitle>
        <DialogContent>
            <form className={styles.form} ref={formRef}>
                <FormControl>
                    <TextField value={state?.title} onChange={updateState} label='Title' name='title'/>
                    {isTitleInvalid &&
                      <FormHelperText className={styles.error}>must be between 3 and 128 characters no special
                        symbols</FormHelperText>}
                </FormControl>
                <FormControlLabel control={<Checkbox checked={state?.isActive}
                                                     onChange={(e) => setState(prev => ({
                                                         ...prev,
                                                         isActive: e.target.checked
                                                     }))}/>}
                                  label="Is Active"/>
            </form>
        </DialogContent>
        <DialogActions>
            <Button onClick={closeHandler(true)}>Submit</Button>
            <Button onClick={closeHandler(false)}>Cancel</Button>
        </DialogActions>
    </Dialog>
}

export default memo(SprintDialog);