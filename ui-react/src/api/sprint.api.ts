import {ISprint} from "../models";
import {HTTP} from "./http.api";

export const SprintApi = Object.freeze({
    getActiveSprint: (projectId: string): Promise<ISprint> =>
        HTTP.get<ISprint>(`projects/${projectId}/sprints/active`),
    getAllSprints: (projectId: string): Promise<ISprint[]> =>
        HTTP.get<ISprint[]>(`projects/${projectId}/sprints`),
    create: (projectId: string, payload: ISprint): Promise<void> =>
        HTTP.post(`projects/${projectId}/sprints`, payload),
    update: (projectId: string, payload: ISprint): Promise<void> =>
        HTTP.put(`projects/${projectId}/sprints/${payload.id}`, payload),
    deleteSprint: (projectId: string, sprintId: string): Promise<void> =>
        HTTP.delete(`projects/${projectId}/sprints/${sprintId}`),
})