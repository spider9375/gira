import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  constructor(private http: HttpClient) {
  }

  public get<T>(url: string): Observable<T> {
    return this.http.get<T>(environment.apiUrl + url)
  }

  public post<T>(url: string, data: any): Observable<T> {
    return this.http.post<T>(environment.apiUrl + url, data);
  }

  public delete(url: string): Observable<void> {
    return this.http.delete<void>(environment.apiUrl + url);
  }

  public put<T>(url: string, data: any): Observable<T> {
    return this.http.put<T>(environment.apiUrl + url, data);
  }
}