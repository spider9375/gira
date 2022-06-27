import {memo, useCallback, useEffect, useRef} from "react";
import {IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {useProjects} from "../../store/projects/projects.hooks";
import {Delete, Edit} from "@mui/icons-material";
import {getAllProjectsAsyncAction} from "../../store/projects/projects.action-creators";
import {useDispatch} from "react-redux";
import styles from './Projects.module.scss';
import {ProjectApi} from "../../api/project.api";
import {useNavigate} from "react-router-dom";
import {IProject} from "../../models";
import {setProjectAction} from "../../store/projects/projects.actions";

const Projects = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const projects = useProjects();

    const firstLoad = useRef(true);

    useEffect(() => {
        if (firstLoad.current) {
            dispatch(getAllProjectsAsyncAction())
            firstLoad.current = false;
        }
    }, [dispatch]);

    const deleteHandler = useCallback((projectId: string) => () => {
        ProjectApi.delete(projectId).then(() => dispatch(getAllProjectsAsyncAction()))
    }, [dispatch]);

    const editHandler = useCallback((project: IProject) => () => {
        dispatch(setProjectAction(project));
        navigate(project.id);
    }, [dispatch, navigate])

    return <div className={styles.container}>
        <h2>Projects</h2>
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {projects.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell>{row.description}</TableCell>
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
    </div>
}

export default memo(Projects);