import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinanceService } from '../sharkServices/finance.service';
import { GlobalMethodsService } from '../helpers/global-methods.service';
import { NavController } from '@ionic/angular';
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
  selector: 'app-redeem-float',
  templateUrl: './redeem-float.page.html',
  styleUrls: ['./redeem-float.page.scss'],
})
export class RedeemFloatPage implements OnInit {
  FormData!: FormGroup;
  transactionData: object = {};
  deviceId: string;

  public accounts: {
    accountNumber: string,
    balance: string,
    accountName: string,
    accountTypeId: string,
    accountType: string
  }[] = []

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

  constructor(
    private fb: FormBuilder,
    private finance: FinanceService,
    private globalMethods: GlobalMethodsService,
    public navCtrl: NavController
  ) {
    this.FormData = this.fb.group({
      amount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      remarks: ['', Validators.required],
    });

    this.accounts = this.globalMethods.getUserData<{
      accountNumber: string;
      balance: string;
      accountName: string;
      accountTypeId: string;
      accountType: string;
    }[]>('accounts') || [];

    this.user = this.globalMethods.getUserData<User>('user') || {
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

    this.deviceId = this.globalMethods.getUserData2('deviceID') || ''
  }

  ngOnInit() {
  }

  async redeemCommission() {
    const loading = await this.globalMethods.presentLoading();
    try {
      if (this.FormData.invalid) {
        this.globalMethods.presentAlert("Error", "All values are required");
        loading.dismiss();
        return;
      }
        const floatAccountNumber = this.accounts.find(account => account.accountName === 'float account')?.accountNumber || null;
        const commissionAccountNumber = this.accounts.find(account => account.accountName === 'float account')?.accountNumber || null;

        this.transactionData = {
          accountToDebit: commissionAccountNumber,
          accountToCredit: floatAccountNumber,
          amount: this.FormData.controls['amount'].value.toString(),
          transferedBy: this.user.names,
          remarks: this.FormData.controls['remarks'].value,
          source: "App",
          terminalId: this.deviceId.toString(),
          customerId: this.user.customerId,
          //TODO Add product id for redeem commission
          productId: ""
        }

      console.log("Redeem commission data:", this.transactionData);
      this.finance.PostData(this.transactionData, "RedeemCommission").subscribe({
        next: (data) => {
          try {
            const s = JSON.stringify(data);
            const resp = JSON.parse(s);
            loading.dismiss();
            console.log("Redeem commission response:", resp);
            if (resp.code !== '200' || resp.status.toUpperCase() !== "SUCCESS") {
              this.globalMethods.presentAlert(
                "Error",
                data.message || "Please try again"
              );
              return;
            }
              this.globalMethods.presentAlert('Success', 'Transaction completed')

            const receiptData = {
              transactionID: resp.transactionId,
              account: floatAccountNumber,
              amount: this.FormData.controls['amount'].value,
              product: 'Redeem Commission',
              transactionReference: resp.transactionId || '0',
              externalReference: null,
              transferedBy: this.user.customerId,
              transDate: this.globalMethods.getDate(),
              customerName: this.user.names,
              charges: '0',
              commission: '0',
              contact: ''
            }

              const navigationExtras: NavigationExtras = {
                queryParams: {
                  special: JSON.stringify(receiptData),
                },
              };

            this.navCtrl.navigateForward('print', navigationExtras);
          }
          catch (error) {
            console.error("Exception in queryPRN:", error);
            this.globalMethods.presentAlert("Exception", "Unexpected error occurred");
            loading.dismiss();
          }
        },
        error: (error) => {
          console.error("Query PRN error:", error);
          this.globalMethods.presentAlert(
            "Error",
            error.message || "Network request failed"
          );
          loading.dismiss();
        }
      })

    }
    catch {
      loading.dismiss()
      this.globalMethods.presentAlert('Exception', 'An unknown error occured')
    }
  }
}
