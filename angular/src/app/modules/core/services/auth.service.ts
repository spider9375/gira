import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ILoginModel, IRegisterModel, IUser } from "../models";
import { HttpClientService } from "./http-client.service";

export interface ILoginResult {
  token: string,
  user: IUser,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClientService) {
    this.http
  }

  public register(data: IRegisterModel): Observable<Object> {
    return this.http.post('register', data);
  }

  public login(data: ILoginModel): Observable<ILoginResult> {
    return this.http.post<ILoginResult>('login', data);
  }
}