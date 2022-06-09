import { Component, OnInit } from '@angular/core';
import {ProjectService} from "../../core/services/project.service";
import {ProjectStore} from "../project.store";
import {IIssue, ISprint} from "../../core/models";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {IssueDialogComponent} from "../issue-dialog/issue-dialog.component";
import {filter, take} from "rxjs";
import {AuthStore} from "../../core/stores/auth.store";
import {Status} from "../../core/enums/status.enum";

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss']
})
export class BacklogComponent implements OnInit {
  public displayedColumns = ['title', 'sprint', 'status', 'storyPoints', 'actions'];

  public dataSource: MatTableDataSource<IIssue> = new MatTableDataSource<IIssue>();
  public filterSprint!: string;
  public sprints: ISprint[] = [];
  public status = Status;

  constructor(private projectService: ProjectService,
              private projectStore: ProjectStore,
              private dialogService: MatDialog,
              public authStore: AuthStore,
              ) { }

  ngOnInit(): void {
    this.init();
    this.projectService.getAllSprints(this.projectStore.projectId)
    .pipe(take(1))
    .subscribe((sprints: ISprint[]) => this.sprints = sprints);
  }

  public openIssueDialog(issue?: IIssue): void {
    this.dialogService.open(IssueDialogComponent, { data: { issue } }).afterClosed()
        .pipe(filter(x => x))
        .subscribe((issue: IIssue) => {
          if (issue.id) {
            this.projectService.updateIssue(issue.project, issue.id, issue)
                .pipe(take(1))
                .subscribe(() => this.init());
          } else {
            this.projectService.createIssue(this.projectStore.projectId, issue)
                .pipe(take(1))
                .subscribe(() => this.init());
          }
        });
  }

  public delete(issueId: string): void {
    this.projectService.deleteIssue(this.projectStore.projectId, issueId)
      .pipe(take(1))
      .subscribe(() => this.init());
  }

  public filterChanged(sprintId: string): void {
    this.init(sprintId);
  }

  public getSprintName(sprintId: string): string {
    return this.sprints.find(s => s.id === sprintId)?.title ?? '';
  }

  private init(sprintId?: string): void {
    this.projectService.getSprintIssues(this.projectStore.projectId, sprintId)
        .subscribe((issues: IIssue[]) => this.dataSource = new MatTableDataSource<IIssue>(issues))
  }
}
