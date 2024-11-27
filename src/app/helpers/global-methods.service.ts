import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GlobalMethodsService {

  constructor(
    private alertController: AlertController,
  ) { }

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

  getUserData<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) as T : null; // Return parsed data or null if it doesn't exist
  }

  storeUserData(key: string, data: any) {
    localStorage.setItem(key, data);
  }

}
