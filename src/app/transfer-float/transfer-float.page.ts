import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinanceService } from '../sharkServices/finance.service';
import { GlobalMethodsService } from '../helpers/global-methods.service';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';

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
  selector: 'app-transfer-float',
  templateUrl: './transfer-float.page.html',
  styleUrls: ['./transfer-float.page.scss'],
})
export class TransferFloatPage implements OnInit {
  FormData!: FormGroup;
  transactionData: object = {};
  queryData: object = {};
  deviceId: string = "";

  public accounts: {
    accountNumber: string,
    balance: string,
    accountName: string,
    accountTypeId: string,
    accountType: string
  }[] = [];

  details: {
    accountNumber: string;
    balance: string;
    accountName: string;
    accountTypeId: string;
    accountType: string;
    status: string,
    code: string;
    message: string
  } = {
      "accountNumber": "",
      "balance": "",
      "accountName": "",
      "accountTypeId": "",
      "accountType": "",
      "status": "",
      "code": "",
      "message": "",
    }

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
      acc2Credit: ['', [Validators.required, Validators.minLength(10)]],
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

    this.deviceId = this.globalMethods.getUserData2('deviceID') || '';
  }

  ngOnInit() {
  }

  async validateAccount() {
    const loading = await this.globalMethods.presentLoading();

    try {
      if (this.FormData.controls['acc2Credit'].invalid) {
        this.globalMethods.presentAlert("Error", "Invalid float account number");
        loading.dismiss();
        return;
      }

      this.queryData = {
        account: this.FormData.controls['acc2Credit'].value,
        requestedBy: this.user.userId,
        terminalId: this.deviceId,
        customerId: this.user.customerId,
        //TODO ADD PRODUCT ID
        productId: ""
      }

      this.finance.PostData(this.queryData, "").subscribe({
        next: (data) => {
          try {
            if (!data || data.status !== "SUCCESS" || data.code !== "200") {
              this.globalMethods.presentAlert(
                "Error",
                data.message || "Invalid PRN response"
              );
              return;
            }

            this.details = data.accountDetails

          } catch (parseError) {
            this.globalMethods.presentAlert("Error", "Unable to process server response");
          } finally {
            loading.dismiss();
          }
        },
        error: (error) => {

        }
      })

    } catch (error) {
      console.error("Exception in queryPRN:", error);
      this.globalMethods.presentAlert("Exception", "Unexpected error occurred");
      loading.dismiss();
    }
  }

  async transferFloat() {
    const loading = await this.globalMethods.presentLoading();

    try {

      if (this.FormData.invalid) {

      }

      const floatAccount = this.accounts.find(account =>
        account.accountName.toLowerCase() === "float account"
      );

      const floatAccountBalance = floatAccount ? floatAccount.balance : null;

      // Validate transaction amount
      const transactionAmount = this.FormData.controls['amount'].value;

      // Check for insufficient funds
      if (floatAccountBalance === null) {
        loading.dismiss();
        this.globalMethods.presentAlert("Error", "Float account not found");
        return;
      }

      if (transactionAmount > floatAccountBalance) {
        loading.dismiss();
        this.globalMethods.presentAlert("Error", "Insufficient funds");
        return;
      }
      // Check transaction limit
      if (transactionAmount > this.user.transactionLimit) {
        loading.dismiss();
        this.globalMethods.presentAlert("Error", "Amount exceeds your transaction limit");
        return;
      }

        const floatAccountNumber = this.accounts.find(account => account.accountName === 'float account')?.accountNumber || null;

        this.transactionData = {
          accountToDebit: floatAccountNumber,
          accountToCredit: this.FormData.controls['acc2Credit'].value,
          amount: this.FormData.controls['amount'].value,
          modeOfPayment: "account-account",
          transactionType: "transferFloat",
          transferedBy: this.user.userId,
          remarks: this.FormData.controls['remarks'].value,
          terminalId: this.deviceId,
        }

        console.log("Transferfloat Data:", this.transactionData)

        this.finance.PostData(this.transactionData, "TransferFloat").subscribe({
          next: (data) => {
            try {
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
              else {
                this.globalMethods.presentAlert('Failed', 'Transaction failed')
              }
            } catch (parseError) {
              console.log("Transfer float error:", parseError)
              this.globalMethods.presentAlert("Error", "Unable to process server response");
            } finally {
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
