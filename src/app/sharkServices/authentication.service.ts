import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { apiUrl } from './GlobalURl';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl = apiUrl + 'authentication/';

  constructor(
    private httpClient: HttpClient,
    private router: Router) { }

  UserLogin(formData: any): Observable<any> {
    const apiUrl = this.apiUrl + 'userauthentication';
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

  mockUserLogin(formData: any): Observable<any> {
    // Simulate a JSON response for testing purposes
    const mockResponse = {
      "status": "SUCCESS",
      "code": "200",
      "message": "Login Successfully",
      "accessToken": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibm11a3dheWEiLCJleHAiOjE3MzI2ODE4NDEsImlzcyI6Imh0dHBzOi8vc2hhcmtwYXkuY28udWcvIiwiYXVkIjoiaHR0cHM6Ly9zaGFya3BheS5jby51Zy8ifQ.Gj_ePPz2T0aNQRJhc-6HxpQm-ftyiRuHJsWZeidUo04",
        "expiry": null,
        "action": "grant_access"
      },
      "user": {
        "names": "Mukwaya Nicholas",
        "email": "email21@gmail.com",
        "role": "",
        "roleId": "4",
        "customerId": "18",
        "customerName": "NAKITENDE FLORENCE",
        "userType": "1",
        "userTypeId": "1",
        "username": "NMukwaya",
        "lastloginDate": "",
        "userId": "12",
        "transactionLimit": "10000000",
        "ispasswordChangeRequired": "False"
      },
      "accounts": [
        {
          "accountNumber": "4002000018",
          "balance": "95000",
          "accountName": "float account",
          "accountTypeId": "2",
          "accountType": "Float Account"
        },
        {
          "accountNumber": "4001000018",
          "balance": "0",
          "accountName": "commission account",
          "accountTypeId": "1",
          "accountType": "Commission Account"
        }
      ]
    };

    // Simulate an Observable returning the mock response
    return of(mockResponse);
  }

  // Optionally, a method to store the token or user session after login
  storeUserData(key: string, data: any) {
    localStorage.setItem(key, data);
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
