import {memo, useCallback, useEffect, useRef, useState} from "react";
import styles from "./Sprints.module.scss";
import {
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import {Check, Close, Delete, Edit} from "@mui/icons-material";
import {useProject} from "../../../store/projects/projects.hooks";
import {getProjectAsyncAction} from "../../../store/projects/projects.action-creators";
import {SprintApi} from "../../../api/sprint.api";
import {useDispatch} from "react-redux";
import {useLocation, useParams} from "react-router-dom";
import {ISprint} from "../../../models";
import SprintDialog from "../sprint-dialog/SprintDialog";

const Sprints = () => {
    const [sprints, setSprints] = useState<ISprint[]>([]);

    const dispatch = useDispatch();
    const location = useLocation();
    const params = useParams();
    const project = useProject();
    const firstLoad = useRef(true);
    const [sprint, setSprint] = useState<ISprint | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (firstLoad?.current && location.pathname.includes('projects') && params.id !== project?.id) {
            dispatch(getProjectAsyncAction(params.id));
            firstLoad.current = false;
        }
    }, [location, params, dispatch, project])

    useEffect(() => {
        if (project) {
            SprintApi.getAllSprints(project.id).then(sprints => setSprints(sprints));
        }
    }, [project]);

    const editHandler = useCallback((sprint: ISprint) => () => {
        setSprint(sprint);
        setOpen(true);
    }, [])

    const deleteHandler = useCallback((sprintId: string) => () => {
        SprintApi.deleteSprint(project.id, sprintId).then(() => SprintApi.getAllSprints(project.id).then(sprints => setSprints(sprints)))
    }, [project])

    const dialogCloseHandler = useCallback((sprint: ISprint | null) => {
        if (sprint) {
            if (sprint.id) {
                SprintApi.update(project.id, sprint).then(() => SprintApi.getAllSprints(project.id).then(sprints => setSprints(sprints)))
            } else {
                SprintApi.create(project.id, sprint).then(() => SprintApi.getAllSprints(project.id).then(sprints => setSprints(sprints)))
            }
        }

        setSprint(null);
        setOpen(false);
    }, [project])

    return <div className={styles.container}>
        <h2>Projects</h2>
        <Button onClick={() => setOpen(true)}>Create</Button>
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Active</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sprints.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row">
                                {row.title}
                            </TableCell>
                            <TableCell>{row.isActive ? <Check/> : <Close/>}</TableCell>
                            <TableCell>
                                {
                                    <IconButton onClick={editHandler(row)}><Edit/></IconButton>
                                }
                                {
                                    <IconButton onClick={deleteHandler(row.id)}><Delete/></IconButton>
                                }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        {open && <SprintDialog sprint={sprint} onClose={dialogCloseHandler} open={open}/>}
    </div>
}

export default memo(Sprints);