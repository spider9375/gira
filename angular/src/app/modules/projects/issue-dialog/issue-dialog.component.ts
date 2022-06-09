import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {IIssue, ISprint, IUser} from "../../core/models";
import {UserService} from "../../core/services/user.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {take} from "rxjs";
import {ProjectService} from "../../core/services/project.service";
import {ProjectStore} from "../project.store";
import {Status} from "../../core/enums/status.enum";

@Component({
  selector: 'app-issue-dialog',
  templateUrl: './issue-dialog.component.html',
  styleUrls: ['./issue-dialog.component.scss']
})
export class IssueDialogComponent implements OnInit {
  public form!: FormGroup;
  public developers!: IUser[];
  public sprints!: ISprint[];
  public statuses: {value: string, label: string}[] = Object.keys(Status).map((key) => ({value: key, label: Status[key]}));

  constructor(
      private fb: FormBuilder,
      private userService: UserService,
      private projectStore: ProjectStore,
      private projectService: ProjectService,
      private dialogRef: MatDialogRef<IssueDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data?: { issue: IIssue }
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [this.data?.issue?.title ?? '', [Validators.required]],
      sprint: [this.data?.issue?.sprint ?? '', []],
      assignedTo: [this.data?.issue?.assignedTo ?? '', []],
      status: [this.data?.issue?.status ?? '', []],
      description: [this.data?.issue?.description ?? '', []],
      storyPoints: [this.data?.issue?.storyPoints ?? null, [Validators.min(0)]],
    })

    this.userService.getUsers({ role: 'developer'})
        .pipe(take(1))
        .subscribe((developers: IUser[]) => this.developers = developers);

    this.projectService.getAllSprints(this.projectStore.projectId)
      .pipe(take(1))
      .subscribe((sprints: ISprint[]) => this.sprints = sprints);
  }

  public confirm(): void {
    const data: IIssue = Object.assign({}, this.data?.issue, {...this.form.getRawValue()}) ;

    this.dialogRef.close(data);
  }

}
