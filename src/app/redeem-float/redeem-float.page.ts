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
  transactionData: object = {}

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
  }

  ngOnInit() {
  }

  async redeemCommission() {
    const loading = await this.globalMethods.presentLoading();
    try {
      if (this.FormData.valid) {
        const floatAccountNumber = this.accounts.find(account => account.accountName === 'float account')?.accountNumber || null;
        const commissionAccountNumber = this.accounts.find(account => account.accountName === 'float account')?.accountNumber || null;

        this.transactionData = {
          accountToDebit: commissionAccountNumber,
          accountToCredit: floatAccountNumber,
          amount: this.FormData.controls['amount'].value,
          transferedBy: this.user.customerId,
          remarks: this.FormData.controls['remarks'].value,
        }

        this.finance.PostData(this.transactionData, "/RedeemCommission").subscribe(
          (data) => {
            const s = JSON.stringify(data);
            const resp = JSON.parse(s);
            loading.dismiss();
            if (resp.CODE == '200') {
              this.globalMethods.presentAlert('Success', 'Transaction completed')
              const navigationExtras: NavigationExtras = {
                queryParams: {
                  special: JSON.stringify(this.transactionData),
                },
              };

              this.navCtrl.navigateForward('print', navigationExtras);
            }
            //TODO Check session and logout
            else if (resp.code === '1002') {

            }
            else {
              this.globalMethods.presentAlert('Failed', 'Transaction failed')
            }
          }
        )
      }
    }
    catch {
      loading.dismiss()
      this.globalMethods.presentAlert('Exception', 'An unknown error occured')
    }
  }
}
