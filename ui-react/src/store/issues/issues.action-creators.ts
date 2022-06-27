import {createAsyncThunk} from "@reduxjs/toolkit";
import {IssueApi} from "../../api/issue.api";
import {IIssue} from "../../models";

export interface IUpdateIssuePayload {
    projectId: string
    issueId: string
    payload: Partial<IIssue>
}

export const getAllIssuesAsyncAction: any = createAsyncThunk(
    'get-all-issues',
    async (projectId: string) => {
        try {
            return await IssueApi.getAll(projectId);
        } catch (err) {
            console.log(err);
        }
    }
);

export const updateIssueAsyncAction: any = createAsyncThunk(
    'update-issue',
    async (data: IUpdateIssuePayload) => {
        try {
            return await IssueApi.update(data.projectId, data.issueId, data.payload);
        } catch (err) {
            console.log(err);
        }
    }
);
