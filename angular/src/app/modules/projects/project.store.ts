import { Injectable } from "@angular/core";
import { makeAutoObservable } from "mobx";
import { IProject } from "../core/models";

@Injectable()
export class ProjectStore {
  public project: IProject | null = null;
  constructor() {
    makeAutoObservable(this);
  }

  setProject(project: IProject): void {
    this.project = project;
  }

}