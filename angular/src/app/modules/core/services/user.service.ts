import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IUser } from "../models";
import { HttpClientService } from "./http-client.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClientService) {}

  public getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>('users');
  }

  public delete(id: string): Observable<void> {
    return this.http.delete(`users/${id}`);
  }

  public update(id: string, payload: IUser): Observable<void> {
    return this.http.put<void>(`users/${id}`, payload)
  }
}