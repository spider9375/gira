import {memo, useCallback, useEffect, useRef} from "react";
import styles from "../../projects/Projects.module.scss";
import {IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useUsers} from "../../../store/users/users.hooks";
import {getAllUsersAsyncAction} from "../../../store/users/users.action-creators";
import {UserApi} from "../../../api/user.api";
import {IUser} from "../../../models";
import {setUserAction} from "../../../store/users/users-actions";

const Users = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const users = useUsers();

    const firstLoad = useRef(true);

    useEffect(() => {
        if (firstLoad.current) {
            dispatch(getAllUsersAsyncAction())
            firstLoad.current = false;
        }
    }, [dispatch]);

    const deleteHandler = useCallback((userId: string) => () => {
        UserApi.delete(userId).then(() => dispatch(getAllUsersAsyncAction()))
    }, [dispatch]);

    const editHandler = useCallback((user: IUser) => () => {
        dispatch(setUserAction(user));
        navigate(user.id);
    }, [dispatch, navigate])

    return <div className={styles.container}>
        <h2>Users</h2>
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Username</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row">
                                {row.username}
                            </TableCell>
                            <TableCell>{row.firstName + ' ' + row.lastName}</TableCell>
                            <TableCell>{row.email}</TableCell>
                            <TableCell>
                                {row.role}
                            </TableCell>
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

export default memo(Users);