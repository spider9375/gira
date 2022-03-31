import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public form!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.email],
      password: ['', Validators.min(6)]
    });
  }

  public register(): void {
    const data = this.form.getRawValue();

    this.authService.register(data).pipe(take(1)).subscribe(() => this.toastr.success('Registration successful!'));
  }

}
