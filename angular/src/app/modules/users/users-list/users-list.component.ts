import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, take } from 'rxjs';
import { IUser } from '../../core/models';
import { UserService } from '../../core/services/user.service';
import { AuthStore } from '../../core/stores/auth.store';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { UserStore } from '../user.store';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  displayedColumns: string[] = ['username', 'firstName', 'lastName', 'email', 'role', 'active', 'actions'];
  public dataSource: MatTableDataSource<IUser> = new MatTableDataSource();

  constructor(
    public userStore: UserStore,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    public authStore: AuthStore,
    private dialog: MatDialog,
    ) { }

  ngOnInit(): void {
    this.init();
  }

  public delete(id: string): void {
    this.userService.delete(id).pipe(take(1)).subscribe(() => this.init())
  }

  public edit(user: IUser): void {
    this.userStore.setUser(user);
    this.dialog.open(UserDialogComponent)
    .afterClosed().pipe(filter(x => x), take(1))
    .subscribe((res: IUser) => this.userService.update(user.id, res).pipe(take(1)).subscribe(() => this.init()))
  }

  private init(): void {
    this.userService.getUsers().pipe(take(1)).subscribe(users => this.dataSource.data = users)
  }
}
