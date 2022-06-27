import {useSelector} from "react-redux";
import {selectLoadingUser, selectLoadingUsers, selectUser, selectUsers} from "./users.selectors";

export const useUser = () => useSelector((state) => selectUser(state));
export const useLoadingUser = () => useSelector((state) => selectLoadingUser(state));

export const useUsers = () => useSelector((state) => selectUsers(state));
export const useLoadingUsers = () => useSelector((state) => selectLoadingUsers(state));
