import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProject, IUser } from '../../core/models';
import { ProjectStore } from '../project.store';

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
    private projectStore: ProjectStore,
    private fb: FormBuilder,
    ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.projectStore.project?.name ?? '', [Validators.required]],
      managerId: [this.projectStore.project?.managerId ?? '', [Validators.required]],
      description: [this.projectStore.project?.description ?? '', [Validators.required]],
      // photo: [this.projectStore.project?.photo ?? '', [Validators.required]],
      team: [this.projectStore.project?.team ?? '', [Validators.required]],
    })
  }

  public confirm(): void {
    const data: IProject = this.form.getRawValue();
  }

}
