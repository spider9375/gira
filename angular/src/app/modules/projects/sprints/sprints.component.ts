import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {IIssue, ISprint} from "../../core/models";
import {ProjectService} from "../../core/services/project.service";
import {ProjectStore} from "../project.store";
import {filter, take} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {SprintDialogComponent} from "../sprint-dialog/sprint-dialog.component";
import {AuthStore} from "../../core/stores/auth.store";

@Component({
  selector: 'app-sprints',
  templateUrl: './sprints.component.html',
  styleUrls: ['./sprints.component.scss']
})
export class SprintsComponent implements OnInit {
  public displayedColumns = ['title', 'status', 'actions'];

  public dataSource: MatTableDataSource<ISprint> = new MatTableDataSource<ISprint>();
  constructor(private projectService: ProjectService,
              private projectStore: ProjectStore,
              private dialogService: MatDialog,
              public authStore: AuthStore,
  ) { }

  ngOnInit(): void {
    this.init();
  }

  public openSprintDialog(sprint?: ISprint): void {
    this.dialogService.open(SprintDialogComponent, { data: { sprint }})
      .afterClosed()
      .pipe(take(1), filter(x => x))
      .subscribe((sprint: ISprint) => {
        if (sprint.id) {
          this.projectService.updateSprint(this.projectStore.projectId, sprint)
            .pipe(take(1))
            .subscribe(() => this.init())
        } else {
          this.projectService.createSprint(this.projectStore.projectId, sprint)
            .pipe(take(1))
            .subscribe(() => this.init());
        }
      })
  }

  public delete(sprintId: string): void {
    this.projectService.deleteSprint(this.projectStore.projectId, sprintId)
      .pipe(take(1)).subscribe(() => this.init());
  }

  private init(): void {
    this.projectService.getAllSprints(this.projectStore.projectId)
        .pipe(take(1))
        .subscribe((sprints: ISprint[]) => this.dataSource = new MatTableDataSource(sprints))
  }
}
