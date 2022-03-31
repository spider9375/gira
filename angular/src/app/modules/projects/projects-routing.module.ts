import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BacklogComponent } from './backlog/backlog.component';
import { ProjectComponent } from './project/project.component';
import { ProjectsComponent } from './projects.component';
import { ReportsComponent } from './reports/reports.component';
import { SprintComponent } from './sprint/sprint.component';

const routes: Routes = [
  { path: '',
    component: ProjectsComponent,
  },
  {
    path: ':id',
    component: ProjectComponent,
    children: [{
      path: 'backlog',
      component: BacklogComponent,
    },
    {
      path: 'sprint/:id',
      component: SprintComponent,
    },
    {
      path: 'reports',
      component: ReportsComponent,
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
