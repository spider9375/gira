import {createAsyncThunk} from "@reduxjs/toolkit";
import {AuthApi} from "../../api/auth.api";
import {ILoginModel, IRegisterModel} from "../../models";

export const loginAsyncAction: any = createAsyncThunk(
    'login',
    async (data: ILoginModel, {rejectWithValue}) => {
        try {
            return await AuthApi.login(data);
        } catch (err) {
            console.log(err);
        }
    }
);

export const registerAsyncAction: any = createAsyncThunk(
    'register',
    async (data: IRegisterModel, {rejectWithValue}) => {
        try {
            return await AuthApi.register(data);
        } catch (err) {
            console.log(err);
        }
    }
);