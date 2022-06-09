import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BacklogComponent } from './backlog/backlog.component';
import { ProjectComponent } from './project/project.component';
import { ProjectsComponent } from './projects.component';
import { ReportsComponent } from './reports/reports.component';
import { SprintComponent } from './sprint/sprint.component';
import {MyProjectsComponent} from "./my-projects/my-projects.component";
import {ProjectResolver} from "../core/resolvers/project.resolver";
import {SprintsComponent} from "./sprints/sprints.component";

const routes: Routes = [
  { path: '',
    component: ProjectsComponent,
  },
  {
    path: 'my-projects',
    component: MyProjectsComponent
  },
  {
    path: ':id',
    component: ProjectComponent,
    resolve: [ProjectResolver],
    children: [{
      path: 'backlog',
      component: BacklogComponent,
    },
    {
      path: 'sprint/:sprintId',
      component: SprintComponent,
    },
    {
      path: 'sprints',
      component: SprintsComponent,
    },
  ]
  }
  // {
  //     path: ':id',
  //     component: ProjectComponent,
  //   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
