import { Injectable } from '@angular/core';
import { Printer, BluetoothDevice } from '../Models/printer';

import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PrinterService {
  private discoveredDevices: any[] = [];
  private connectedDevice: any = null;

  constructor(private alertController: AlertController) {}

  async discoverPrinters() {
    try {
      const result = await Printer.discoverBluetoothPrinters();
      this.discoveredDevices = Object.values(result.devices);
      return this.discoveredDevices;
    } catch (error) {
      this.showError('Discovery Failed', error);
      throw error;
    }
  }

  async connectPrinter(macAddress: string) {
    try {
      await Printer.connectBluetoothPrinter({ macAddress });
      this.connectedDevice = this.discoveredDevices.find(d => d.address === macAddress);
      return true;
    } catch (error) {
      this.showError('Connection Failed', error);
      throw error;
    }
  }

  async print(text: string) {
    if (!this.connectedDevice) {
      throw new Error('No printer connected');
    }

    try {
      await Printer.printText({ text });
      return true;
    } catch (error) {
      this.showError('Print Failed', error);
      throw error;
    }
  }

  async printReceipt(order: any) {
    // Format your receipt here
    const receiptText = this.formatReceipt(order);
    return this.print(receiptText);
  }

  private formatReceipt(order: any): string {
    // Customize your receipt format
    let text = '=== YOUR STORE ===\n\n';
    text += `Order #${order.id}\n`;
    text += `Date: ${new Date().toLocaleString()}\n\n`;
    text += 'ITEMS:\n';

    //@ts-ignore
    order.items.forEach(item => {
      text += `${item.name} x${item.quantity} $${item.price}\n`;
    });

    text += '\n';
    text += `Subtotal: $${order.subtotal}\n`;
    text += `Tax: $${order.tax}\n`;
    text += `Total: $${order.total}\n\n`;
    text += 'Thank you for your purchase!\n';

    return text;
  }

  private async showError(title: string, error: any) {
    const alert = await this.alertController.create({
      header: title,
      message: error.message || 'Unknown error occurred',
      buttons: ['OK']
    });
    await alert.present();
  }
}
