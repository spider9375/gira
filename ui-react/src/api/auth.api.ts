import {ILoginModel, IRegisterModel, IUser} from "../models";
import {HTTP} from "./http.api";

export interface ILoginResult {
    token: string,
    user: IUser,
}

export const AuthApi = Object.freeze({
    register: (data: IRegisterModel): Promise<Object> => HTTP.post('register', data),
    login: (data: ILoginModel): Promise<ILoginResult> => HTTP.post<ILoginResult>('login', data),
})