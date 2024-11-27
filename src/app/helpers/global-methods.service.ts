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
}
