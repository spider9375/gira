import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {ProjectStore} from "../project.store";
import {ProjectService} from "../../core/services/project.service";
import {take} from "rxjs";
import {IIssue, IUser} from "../../core/models";
import {IssueStatus} from "../../shared/utils";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../core/services/user.service";

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.scss']
})
export class SprintComponent implements OnInit {
  public todo: IIssue[] = [];
  public progress: IIssue[] = [];
  public pr: IIssue[] = [];
  public done: IIssue[] = [];
  public sprintId!: string;
  public users: { [userId: string]: IUser } = {};

  public issueStatus = IssueStatus;

  constructor(private projectStore: ProjectStore,
              private projectService: ProjectService,
              private userService: UserService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.sprintId = this.route.snapshot.paramMap.get('sprintId')!;

    this.userService.getProjectUsers(this.projectStore.projectId).pipe(take(1))
      .subscribe((users) => this.users = Object.assign({}, ...users.map(u => ({[u.id]: u}))));

    if (this.projectStore.activeSprint?.id !== this.sprintId) {
      this.projectService.getActiveSprint(this.projectStore.projectId).pipe(take(1))
      .subscribe((sprint) => this.projectStore.setActiveSprint(sprint));
    }

    this.projectService.getSprintIssues(this.projectStore.projectId, this.sprintId)
      .pipe(take(1))
      .subscribe((issues: IIssue[]) => {
        this.todo = issues.filter(i => i.status === IssueStatus.Todo);
        this.progress = issues.filter(i => i.status === IssueStatus.InProgress);
        this.pr = issues.filter(i => i.status === IssueStatus.Pr);
        this.done = issues.filter(i => i.status === IssueStatus.Done);
      })
  }

  drop(event: CdkDragDrop<IIssue[]>, status: IssueStatus) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }

    if (event.item.data.status !== status) {
      this.projectService.updateIssue(
        this.projectStore.projectId,
        event.item.data.id,
        { status })
        .pipe(take(1)).subscribe();
    }
  }
}
