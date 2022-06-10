import {createAsyncThunk} from "@reduxjs/toolkit";
import {AuthApi} from "../../api/auth.api";
import {ILoginModel} from "../../models";

export const loginAsyncAction: any = createAsyncThunk(
    'login',
    async (data: ILoginModel , {rejectWithValue}) => {
        try {
            return await AuthApi.login(data);
        } catch (err) {
            console.log(err);
        }
    }
);