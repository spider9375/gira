import * as React from "react";
import {memo, useCallback, useEffect, useRef} from "react";
import {useDispatch} from "react-redux";
import {useLoadingProject, useProject} from "../../../store/projects/projects.hooks";
import {CircularProgress} from "@mui/material";
import {openOverlay} from "../../../store/overlays/overlays.actions";
import {useLocation, useParams} from "react-router-dom";
import {getProjectAsyncAction} from "../../../store/projects/projects.action-creators";

const Project = () => {
    const dispatch = useDispatch();
    const loading = useLoadingProject();
    const location = useLocation();
    const params = useParams();
    const project = useProject();
    const firstLoad = useRef(true);

    useEffect(() => {
        if (firstLoad?.current && location.pathname.includes('projects') && params.id !== project?.id) {
            dispatch(getProjectAsyncAction(params.id));
            firstLoad.current = false;
        }
    }, [location, params, dispatch, project])


    const openDrawer = useCallback(() => {
        dispatch(openOverlay());
    }, [dispatch]);

    return (<div>
        {loading && <CircularProgress/>}
        {!loading}
    </div>)
};

export default memo(Project);