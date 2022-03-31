import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, take } from 'rxjs';
import { IProject } from '../core/models';
import { ProjectService } from '../core/services/project.service';
import { ProjectDialogComponent } from './project-dialog/project-dialog.component';
import { ProjectStore } from './project.store';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name'];
  public dataSource: MatTableDataSource<IProject> = new MatTableDataSource();

  constructor(
    public projectStore: ProjectStore,
     private router: Router,
      private route: ActivatedRoute,
      private dialog: MatDialog,
      private projectService: ProjectService,
      ) { }

  ngOnInit(): void {
    this.init();
  }

  public selectProject(project: IProject) {
    this.projectStore.setProject(project);
    this.router.navigate([`${project.id}`], {relativeTo: this.route});
  }

  public openDialog(projectId?: IProject): void {
    this.dialog.open(ProjectDialogComponent)
    .afterClosed()
    .pipe(filter(x => x), take(1))
    .subscribe((res: IProject) => {
      if (!projectId) {
        this.projectService.create(res)
          .pipe(take(1)).subscribe(() => this.init())
      }
    })
  }

  private init(): void {
    this.projectService.getAll()
      .pipe(take(1))
      .subscribe((res: IProject[]) => this.dataSource.data = res);
  }

}
