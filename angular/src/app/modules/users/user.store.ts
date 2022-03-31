import { Injectable } from "@angular/core";
import { makeAutoObservable } from "mobx";
import { IUser } from "../core/models";

@Injectable()
export class UserStore {
  public user!: IUser;
  public users!: IUser[];

  constructor() {
    makeAutoObservable(this);
  }

  public setUser(user: IUser): void {
    this.user = user;
  }

  public setUsers(users: IUser[]): void {
    this.users = users;
  }
}