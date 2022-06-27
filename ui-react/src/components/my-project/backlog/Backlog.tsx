import {memo, useCallback, useEffect, useRef, useState} from "react";
import {useLocation, useParams} from "react-router-dom";
import {useProject} from "../../../store/projects/projects.hooks";
import {getProjectAsyncAction} from "../../../store/projects/projects.action-creators";
import {useDispatch} from "react-redux";
import styles from "./Backlog.module.scss";
import {
    CircularProgress,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import {useIssues, useLoadingIssues} from "../../../store/issues/issues.hooks";
import {getAllIssuesAsyncAction, updateIssueAsyncAction} from "../../../store/issues/issues.action-creators";
import {IIssue} from "../../../models";
import {IssueApi} from "../../../api/issue.api";
import {setIssueAction} from "../../../store/issues/issues.actions";
import IssueDialog from "../issue-dialog/IssueDialog";
import {Status} from "../../../shared/status.enum";

const Backlog = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const params = useParams();
    const project = useProject();
    const firstLoad = useRef(true);
    const [open, setOpen] = useState(false);
    const loading = useLoadingIssues();

    const issues: IIssue[] = useIssues();

    useEffect(() => {
        if (firstLoad?.current && location.pathname.includes('projects') && params.id !== project?.id) {
            dispatch(getProjectAsyncAction(params.id));
            firstLoad.current = false;
        }
    }, [location, params, dispatch, project])

    useEffect(() => {
        if (project) {
            dispatch(getAllIssuesAsyncAction(project.id))
        }
    }, [project, dispatch])

    const deleteHandler = useCallback((issueId: string) => () => {
        IssueApi.delete(project.id, issueId).then(() => dispatch(getAllIssuesAsyncAction(project.id)))
    }, [dispatch, project]);

    const editHandler = useCallback((issue: IIssue) => () => {
        dispatch(setIssueAction(issue));
        setOpen(true);
    }, [dispatch])

    const dialogCloseHandler = useCallback((issue: IIssue | null) => {
        setOpen(false);
        if (issue) {
            dispatch(updateIssueAsyncAction({projectId: project.id, issueId: issue.id, payload: issue}))
                .then(() => dispatch(getAllIssuesAsyncAction(project.id)))
        }
    }, [dispatch, project])

    return <div className={styles.container}>
        <h2>Backlog</h2>
        {loading ? <CircularProgress/> : <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {issues.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row">
                                {row.title}
                            </TableCell>
                            <TableCell>{row.description}</TableCell>
                            <TableCell>{Status[row.status]}</TableCell>
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
        </TableContainer>}
        <IssueDialog onClose={dialogCloseHandler} open={open}/>
    </div>
}

export default memo(Backlog);