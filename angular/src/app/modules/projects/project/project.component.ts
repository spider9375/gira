import { Component, OnInit } from '@angular/core';
import { ProjectStore } from '../project.store';
import {ProjectService} from "../../core/services/project.service";
import {take} from "rxjs";
import {ISprint} from "../../core/models";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  constructor(public projectStore: ProjectStore, private projectService: ProjectService) { }

  ngOnInit(): void {
    this.projectService.getActiveSprint(this.projectStore.projectId)
      .pipe(take(1))
      .subscribe((sprint: ISprint) => this.projectStore.setActiveSprint(sprint))
  }

}
