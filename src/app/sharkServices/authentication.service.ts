import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { apiUrl } from './GlobalURl';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl = apiUrl + 'UserAuthentication/';

  constructor(
    private httpClient: HttpClient,
    private router: Router) { }

  UserLogin(formData: any): Observable<any> {
    const apiUrl = this.apiUrl + 'login';
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
    const res = this.httpClient
      .post(apiUrl, formData, httpOptions)
      .pipe(map((result: any) => result));
    return res;
  }

  // Optionally, a method to store the token or user session after login
  storeUserData(data: any) {
    localStorage.setItem('userToken', data.token);
  }

  logout() {
    localStorage.removeItem('userToken');
    this.router.navigate(['/login']);
  }

  PostData(formData: FormData, connectionString: string, signature = ''): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Signature': signature,
      }),
    };

    const res = this.httpClient
      .post(this.apiUrl + connectionString, formData, httpOptions)
      .pipe(map((result: any) => result));
    return res;
  }
}
