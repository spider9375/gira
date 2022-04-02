import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IProject } from "../models";
import { HttpClientService } from "./http-client.service";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private http: HttpClientService) {}

  public getAll(): Observable<IProject[]> {
    return this.http.get<IProject[]>('projects');
  }

  public create(project: IProject): Observable<void> {
    return this.http.post<void>('projects', project);
  }

  public update(project: IProject): Observable<void> {
    return this.http.put<void>(`projects/${project.id}`, project);
  }

  public delete(projectId: string): Observable<void> {
    return this.http.delete(`projects/${projectId}`);
  }
}
