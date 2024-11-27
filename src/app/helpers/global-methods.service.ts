import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GlobalMethodsService {

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController
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

  storeUserData(key: string, data: any) {
    localStorage.setItem(key, data);
  }

}
