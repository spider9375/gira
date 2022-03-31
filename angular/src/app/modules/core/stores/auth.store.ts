import { Injectable } from "@angular/core";
import { makeAutoObservable } from "mobx";
import { IUser } from "../models";
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  public userDetails!: IUser | null;

  constructor() {
    makeAutoObservable(this)
  }

  public get user(): IUser | null {
    const token: string | null = localStorage.getItem('token');

    if (token) {
      try {
        return jwt_decode(token) as IUser;
      } catch(Error) {
        return null;
      }
    }

    return null;
  }

  public get isAdmin(): boolean {
    return this.user?.role === 'admin';
  }

  public get isUser(): boolean {
    return this.user?.role === 'user';
  }

  public get isDeveloper(): boolean {
    return this.user?.role === 'developer';
  }

  public get isManager(): boolean {
    return this.user?.role === 'manager';
  }

  public get userCredentials(): string {
    if (this.user) {
      return (this.user.firstName[0] + this.user.lastName[0]).toUpperCase();
    }

    return '';
  }

  public setUserDetails(details: IUser): void {
    this.userDetails = details;
  }
}