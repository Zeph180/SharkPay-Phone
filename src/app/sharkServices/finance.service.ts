import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { catchError, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { apiUrl } from './GlobalURl';
import { GlobalMethodsService } from '../helpers/global-methods.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private apiUrl = apiUrl + 'finance/';
  private accessToken: string = "";

  constructor(
    public httpClient: HttpClient,
    public navCtrl: NavController,
    public globalMethods: GlobalMethodsService,
    public router: Router
  ) { }

  // PostData(formData: object, connectionString: string): Observable<any> {
  //   this.accessToken = this.globalMethods.getUserData("accessToken") ?? ""
  //   console.log("Token: ", this.accessToken)
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //       'Authorization': this.accessToken
  //     }),
  //   };

  //   const res = this.httpClient
  //     .post(this.apiUrl + connectionString, formData, httpOptions)
  //     .pipe(map((result: any) => result));
  //   return res;
  // }

  PostData(formData: object, connectionString: string): Observable<any> {
    // Retrieve access token with null/empty checks
    this.accessToken = this.globalMethods.getUserData2("accessToken") || "";

    // Log token for debugging (remove in production)
    console.log("Token: ", this.accessToken);

    // Validate access token
    if (!this.accessToken) {
      this.globalMethods.logout(this.router)
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      }),
    };

    return this.httpClient.post(this.apiUrl + connectionString, formData, httpOptions).pipe(
      map((response: any) => {
        console.log("Raw response:", response);

        // Safely handle JSON parsing
        if (typeof response === 'string') {
          try {
            return JSON.parse(response);
          } catch (e) {
            console.error("JSON parse error:", e, "Response:", response);
            throw new Error("Invalid JSON response from server");
          }
        }

        return response;
      }),
      catchError((error) => {
        console.error("HTTP Post Error:", error);

        // Detailed error handling
        let errorMessage = 'An unexpected error occurred';

        switch (error.status) {
          case 400:
            errorMessage = 'Invalid data submitted';
            break;
          case 401:
            errorMessage = 'Session expired or invalid';
            this.globalMethods.logout(this.router);
            break;
          case 403:
            errorMessage = 'Insufficient permissions';
            break;
          case 404:
            errorMessage = 'Requested resource not found';
            break;
          case 500:
            errorMessage = 'Server error: Please try again later';
            break;
          case 0:
            errorMessage = 'Network error: Check your connection';
            break;
        }

        // Use global methods to show alert
        this.globalMethods.presentAlert('Error', errorMessage);

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
