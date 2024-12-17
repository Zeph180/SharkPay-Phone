import { GlobalMethodsService } from './../helpers/global-methods.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NexgoSDKNew } from 'nexgsdknew';


@Component({
  selector: 'app-print',
  templateUrl: './print.page.html',
  styleUrls: ['./print.page.scss'],
})
export class PrintPage implements OnInit {
  public transaction: {
    transactionID: string;
    account: string;
    amount: string;
    balanceBefore: string;
    balanceAfter: string;
    transType: string;
    productID: string;
    product: string;
    transactionReference: string;
    externalReference: null;
    transferedBy: string;
    remarks: null;
    status: string;
    transDate: string;
    customerID: string;
    customerName: string;
    transferedByName: string;
    charges: string;
    commission: string;
    contact: string;
  } = {
      transactionID: '',
      account: '',
      amount: '',
      balanceBefore: '',
      balanceAfter: '',
      transType: '',
      productID: '',
      product: '',
      transactionReference: '',
      externalReference: null,
      transferedBy: '',
      remarks: null,
      status: '',
      transDate: '',
      customerID: '',
      customerName: '',
      transferedByName: '',
      charges: '',
      commission: '',
      contact: ''
    }

  constructor(
    private route: ActivatedRoute,
    private globalMethodsService: GlobalMethodsService
  ) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['transaction']) {
        this.transaction = JSON.parse(params['transaction']);
      }
    });
  }

  convertImageToBase64(url: string, width: number, height: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataURL = canvas.toDataURL('image/png');
          const base64String = dataURL.replace(/^data:image\/png;base64,/, '');
          resolve(base64String);
        } else {
          reject(new Error('Failed to get canvas context'));
        }
      };
      img.onerror = (error) => reject(error);
      img.src = url;
    });
  }


  async printWholeReceipt() {
    try {
      const terminalId = this.globalMethodsService.getUserData2('deviceID');
      // Base64 logo image string
      const logoBase64 = await this.convertImageToBase64('../../assets/images/sharkLogo.PNG', 200, 100);

      // Step 1: Print the logo
      await NexgoSDKNew['printImage']({
        base64Image: logoBase64,
      });

      // Step 3: Prepare receipt content
      const receiptHeader = `\n--------------------------------\n Customer Care: 0 200 910 112       \n Terminal:         ${terminalId}         \n            Receipt         \n--------------------------------\n`;
      const receiptDetails = ` Receipt ID:     ${this.transaction.transactionID}\n SERVICE:     ${this.transaction.product}\n DATE:        ${this.transaction.transDate}\n ACCOUNT:     ${this.transaction.account}\n CONTACT:     ${this.transaction.contact}\n AMOUNT:      ${this.transaction.amount}\n CHARGES:     ${this.transaction.charges}\n COMMISSION:     ${this.transaction.commission}\n AMOUNT LOADED:     ${this.transaction.amount} \n--------------------------------\n`;
      const receiptFooter = ` Thank you for paying with us!`;

      // Step 4: Print the receipt text
      await NexgoSDKNew['printText']({
        text: receiptHeader + receiptDetails + receiptFooter,
        fontSize: 24,
        alignment: 'LEFT',
        bold: true,
      });

      // Step 5: Start the print process
      await NexgoSDKNew['startPrint']();
    } catch (error) {
      console.error('Printing failed:', error);
    }
  }

}
