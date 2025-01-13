import { Component, DestroyRef, OnInit } from '@angular/core';
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
  accountValidated: boolean = false;
  productID: string = "";

  public accounts: {
    accountNumber: string,
    balance: string,
    accountName: string,
    accountTypeId: string,
    accountType: string
  }[] = [];

  details: {
    accountDetails: {
      customerID: string;
      customerName: string;
      accountNumber: string;
      accountType: string;
      status: string;
      productId: string
    };
    code: string;
    message: string;
  } = {
      code: "",
      message: "",
      accountDetails: {
        accountNumber: "",
        accountType: "",
        customerID: "",
        customerName: "",
        status: "",
        productId: ""
      }
    };

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
      accName: ['', Validators.required],
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

      console.log("Query Data:", this.queryData)

      this.finance.PostData(this.queryData, "validateAccount").subscribe({
        next: (data) => {
          try {

            if (!data || data.status !== "SUCCESS" || data.code !== "200") {
              console.log("validate error: ", data)
              this.globalMethods.presentAlert(
                "Error",
                data.message || "Invalid account"
              );
              return;
            }

            console.log("Data: ", data)

            this.details = data || {};
            // if (this.details.message.toUpperCase() === 'SUCCESS' || this.details.accountDetails.accountName !== "float account") {
            //   this.globalMethods.presentAlert(
            //     "Error", this.details.message || "Invalid Account"
            //   );
            //   return;
            // }

            this.accountValidated = true;
            this.productID = data.accountDetails.productId

            this.FormData.patchValue({
              accName: this.details.accountDetails.customerName
            })
          } catch (error) {
            console.log("Error: ", error)
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
        }
      })
    } catch (error) {
      console.error("Exception in queryPRN:", error);
      this.globalMethods.presentAlert("Exception", "Unexpected error occurred");
    } finally {
      loading.dismiss();
    }
  }

  async transferFloat() {
    const loading = await this.globalMethods.presentLoading();

    try {
      if (this.FormData.invalid) {
        this.globalMethods.presentAlert("Error", "Missing required values");
        return;
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
          amount: this.FormData.controls['amount'].value.toString(),
          modeOfPayment: "12",
          transactionType: "11",
          transferedBy: this.user.userId,
          remarks: this.FormData.controls['remarks'].value,
          source: "APP",
          terminalId: this.deviceId.toString(),
          customerId: this.user.customerId,
          productId: this.details.accountDetails.productId
        }

        console.log("Transferfloat Data:", this.transactionData)

        this.finance.PostData(this.transactionData, "TransferFloat").subscribe({
          next: (data) => {
            try {
              const s = JSON.stringify(data);
              const resp = JSON.parse(s);
              loading.dismiss();
              if (resp.code !== '200' || resp.status.toUpperCase() !== 'SUCCESS') {
                this.globalMethods.presentAlert(
                  'Failed', resp.message || 'Transaction failed'
                );
                return;
              }

                this.globalMethods.presentAlert('Success', 'Transaction completed')

                const receiptData = {
                  transactionID: resp.transactionId || '0',
                  account: floatAccountNumber,
                  amount: this.FormData.controls['amount'].value.toString(),
                  product: 'Transfer Float',
                  transactionReference: resp.transactionId || '0',
                  externalReference: null,
                  transferedBy: this.user.customerId,
                  transDate: this.globalMethods.getDate(),
                  customerName: this.user.names,
                  charges: 0,
                  contact: "N/A",
                }

                const navigationExtras: NavigationExtras = {
                  queryParams: {
                    transaction: JSON.stringify(receiptData),
                  },
                };

                this.navCtrl.navigateForward('print', navigationExtras);

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
