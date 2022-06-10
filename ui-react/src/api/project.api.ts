import axios from "axios";
import {IProject} from "../models";
import {HTTP} from "./http.api";

export const ProjectApi = Object.freeze({
    getAll: (): Promise<IProject[]> => axios.get<IProject[]>('projects').then(x => x.data),
    getOne: (projectId: string): Promise<IProject> =>
        HTTP.get<IProject>(`projects/${projectId}`),
    create: (project: IProject): Promise<void> =>
        HTTP.post('projects', project),
    delete: (projectId: string): Promise<void> =>
        HTTP.delete(`projects/${projectId}`),
})