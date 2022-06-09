import { Component, OnInit } from '@angular/core';
import {ProjectService} from "../../core/services/project.service";
import {IProject} from "../../core/models";
import {take} from "rxjs";
import {Router} from "@angular/router";
import {ProjectStore} from "../project.store";

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.scss']
})
export class MyProjectsComponent implements OnInit {
  public projects: IProject[] = [];

  constructor(private projectService: ProjectService, private router: Router, private projectStore: ProjectStore) { }

  ngOnInit(): void {
    this.projectService.getAll().pipe(take(1)).subscribe(projects => this.projects = projects)
  }

  public onProjectClick(project: IProject): void {
    this.projectStore.setProject(project);
    this.router.navigate([`projects/${project.id}`])
  }

}
