import { CommissionTransactionsPage } from './../commission-transactions/commission-transactions.page';
import { FinanceService } from './../sharkServices/finance.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-pay-umeme',
  templateUrl: './pay-umeme.page.html',
  styleUrls: ['./pay-umeme.page.scss'],
})
export class PayUMEMEPage implements OnInit {
  FormData!: FormGroup;
  queryData: object = {};
  transactionData: object = {}
  deviceId: string = "";
  meterValidated: boolean = false;
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

  details: {
    customerMeterNumber: string;
    customerName: string;
    type: string;
    credit: string;
    balance: string;
    statusDesc: string;
    charges: string;
    commission: string;
    productId: string
  } = {
      customerMeterNumber: '',
      customerName: '',
      type: '0',
      credit: '',
      balance: '',
      statusDesc: '',
      charges: '0',
      commission: '',
      productId: ''
    };

  public accounts: {
    accountNumber: string,
    balance: string,
    accountName: string,
    accountTypeId: string,
    accountType: string
  }[] = []

  constructor(
    private fb: FormBuilder,
    public globalMethods: GlobalMethodsService,
    public finance: FinanceService,
    public navCtrl: NavController,
  ) {
    this.FormData = this.fb.group({
      meterNumber: ['', [Validators.required, Validators.minLength(10)]],
      type: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      payerName: ['', Validators.required],
      credit: [''],
      balance: [''],
      charges: [''],
      commission: ['', Validators.required],
      phone: ['', [Validators.minLength(10), Validators.minLength(10), Validators.maxLength(13), Validators.required]],
    });

    this.deviceId = this.globalMethods.getUserData2('deviceID') || '';

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

    this.accounts = this.globalMethods.getUserData<{
      accountNumber: string;
      balance: string;
      accountName: string;
      accountTypeId: string;
      accountType: string;
    }[]>('accounts') || [];

    this.FormData.reset();
  }

  ngOnInit() {

  }

  async queryMeter() {
    const loading = await this.globalMethods.presentLoading();

    try {
      if (this.FormData.controls['meterNumber'].invalid || this.FormData.controls['amount'].invalid) {
        this.globalMethods.presentAlert("Error", "Invalid meter number or amount");
        loading.dismiss();
        return;
      }

      // Prepare query data
      this.queryData = {
        customerMeterNumber: this.FormData.controls['meterNumber'].value.toString(),
        amount: this.FormData.controls['amount'].value.toString(),
        requestedBy: this.user.userId,
        source: "APP",
        customerId: this.user.customerId,
        terminalId: this.deviceId.toString(),
      };

      console.log("QueryPrn Data: ", this.queryData)

      // Perform API call
      this.finance.PostData(this.queryData, "queryumeme").subscribe({
        next: (data) => {
          try {
            // Validate response
            if (!data || data.status !== "SUCCESS" || data.code !== "200") {
              this.globalMethods.presentAlert(
                "Error",
                data.message || "Invalid PRN response"
              );
              return;
            }

            // Safely populate form controls
            this.details = data.details || {};
            // if (this.details.statusDesc !== "available") {
            //   this.globalMethods.presentAlert(
            //     "Error", this.details.statusDesc || "Invalid PRN"
            //   );
            //   return;
            // }

            this.meterValidated = true;

            this.FormData.patchValue({
              prnStatus: this.details.statusDesc || '',
              payerName: this.details.customerName || '',
              type: this.details.type || '',
              credit: this.details.credit || '',
              balance: this.details.balance || '0',
              charges: this.details.charges || '0',
              commission: this.details.commission || '0'
            });
          } catch (parseError) {
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
      });
    } catch (error) {
      console.error("Exception in queryPRN:", error);
      this.globalMethods.presentAlert("Exception", "Unexpected error occurred");
      loading.dismiss();
    }
  }

  async payUmeme() {
    const loading = await this.globalMethods.presentLoading();

    try {
      if (this.FormData.valid) {
        const floatAccountNumber = this.accounts.find(account => account.accountName === 'float account')?.accountNumber || null;

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

        console.log("PRn Details : ", this.details)

        this.transactionData = {
          accountToDebit: floatAccountNumber,
          customerMeterNumber: this.FormData.controls['meterNumber'].value.toString(),
          customerName: this.details.customerName,
          meterType: this.details.type,
          amount: this.FormData.controls['amount'].value.toString(),
          telephone: this.FormData.controls['phone'].value || '',
          charges: this.details.charges,
          initiatedBy: this.user.userId,
          source: "APP",
          customerID: this.user.customerId,
          terminalId: this.deviceId,
          productId: this.details.productId
        }

        console.log("PostUmeme Data : ", this.transactionData)

        this.finance.PostData(this.transactionData, "PostUmeme").subscribe({
          next: (data) => {
            const s = JSON.stringify(data);
            const resp = JSON.parse(s);

            if (resp.code !== '200' || resp.status.toUpperCase() !== 'SUCCESS') {
              this.globalMethods.presentAlert(
                "Error", resp.message || "An error occured. Please try again"
              );
              return;
            }

            const totalAmount = parseFloat(this.FormData.controls['amount'].value) + parseFloat(this.FormData.controls['charges'].value);
            //RECIEPT DATA
            //This i generated on every payment to avoid cluttering the print logic
            const receiptData = {
              transactionID: resp.transactionId,
              account: floatAccountNumber,
              amount: totalAmount,
              product: 'UMEME Payment',
              transactionReference: resp.transactionId || '0',
              externalReference: null,
              transferedBy: this.user.customerId,
              transDate: this.globalMethods.getDate(),
              customerName: this.user.names,
              charges: this.details.charges,
              commission: this.details.commission || '0',
              contact: this.FormData.controls['phone'].value.toString(),
              // prn: this.FormData.controls['prn'].value.toString(),
              payer: this.FormData.controls['payerName'].value,
              userName: this.user.names
            }

            this.globalMethods.presentAlert('Success', 'Transaction completed')
            const navigationExtras: NavigationExtras = {
              queryParams: {
                transaction: JSON.stringify(receiptData),
              },
            };

            this.navCtrl.navigateForward('print', navigationExtras);
          },
          error: (error) => {
            console.error("Query PRN error:", error);
            this.globalMethods.presentAlert(
              "Error",
              error.message || "Network request failed"
            );
          }
        }

        )
      }
      else {
        this.globalMethods.presentAlert("Error", "Missing required values");
      }
    }
    catch (error) {
      console.error('Error details:', error);
      this.globalMethods.presentAlert('Exception', 'An unknown error occurred');
    } finally {
      loading.dismiss();
    }
  }
}
