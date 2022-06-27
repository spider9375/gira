import {createReducer} from '@reduxjs/toolkit'
import {IIssue} from "../../models";
import {getAllIssuesAsyncAction} from "./issues.action-creators";
import {resetIssueStoreAction, setIssueAction} from "./issues.actions";

export interface IssuesState {
    issues: IIssue[],
    issue: IIssue | null,
    loadingIssues: boolean;
    loadingIssue: boolean;
}

const initialState: IssuesState = {
    loadingIssues: false,
    loadingIssue: false,
    issues: [],
    issue: null
}

export const issuesReducer = createReducer(initialState, builder => builder
    .addCase(getAllIssuesAsyncAction.pending, (state, action) => {
        state.loadingIssues = true;
    })
    .addCase(getAllIssuesAsyncAction.fulfilled, (state, action) => {
        state.issues = action.payload;
        state.loadingIssues = false;
        state.issue = null;
    })
    .addCase(setIssueAction, (state, action) => {
        state.issue = action.payload;
    })
    .addCase(resetIssueStoreAction, (state, action) => {
        return initialState;
    })
    .addDefaultCase((state, action) => {
        return state;
    })
);

export default issuesReducer;