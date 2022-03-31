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

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectComponent,
    BacklogComponent,
    SprintComponent,
    ReportsComponent
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
