import { Injectable } from "@angular/core";
import { makeAutoObservable } from "mobx";
import { IUser } from "../models";

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  public user!: IUser | null;
  constructor() {
    makeAutoObservable(this)
  }

  public setUser(user: IUser): void {
    this.user = user;
  }

  public reset(): void {
    this.user = null;
  }
}