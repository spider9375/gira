import {FC, memo, useCallback} from "react";
import {Button, IconButton} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import styles from './Navigation.module.scss';
import {useIsLoggedIn} from "../../store/auth/auth.hooks";
import {useDispatch} from "react-redux";
import {logoutAction} from "../../store/auth/auth.actions";
import MenuIcon from '@mui/icons-material/Menu';
import {openOverlay} from "../../store/overlays/overlays.actions";
import {useProject} from "../../store/projects/projects.hooks";
import {resetProjectStoreAction} from "../../store/projects/projects.actions";

const Navigation: FC<any> = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useIsLoggedIn();
    const project = useProject();

    const logout = useCallback(() => {
        dispatch(logoutAction())
        dispatch(resetProjectStoreAction())
        navigate('../', {replace: true});
    }, [dispatch, navigate]);

    const openMenuOverlay = useCallback(() => {
        dispatch(openOverlay());
    }, [dispatch]);

    return <nav className={styles.navbar}>
        <ul className={styles.listItems}>
            {!isLoggedIn && (<div className={styles.row}>
                <li>
                    <Button><Link to='/register'>Register</Link></Button>
                </li>
                <li>
                    <Button><Link to='/login'>Login</Link></Button>
                </li>
            </div>)}
            {isLoggedIn &&
              <>
                <div className={styles.left}>
                    {project &&
                      <li>
                        <IconButton onClick={openMenuOverlay}><MenuIcon/></IconButton>
                      </li>}
                  <li>
                    <Button><Link to='/my-projects'>My Projects</Link></Button>
                  </li>
                  <li>
                    <Button><Link to='/projects'>Projects</Link></Button>
                  </li>
                  <li>
                    <Button><Link to='/users'>Users</Link></Button>
                  </li>
                    {/*<li>*/}
                    {/*  <Button><Link to='/recent-recipes'>Recent Recipes</Link></Button>*/}
                    {/*</li>*/}
                    {/*<li>*/}
                    {/*  <Button><Link to='/users'>Users</Link></Button>*/}
                    {/*</li>*/}
                </div>
                <div className={styles.right}>
                  <li>
                    <Button variant='outlined' color="error" onClick={logout}>Logout</Button>
                  </li>
                </div>
              </>
            }
        </ul>
    </nav>
}

export default memo(Navigation);