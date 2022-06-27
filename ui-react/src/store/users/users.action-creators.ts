import {createAsyncThunk} from "@reduxjs/toolkit";
import {UserApi} from "../../api/user.api";
import {IUser} from "../../models";

export interface IUpdateUserActionPayload {
    userId: string
    payload: IUser
}

export const getAllUsersAsyncAction: any = createAsyncThunk(
    'get-all-users',
    async () => {
        try {
            return await UserApi.getUsers();
        } catch (err) {
            console.log(err);
        }
    }
);

export const getUserAsyncAction: any = createAsyncThunk(
    'get-user',
    async (userId: string, {rejectWithValue}) => {
        try {
            return await UserApi.getUser(userId);
        } catch (err) {
            console.log(err);
            rejectWithValue(err);
        }
    }
);

export const updateUserAsyncAction: any = createAsyncThunk(
    'update-user',
    async (data: IUpdateUserActionPayload, {rejectWithValue}) => {
        try {
            return await UserApi.update(data.userId, data.payload);
        } catch (err) {
            console.log(err);
            rejectWithValue(err);
        }
    }
);