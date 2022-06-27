import {createReducer} from '@reduxjs/toolkit'
import {loginAsyncAction, registerAsyncAction} from "./auth.action-creators";
import {logoutAction} from "./auth.actions";

export interface AuthState {
    isLoggedIn: boolean
    loading: boolean
}

const initialState: AuthState = {
    isLoggedIn: !!localStorage.getItem('user'),
    loading: false,
}

export const authReducer = createReducer(initialState, builder => builder
    .addCase(loginAsyncAction.pending, (state, action) => {
        state.loading = true;
    })
    .addCase(loginAsyncAction.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.loading = false;
        localStorage.setItem('token', action.payload!.token);
        localStorage.setItem('user', JSON.stringify(action.payload!.user));
    })
    .addCase(loginAsyncAction.rejected, (state, action) => {
        state.loading = false;
    })
    .addCase(registerAsyncAction.pending, (state, action) => {
        state.loading = true;
    })
    .addCase(registerAsyncAction.fulfilled, (state, action) => {
        state.loading = false;
    })
    .addCase(registerAsyncAction.rejected, (state, action) => {
        state.loading = false;
    })
    .addCase(logoutAction.type, (state, action) => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        state.isLoggedIn = false;
    })
    .addDefaultCase((state, action) => {
        return state;
    })
);

export default authReducer