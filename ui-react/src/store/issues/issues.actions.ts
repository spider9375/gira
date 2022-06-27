import {createAction} from "@reduxjs/toolkit";
import {IIssue} from "../../models";

export const setIssueAction = createAction<IIssue>('set-issue')
export const resetIssueStoreAction = createAction('reset-issue-store')