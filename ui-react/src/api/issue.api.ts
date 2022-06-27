import {IIssue} from "../models";
import {HTTP} from "./http.api";


export const IssueApi = Object.freeze({
    getAll: (projectId: string, sprintId?: string): Promise<IIssue[]> =>
        HTTP.post<IIssue[]>(`projects/${projectId}/issues/filtered`, {sprint: sprintId}),
    update: (projectId: string, issueId: string, payload: Partial<IIssue>): Promise<void> =>
        HTTP.put(`projects/${projectId}/issues/${issueId}`, payload),
    create: (projectId: string, payload: IIssue): Promise<void> =>
        HTTP.post(`projects/${projectId}/issues`, payload),
    delete: (projectId: string, issueId: string): Promise<void> =>
        HTTP.delete(`projects/${projectId}/issues/${issueId}`),
})
