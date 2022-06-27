import {createAction} from "@reduxjs/toolkit";
import {IUser} from "../../models";

export const setUserAction = createAction<IUser>('set-user')
export const resetUsersStoreAction = createAction('reset-user-store')