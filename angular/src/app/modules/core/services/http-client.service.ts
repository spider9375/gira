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

  public post(url: string, data: any): Observable<Object> {
    return this.http.post(environment.apiUrl + url, data);
  }
}