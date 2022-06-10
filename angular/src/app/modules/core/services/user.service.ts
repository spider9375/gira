import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IUser } from "../models";
import { HttpClientService } from "./http-client.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClientService) {}

  public getUsers(params?: { role?: string }): Observable<IUser[]> {
    return this.http.post<IUser[]>('users', { role: params?.role});
  }

  public getProjectUsers(projectId: string): Observable<IUser[]> {
    return this.http.get<IUser[]>(`users/project/${projectId}`);
  }

  public delete(id: string): Observable<void> {
    return this.http.delete(`users/${id}`);
  }

  public update(id: string, payload: IUser): Observable<void> {
    return this.http.put<void>(`users/${id}`, payload)
  }
}
