import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { apiUrl } from './GlobalURl';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private apiUrl = apiUrl + 'finance/';

  constructor(public httpClient: HttpClient, public navCtrl: NavController) { }

  PostData(formData: object, connectionString: string, signature = ''): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Signature': signature,
        'Access-Control-Allow-Origin': '*'
      }),
    };

    const res = this.httpClient
      .post(this.apiUrl + connectionString, formData, httpOptions)
      .pipe(map((result: any) => result));
    return res;
  }
}
