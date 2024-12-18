import { LoadingController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalMethodsService } from '../helpers/global-methods.service';
import { FinanceService } from '../sharkServices/finance.service';
import { NavigationExtras } from '@angular/router';

interface User {
  names: string;
  email: string;
  role: string;
  roleId: string;
  customerId: string;
  customerName: string;
  userType: string;
  userTypeId: string;
  username: string;
  lastloginDate: string;
  userId: string;
  transactionLimit: string;
  ispasswordChangeRequired: string;
}

@Component({
  selector: 'app-momo',
  templateUrl: './momo.page.html',
  styleUrls: ['./momo.page.scss'],
})
export class MomoPage implements OnInit {
  FormData!: FormGroup;
  deviceId: string = "";

  public user: User = {
    names: '',
    email: '',
    role: '',
    roleId: '',
    customerId: '',
    customerName: '',
    userType: '',
    userTypeId: '',
    username: '',
    lastloginDate: '',
    userId: '',
    transactionLimit: '',
    ispasswordChangeRequired: ''
  };

  public accounts: {
    accountNumber: string,
    balance: string,
    accountName: string,
    accountTypeId: string,
    accountType: string
  }[] = [];

  constructor(
    private fb: FormBuilder,
    private globalMethods: GlobalMethodsService,
    private finance: FinanceService,
    public navCtrl: NavController,
  ) {
    this.FormData = fb.group({
      amount: ['', Validators.required],
      phone: ['', Validators.required],
      remarks: ['', Validators.required],
    });

    this.deviceId = this.globalMethods.getUserData2('deviceID') || '';
  }

  ngOnInit() {
  }

  async topUpWithMomo() {
    const loading = await this.globalMethods.presentLoading();

    try {
      if (this.FormData.invalid) {
        this.globalMethods.presentAlert('Error', 'Please fill in all required fields');
        return;
      }

      const floatAccountNumber = this.accounts.find(account => account.accountName === 'float account')?.accountNumber || null;

      const floatAccount = this.accounts.find(account =>
        account.accountName.toLowerCase() === "float account"
      );


      const transData = {
        phonenumber: this.FormData.controls['phone'].value,
        accountToCredit: floatAccount,
        amount: this.FormData.controls['amount'].value.toString(),
        requestedBy: this.user.userId,
        remarks: this.FormData.controls['remarks'].value,
        terminalId: this.deviceId.toString(),
        customerId: this.user.customerId,
        //TODO ADD PRODUCT ID
        productId: "string"
      }

      this.finance.PostData(transData, 'topUpWithMomo').subscribe({
        next: (data: any) => {
          const s = JSON.stringify(data);
          const resp = JSON.parse(s);

          if (resp.code !== '200' || resp.status.toUpperCase() !== 'SUCCESS') {
            this.globalMethods.presentAlert(
              "Error", resp.message || "An error occured. Please try again"
            );
            return;
          }

          this.globalMethods.presentAlert('Success', resp.message);

          const receiptData = {
            transactionID: resp.transactionId,
            account: '',
            amount: this.FormData.controls['amount'].value,
            product: 'URA Payment',
            transactionReference: resp.transactionId || '0',
            externalReference: null,
            transferedBy: this.user.customerId,
            transDate: this.globalMethods.getDate(),
            customerName: this.user.names,
            charges: '0',
            commission: '0',
            contact: this.FormData.controls['phone'].value.toString()
          }

          const navigationExtras: NavigationExtras = {
            queryParams: {
              transaction: JSON.stringify(receiptData)
            }
          }
          this.navCtrl.navigateForward('print', navigationExtras);
        },
        error: (error) => {
          this.globalMethods.presentAlert('Error', 'An error occurred. Please try again later');
        },
        complete: () => {
          loading.dismiss();
        }
      })

    } catch (error) {

    }
  }
}
