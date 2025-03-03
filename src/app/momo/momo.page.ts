import { LoadingController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalMethodsService } from '../helpers/global-methods.service';
import { FinanceService } from '../sharkServices/finance.service';
import { NavigationExtras } from '@angular/router';
import { formatDate } from '@angular/common';
import { TransactionStatusService } from '../sharkServices/background.service';

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
    public backgroundService: TransactionStatusService
  ) {
    this.FormData = fb.group({
      amount: ['', Validators.required],
      phone: ['', Validators.required],
      remarks: ['', Validators.required],
      name: ['']
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

    this.deviceId = this.globalMethods.getUserData2('deviceID') || '';
  }

  ngOnInit() {
    console.log("")
  }

  async validatePhoneNumber() {
    const loading = await this.globalMethods.presentLoading();

    try {
      if (this.FormData.controls['phone'].invalid) {
        this.globalMethods.presentAlert('Error', 'Please fill in all required fields');
        return;
      }

      const transData = {
        phonenumber: this.FormData.controls['phone'].value.toString(),
        requestedBy: this.user.userId,
      }

      this.finance.PostData(transData, 'ValidatePhonenumber').subscribe({
        next: (data: any) => {
          const s = JSON.stringify(data);
          const resp = JSON.parse(s);
          console.log("ggdgd", resp)
          if (resp.code !== '200' || resp.status.toUpperCase() !== 'SUCCESS') {
            this.globalMethods.presentAlert(
              "Error", resp.message || "An error occured. Please try again"
            );
            return;
          }

          this.FormData.controls['name'].setValue(resp.name)
        },
        error: (error) => {
          console.log("error :", error)
          this.globalMethods.presentAlert('Error', 'An error occurred. Please try again later');
        },
        complete: () => {
          loading.dismiss();
        }
      })
    } catch (error) {

    } finally {

    }
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
        phonenumber: this.FormData.controls['phone'].value.toString(),
        accountToCredit: floatAccount?.accountNumber.toString(),
        amount: this.FormData.controls['amount'].value.toString(),
        initiatedBy: this.user.userId,
        remarks: this.FormData.controls['remarks'].value,
        terminalId: this.deviceId.toString(),
        customerId: this.user.customerId,
        source: "App",
        //TODO ADD PRODUCT ID
        productId: "4"
      }

      console.log("transDate: ", transData)

      this.finance.PostData(transData, 'MobileMoneyCollection').subscribe({
        next: (data: any) => {
          const s = JSON.stringify(data);
          const resp = JSON.parse(s);

          if (resp.code !== '200' || resp.status.toUpperCase() !== 'SUCCESS') {
            var errMsg = '';
            if (resp.code === '201') {
              errMsg = 'Success'
              this.FormData.reset();
              const statusTransData = {
                transactionId: data.transactionId,
                initiatedBy: this.user.userId,
                source: "App",
                terminalId: this.deviceId,
                customerId: this.user.customerId,
                productId: "string"
              };
              resp.message = 'Waiting for customer to enter mobile money pin'
              this.backgroundService.startTransactionStatusCheck(statusTransData);
            } else {
              errMsg = 'Error'
              this.backgroundService.stopTransactionStatusCheck();
            }

            this.globalMethods.presentAlert(
              errMsg , resp.message || "An error occured. Please try again"
            );
            loading.dismiss();
            //resp.code === '201' ? this.backgroundService.startTransactionStatusCheck()
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
          loading.dismiss();
          this.navCtrl.navigateForward('print', navigationExtras);
        },
        error: (error) => {
          this.globalMethods.presentAlert('Error', 'An error occurred. Please try again later');
        },
        complete: () => {
        }
      })

    } catch (error) {

    }
  }
}
