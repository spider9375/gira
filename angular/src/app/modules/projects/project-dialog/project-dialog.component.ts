import {Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProject, IUser } from '../../core/models';
import {UserService} from "../../core/services/user.service";
import {take} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrls: ['./project-dialog.component.scss']
})
export class ProjectDialogComponent implements OnInit {
  public form!: FormGroup;
  public developers!: IUser[];
  public managers!: IUser[];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<ProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { project: IProject }
    ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.data.project?.name ?? '', [Validators.required]],
      managerId: [this.data.project?.managerId ?? '', [Validators.required]],
      description: [this.data.project?.description ?? '', [Validators.required]],
      // photo: [this.projectStore.project?.photo ?? '', [Validators.required]],
      team: [this.data.project?.team ?? '', [Validators.required]],
    })

    this.userService.getUsers({ role: 'developer'})
      .pipe(take(1))
      .subscribe((developers: IUser[]) => this.developers = developers);
    this.userService.getUsers({ role: 'manager'})
      .pipe(take(1))
      .subscribe((managers: IUser[]) => this.managers = managers);
  }

  public confirm(): void {
    const data: IProject = this.form.getRawValue();

    this.dialogRef.close(data);
  }

}
