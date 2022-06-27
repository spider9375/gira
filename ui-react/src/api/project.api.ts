import {IProject} from "../models";
import {HTTP} from "./http.api";

export const ProjectApi = Object.freeze({
    getAll: (): Promise<IProject[]> => HTTP.get<IProject[]>('projects'),
    getOne: (projectId: string): Promise<IProject> => HTTP.get<IProject>(`projects/${projectId}`),
    create: (project: IProject): Promise<void> => HTTP.post('projects', project),
    update: (projectId: string, payload: IProject): Promise<void> => HTTP.put(`projects/${projectId}`, payload),
    delete: (projectId: string): Promise<void> => HTTP.delete(`projects/${projectId}`),
})