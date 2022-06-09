import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { SharedModule } from '../shared/shared.module';
import { MobxAngularModule } from 'mobx-angular';
import { ProjectStore } from './project.store';
import { ProjectComponent } from './project/project.component';
import { BacklogComponent } from './backlog/backlog.component';
import { SprintComponent } from './sprint/sprint.component';
import { ReportsComponent } from './reports/reports.component';
import { ProjectDialogComponent } from './project-dialog/project-dialog.component';
import { IssueDialogComponent } from './issue-dialog/issue-dialog.component';
import { SprintsComponent } from './sprints/sprints.component';
import { SprintDialogComponent } from './sprint-dialog/sprint-dialog.component';
import {MatCheckboxModule} from "@angular/material/checkbox";

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectComponent,
    BacklogComponent,
    SprintComponent,
    ReportsComponent,
    ProjectDialogComponent,
    IssueDialogComponent,
    SprintsComponent,
    SprintDialogComponent
  ],
    imports: [
        CommonModule,
        ProjectsRoutingModule,
        SharedModule,
        MobxAngularModule,
    ],
  providers: [
  ]
})
export class ProjectsModule { }
