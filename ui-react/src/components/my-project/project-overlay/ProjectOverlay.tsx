import Drawer from "@mui/material/Drawer";
import * as React from "react";
import {memo, useCallback} from "react";
import {useIsProjectOverlayVisible} from "../../../store/overlays/overlays.hooks";
import {useDispatch} from "react-redux";
import {closeOverlay} from "../../../store/overlays/overlays.actions";
import {Button, Toolbar} from "@mui/material";
import styles from './ProjectOverlay.module.scss'
import {useLocation, useNavigate} from "react-router-dom";

const ProjectOverlay = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const open = useIsProjectOverlayVisible();

    const closeHandler = useCallback(() => {
        dispatch(closeOverlay());
    }, [dispatch]);

    const navigateTo = useCallback((link: string) => () => {
        if (!location.pathname.includes(link)) {
            navigate(location.pathname.split('/').slice(0, -1).join('/') + link);
        }

        dispatch(closeOverlay());
    }, [navigate, location, dispatch]);

    return <Drawer
        anchor={'left'}
        open={open}
        onClose={closeHandler}
    >
        <Toolbar className={styles.toolbar}>
            <Button onClick={navigateTo('/backlog')}>Backlog</Button>
            <Button onClick={navigateTo('/active-sprint')}>Active Sprint</Button>
            <Button onClick={navigateTo('/sprints')}>Sprints</Button>
        </Toolbar>
    </Drawer>
};

export default memo(ProjectOverlay);
