import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { AuthService, ILoginResult } from '../../services/auth.service';
import { AuthStore } from '../../stores/auth.store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public form!: FormGroup;

  constructor(private fb: FormBuilder,
     private authService: AuthService,
      private toastr: ToastrService,
      private authStore: AuthStore,
      private router: Router,
      ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.minLength(6), Validators.required]]
    });
  }

  public register(): void {
    if (this.form.valid) {
      const data = this.form.getRawValue();

      this.authService.login(data).pipe(take(1)).subscribe((res: ILoginResult) => {
        this.toastr.success('Login successful!')
        localStorage.setItem('token', res.token);
        this.authStore.setUserDetails(res.user);
        this.router.navigate(['']);
      });
    }
  }
}
