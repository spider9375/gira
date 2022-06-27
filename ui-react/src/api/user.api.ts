import {IUser} from "../models";
import {HTTP} from "./http.api";

export const UserApi = Object.freeze({
    getUser: (id: string): Promise<IUser> =>
        HTTP.get<IUser>(`users/${id}`),
    getUsers: (params?: { role?: string }): Promise<IUser[]> =>
        HTTP.post<IUser[]>('users', {role: params?.role}),
    getProjectUsers: (projectId: string): Promise<IUser[]> =>
        HTTP.get<IUser[]>(`users/project/${projectId}`),
    delete: (id: string): Promise<void> =>
        HTTP.delete(`users/${id}`),
    update: (id: string, payload: IUser): Promise<void> =>
        HTTP.put<void>(`users/${id}`, payload),
});
