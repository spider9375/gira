import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Role } from '../../core/enums/role.enum';
import { IUser } from '../../core/models';
import { UserStore } from '../user.store';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {
  public form!: FormGroup;
  public roles = Object.keys(Role);

  constructor(
    private dialogRef: MatDialogRef<UserDialogComponent>,
    private userStore: UserStore,
    private fb: FormBuilder,
    ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [this.userStore.user.firstName ?? '', [Validators.required]],
      lastName: [this.userStore.user.lastName ?? '', [Validators.required]],
      email: [this.userStore.user.email ?? '', [Validators.required, Validators.email]],
      role: [this.userStore.user.role ?? '', [Validators.required]],
    })
  }

  public confirm(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.getRawValue() as IUser)
    }

  }
}
