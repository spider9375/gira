import {memo, useCallback, useEffect, useRef} from "react";
import {useLoadingProjects, useProjects} from "../../../store/projects/projects.hooks";
import {useDispatch} from "react-redux";
import {getAllProjectsAsyncAction} from "../../../store/projects/projects.action-creators";
import {CircularProgress} from "@mui/material";
import styles from './MyProjects.module.scss'
import {useNavigate} from "react-router-dom";
import {IProject} from "../../../models";
import {resetProjectStoreAction, setProjectAction} from "../../../store/projects/projects.actions";
import {resetIssueStoreAction} from "../../../store/issues/issues.actions";

const MyProjects = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const projects = useProjects();
    const loadingProjects = useLoadingProjects();
    const firstLoad = useRef(true);

    useEffect(() => {
        if (!firstLoad.current) {
            dispatch(getAllProjectsAsyncAction())
        }
    }, [dispatch]);

    useEffect(() => {
        firstLoad.current = false
    }, []);

    const openProject = useCallback((project: IProject) => () => {
        dispatch(resetProjectStoreAction());
        dispatch(resetIssueStoreAction());
        dispatch(setProjectAction(project));
        navigate(project.id + '/active-sprint');
    }, [dispatch, navigate]);

    return (<div className={styles.container}>
        {loadingProjects && <CircularProgress/>}
        {!loadingProjects && projects.map(project => <div onClick={openProject(project)} className={styles.projectCard}
                                                          key={project.id}>
            <span>{project.name}</span>
        </div>)}
    </div>)
};

export default memo(MyProjects);