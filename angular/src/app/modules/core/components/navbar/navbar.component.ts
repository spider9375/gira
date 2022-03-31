import { Component, OnInit } from '@angular/core';
import { AuthStore } from '../../stores/auth.store';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private authStore: AuthStore) { }

  ngOnInit(): void {
  }

  public logout(): void {
    localStorage.clear();
    this.authStore.reset();
  }

}
