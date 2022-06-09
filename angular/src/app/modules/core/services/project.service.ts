import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {IIssue, IProject, ISprint} from "../models";
import { HttpClientService } from "./http-client.service";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private http: HttpClientService) {}

  public getAll(): Observable<IProject[]> {
    return this.http.get<IProject[]>('projects');
  }

  public getOne(projectId: string): Observable<IProject> {
    return this.http.get<IProject>(`projects/${projectId}`);
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

  // Issues
  public getAllIssues(projectId: string): Observable<IIssue[]> {
    return this.http.get<IIssue[]>(`projects/${projectId}/issues`);
  }

  public getSprintIssues(projectId: string, sprintId?: string): Observable<IIssue[]> {
    return this.http.post<IIssue[]>(`projects/${projectId}/issues/filtered`, { sprint: sprintId });
  }

  public updateIssue(projectId: string, issueId: string, payload: Partial<IIssue>): Observable<IIssue[]> {
    return this.http.put<IIssue[]>(`projects/${projectId}/issues/${issueId}`, payload);
  }

  public createIssue(projectId: string, payload: IIssue): Observable<void> {
    return this.http.post(`projects/${projectId}/issues`, payload);
  }

  public deleteIssue(projectId: string, issueId: string): Observable<void> {
    return this.http.delete(`projects/${projectId}/issues/${issueId}`);
  }

  // Sprints
  public getActiveSprint(projectId: string): Observable<ISprint> {
    return this.http.get<ISprint>(`projects/${projectId}/sprints/active`);
  }

  public getAllSprints(projectId: string): Observable<ISprint[]> {
    return this.http.get<ISprint[]>(`projects/${projectId}/sprints`);
  }

  public createSprint(projectId: string, payload: ISprint): Observable<void> {
    return this.http.post(`projects/${projectId}/sprints`, payload);
  }

  public updateSprint(projectId: string, payload: ISprint): Observable<void> {
    return this.http.put(`projects/${projectId}/sprints/${payload.id}`, payload);
  }

  public deleteSprint(projectId: string, sprintId: string): Observable<void> {
    return this.http.delete(`projects/${projectId}/sprints/${sprintId}`);
  }
}
