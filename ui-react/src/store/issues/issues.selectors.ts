import {IIssue} from "../../models";
import {issuesContext} from "./issues.context";

export const selectIssues = (state: any): IIssue[] => state[issuesContext].issues;
export const selectLoadingIssues = (state: any): boolean => state[issuesContext].loadingIssues;

export const selectIssue = (state: any): IIssue => state[issuesContext].issue;
export const selectLoadingIssue = (state: any): boolean => state[issuesContext].loadingIssue;
