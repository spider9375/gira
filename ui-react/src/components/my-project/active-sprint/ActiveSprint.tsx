import {memo, useCallback, useEffect, useRef, useState} from "react";
import {Status} from "../../../shared/status.enum";
import {useIssues} from "../../../store/issues/issues.hooks";
import {getProjectAsyncAction} from "../../../store/projects/projects.action-creators";
import {getAllIssuesAsyncAction} from "../../../store/issues/issues.action-creators";
import {useDispatch} from "react-redux";
import {useLocation, useParams} from "react-router-dom";
import {useProject} from "../../../store/projects/projects.hooks";
import {SprintApi} from "../../../api/sprint.api";
import styles from './ActiveSprint.module.scss'
import {IconButton, Menu, MenuItem} from "@mui/material";
import {MoreHoriz} from "@mui/icons-material";
import {IIssue, ISprint} from "../../../models";
import {IssueApi} from "../../../api/issue.api";

const ActiveSprint = () => {
    const issues = useIssues();
    const dispatch = useDispatch();
    const location = useLocation();
    const params = useParams();
    const project = useProject();
    const firstLoad = useRef(true);
    const [activeSprint, setActiveSprint] = useState<ISprint | null>(null);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (firstLoad?.current && location.pathname.includes('projects') && params.id !== project?.id) {
            dispatch(getProjectAsyncAction(params.id));
            firstLoad.current = false;
        }
    }, [location, params, dispatch, project])

    useEffect(() => {
        if (project) {
            SprintApi.getActiveSprint(project.id).then(sprint => {
                setActiveSprint(sprint);
            });
        }
    }, [project, dispatch])

    useEffect(() => {
        if (activeSprint) {
            dispatch(getAllIssuesAsyncAction(project.id, activeSprint.id))
        }
    }, [project, dispatch, activeSprint])

    const statuses = Object.keys(Status).filter(x => !['backlog', 'qa', 'closed'].includes(x));

    const moveHandler = useCallback((issue: IIssue, status: string) => () => {
        IssueApi.update(project.id, issue.id, Object.assign({}, issue, {status}))
            .then(() => dispatch(getAllIssuesAsyncAction(project.id, activeSprint!.id)))
        setAnchorEl(null);
    }, [project, activeSprint, dispatch])

    return <div>
        {activeSprint ? <>
            <h1 className={styles.title}>Active sprint</h1>
            <div className={styles.wrapper}>
                {statuses.map(x =>
                    <div className={styles.column} key={x}>
                        <h4>{Status[x]}</h4>
                        <ul className={styles.list}>
                            {issues.filter(i => i.status === x).map(i => <li className={styles.listItem} key={i.id}>
                                {i.title}
                                <IconButton onClick={handleClick}>
                                    <MoreHoriz/>
                                </IconButton>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <div className={styles.moveToTitle}>Move to</div>
                                    {statuses.filter(s => s !== x).map(s =>
                                        <MenuItem key={s} onClick={moveHandler(i, s)}>
                                            {Status[s]}
                                        </MenuItem>)}
                                </Menu>
                            </li>)}
                        </ul>
                    </div>)}
            </div>
        </> : <h1 className={styles.title}> No active sprint </h1>}
    </div>
}

export default memo(ActiveSprint);