import Drawer from "@mui/material/Drawer";
import * as React from "react";
import {memo, useCallback} from "react";
import {useIsProjectOverlayVisible} from "../../../store/overlays/overlays.hooks";
import {useDispatch} from "react-redux";
import {closeOverlay} from "../../../store/overlays/overlays.actions";
import {Button, Toolbar} from "@mui/material";
import styles from './ProjectOverlay.module.scss'
import {useLocation, useNavigate, useParams} from "react-router-dom";

const ProjectOverlay = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const open = useIsProjectOverlayVisible();
    const params = useParams();

    const closeHandler = useCallback(() => {
        dispatch(closeOverlay());
    }, [dispatch]);

    const navigateTo = useCallback((link: string) => () => {
        if (!location.pathname.includes(link)) {
            navigate(location.pathname + link);
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
            <Button>Active Sprint</Button>
            <Button>Sprints</Button>
        </Toolbar>
    </Drawer>
};

export default memo(ProjectOverlay);
