import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalMethodsService {
  private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private accountsSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) { }

  // Set user data
  setUserData(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  // setAccountsData(accounts: any) {
  //   localStorage.setItem('accounts', JSON.stringify(accounts));
  //   this.accountsSubject.next(accounts);
  // }

  // Observe user data
  getUserObservable() {
    return this.userSubject.asObservable();
  }

  getAccountsObservable() {
    return this.accountsSubject.asObservable();
  }

  async presentAlert(headerText: string, message: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: headerText,
      message: message,
      buttons: ['Dismiss'],
      animated: true,
    });

    await alert.present();
  }

  async presentLoading(message: string = 'Please wait...') {
    const loading = await this.loadingController.create({
      message,
      translucent: true,
      cssClass: 'my-custom-loader',
      backdropDismiss: true,
      spinner: 'lines-sharp',
      animated: true,
    });

    await loading.present();
    return loading;
  }

  getUserData<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) as T : null; // Return parsed data or null if it doesn't exist
  }

  getUserData2(key: string): string {
    try {
      const rawData = localStorage.getItem(key);
      if (!rawData) return "";

      // If already a string, return as-is
      if (typeof rawData === 'string') return rawData;

      // If JSON-like, parse carefully
      return JSON.parse(rawData);
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      return "";
    }
  }

  storeUserData(key: string, data: any) {
    localStorage.setItem(key, data);
  }

  async logout(router?: Router) {
    try {
      // Clear all locally stored user data
      const keysToRemove = [
        'accessToken',
        'refreshToken',
        'user',
        'customerId',
        'email'
      ];

      keysToRemove.forEach(key => localStorage.removeItem(key));

      await this.presentAlert('Logged Out', 'You have been logged out.');

      if (router) {
        router.navigate(['/login'], {
          replaceUrl: true
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      this.presentAlert('Logout Failed', 'Unable to complete logout process.');
    }
  }

  getDate() {
    const time = new Date();
    return time.toLocaleDateString('en-GB');
  }
}
