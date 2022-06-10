import {FC, memo, useCallback} from "react";
import {Button} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import styles from './Navigation.module.scss';
import {useIsLoggedIn} from "../../store/auth/auth.hooks";
import {useDispatch} from "react-redux";
import {logoutAction} from "../../store/auth/auth.actions";

const Navigation: FC<any> = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useIsLoggedIn();

    const logout = useCallback(() => {
        dispatch(logoutAction())
        navigate('../', {replace: true});
    }, [dispatch, navigate]);

    return <nav className={styles.navbar}>
        <ul className={styles.listItems}>
            {!isLoggedIn && (<div>
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
                  <li>
                    <Button><Link to='/recipe'>Publish Recipe</Link></Button>
                  </li>
                  <li>
                    <Button><Link to='/all-recipes'>All Recipes</Link></Button>
                  </li>
                  <li>
                    <Button><Link to='/recent-recipes'>Recent Recipes</Link></Button>
                  </li>
                  <li>
                    <Button><Link to='/users'>Users</Link></Button>
                  </li>
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