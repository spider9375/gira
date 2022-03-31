import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsModule } from './modules/projects/projects.module';

const routes: Routes = [
  {
    path: 'projects',
    loadChildren: () => ProjectsModule,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
