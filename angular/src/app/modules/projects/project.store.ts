import { Injectable } from "@angular/core";
import { makeAutoObservable } from "mobx";
import {IProject, ISprint} from "../core/models";

@Injectable()
export class ProjectStore {
  public project: IProject | null = null;
  public activeSprint: ISprint | null = null;
  constructor() {
    makeAutoObservable(this);
  }

  setProject(project: IProject): void {
    this.project = project;
  }

  setActiveSprint(sprint: ISprint): void {
    this.activeSprint = sprint;
  }

  public get projectId(): string {
    return this.project?.id ?? '';
  }

}
