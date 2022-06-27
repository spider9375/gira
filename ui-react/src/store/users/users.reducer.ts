import {createReducer} from '@reduxjs/toolkit'
import {IUser} from "../../models";
import {getAllUsersAsyncAction, getUserAsyncAction} from "./users.action-creators";
import {resetUsersStoreAction, setUserAction} from "./users-actions";

export interface UsersState {
    users: IUser[],
    user: IUser | null,
    loadingUsers: boolean;
    loadingUser: boolean;
}

const initialState: UsersState = {
    loadingUsers: false,
    loadingUser: false,
    users: [],
    user: null
}

export const usersReducer = createReducer(initialState, builder => builder
    .addCase(getAllUsersAsyncAction.pending, (state, action) => {
        state.loadingUsers = true;
    })
    .addCase(getAllUsersAsyncAction.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loadingUsers = false;
        state.user = null;
    })
    .addCase(getUserAsyncAction.pending, (state, action) => {
        state.loadingUser = true;
    })
    .addCase(getUserAsyncAction.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loadingUser = false;
    })
    .addCase(setUserAction, (state, action) => {
        state.user = action.payload;
    })
    .addCase(resetUsersStoreAction, (state, action) => {
        return initialState;
    })
    .addDefaultCase((state, action) => {
        return state;
    })
);

export default usersReducer;