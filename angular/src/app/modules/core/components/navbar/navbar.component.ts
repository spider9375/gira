import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../../stores/auth.store';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public authStore: AuthStore, private router: Router) { }

  ngOnInit(): void {
  }

  public logout(): void {
    localStorage.clear();
    this.router.navigate(['']);
  }

  public get isProjectsVisible(): boolean {
    return this.authStore.isAdmin || this.authStore.isDeveloper || this.authStore.isManager
  }
}
