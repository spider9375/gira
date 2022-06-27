import {createAsyncThunk} from "@reduxjs/toolkit";
import {ProjectApi} from "../../api/project.api";
import {IProject} from "../../models";

export interface IUpdateProjectPayload {
    projectId: string;
    payload: IProject
}


export const getAllProjectsAsyncAction: any = createAsyncThunk(
    'get-all-projects',
    async () => {
        try {
            return await ProjectApi.getAll();
        } catch (err) {
            console.log(err);
        }
    }
);

export const getProjectAsyncAction: any = createAsyncThunk(
    'get-project',
    async (projectId: string, {rejectWithValue}) => {
        try {
            return await ProjectApi.getOne(projectId);
        } catch (err) {
            console.log(err);
            rejectWithValue(err);
        }
    }
);

export const updateProjectAsyncAction: any = createAsyncThunk(
    'update-project',
    async (data: IUpdateProjectPayload, {rejectWithValue}) => {
        try {
            return await ProjectApi.update(data.projectId, data.payload);
        } catch (err) {
            console.log(err);
            rejectWithValue(err);
        }
    }
);