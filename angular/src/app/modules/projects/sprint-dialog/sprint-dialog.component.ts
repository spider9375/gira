import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {IIssue, ISprint} from "../../core/models";

@Component({
  selector: 'app-sprint-dialog',
  templateUrl: './sprint-dialog.component.html',
  styleUrls: ['./sprint-dialog.component.scss']
})
export class SprintDialogComponent implements OnInit {
  public form!: FormGroup;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<SprintDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data?: { sprint: ISprint }
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [this.data?.sprint?.title ?? '', [Validators.required]],
      isActive: [this.data?.sprint?.isActive],
    })
  }

  public confirm(): void {
    const data: IIssue = Object.assign({}, this.data?.sprint, {...this.form.getRawValue()}) ;

    this.dialogRef.close(data);
  }

}
