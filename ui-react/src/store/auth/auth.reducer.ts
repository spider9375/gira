import {createReducer} from '@reduxjs/toolkit'
import {loginAsyncAction} from "./auth.action-creators";
import {logoutAction} from "./auth.actions";

export interface AuthState {
    isLoggedIn: boolean
}

const initialState: AuthState = {
    isLoggedIn: !!localStorage.getItem('user'),
}

export const authReducer = createReducer(initialState, builder => builder
    .addCase(loginAsyncAction.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        localStorage.setItem('token', action.payload!.token);
        localStorage.setItem('user', JSON.stringify(action.payload!.user));
    })
    .addCase(logoutAction.type, (state, action) => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return initialState;
    })
    .addDefaultCase((state, action) => {
        return initialState;
    })
);

export default authReducer