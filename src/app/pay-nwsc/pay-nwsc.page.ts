import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinanceService } from '../sharkServices/finance.service';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { GlobalMethodsService } from '../helpers/global-methods.service';

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

interface Area {
  area: string;
}

@Component({
  selector: 'app-pay-nwsc',
  templateUrl: './pay-nwsc.page.html',
  styleUrls: ['./pay-nwsc.page.scss'],
})
export class PayNWSCPage implements OnInit {
  payNWSCForm: FormGroup;
  queryData: object = {}
  transactionData: object = {}
  meterValidated: boolean = false;
  deviceId: string = "";
  productID: string = "";
  nwscCommission: string = "";

  areas: Area[] = [];

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
    private formBuilder: FormBuilder,
    private finance: FinanceService,
    public loadingController: LoadingController,
    private alertController: AlertController,
    public navCtrl: NavController,
    public globalMethods: GlobalMethodsService
  ) {
    this.payNWSCForm = this.formBuilder.group({
      meterNumber: ['', [Validators.required]],
      area: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(3)]],
      charges: ['', [Validators.required]],
      commission: ['', [Validators.required]],
      outstandingBalance: ['', [Validators.required]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^(\+256|0)[7-9]\d{8}$/)],
      ],
      name: ['', Validators.required],
      // source: ['', Validators.required],
      registrationStatus: [''],
      // customerID: ['', Validators.required],
      // account: ['', [Validators.required]],
      // initiator: ['', Validators.required],
    });

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

    this.deviceId = this.globalMethods.getUserData2('deviceID') || '';
  }

  ngOnInit() {
    this.queryNWSCAreas();
  }

  ionViewWillEnter() {
  }

  async queryNWSC(meterNO: string) {
    const loading = await this.globalMethods.presentLoading();

    try {
      if (this.payNWSCForm.controls['meterNumber'].invalid) {
        this.globalMethods.presentAlert("Error", 'Invalid meter number')
        loading.dismiss();
        return
      }

        this.queryData = {
          customerReferenceNumber: this.payNWSCForm.controls['meterNumber'].value,
          area: this.payNWSCForm.controls['area'].value,
          requestedBy: this.user.userId,
          source: "APP",
          customerId: this.user.customerId,
          terminalId: this.deviceId.toString(),
          amount: this.payNWSCForm.controls['amount'].value.toString(),
        }

      console.log('Querying NWSC:', this.queryData);

      this.finance.PostData(this.queryData, "QueryNWSC").subscribe({
        next: (data) => {
          try {
            const s = JSON.stringify(data);
            const resp = JSON.parse(s);
            loading.dismiss();
            // Validate response
            if (!data || data.status !== "SUCCESS" || data.code !== "200") {
              this.globalMethods.presentAlert(
                "Error",
                data.message || "Invalid Meter response"
              );
              return;
            }

              this.meterValidated = true;
            this.productID = resp.details.productId;
            this.nwscCommission = resp.details.commission;
            this.payNWSCForm.patchValue({
              name: resp.details.name,
              outstandingBalance: resp.details.outstandingBalance,
              charges: resp.details.charges,
              commission: resp.details.commission,
              customerID: resp.details.customerReferenceNumber,
              registrationStatus: resp.details.registrationStatus || 'Not Registered',
            })

          } catch {

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
    } catch (error) {
      console.error("Exception in queryNWSC:", error);
      this.globalMethods.presentAlert("Exception", "Unexpected error occurred");
      loading.dismiss();
    }
  }

  async queryNWSCAreas() {
    const loading = await this.globalMethods.presentLoading();

    try {
      // if (this.payNWSCForm.controls['meterNumber'].invalid || this.payNWSCForm.controls['amount'].invalid) {
      //   this.globalMethods.presentAlert("Error", 'Invalid meter number or amount')
      //   loading.dismiss();
      //   return
      // }

      console.log('Querying areas');
        this.queryData = {
          source: "APP",
          terminalId: this.deviceId.toString(),
          customerId: this.user.customerId,
          initiatedBy: this.user.userId,
        }

      this.finance.PostData(this.queryData, "QueryAreas").subscribe({
          next: (data) => {
            try {
              const s = JSON.stringify(data);
              const resp = JSON.parse(s);
              loading.dismiss();
              console.log('Query areas response:', resp);

              if (!resp.areas) {
                this.globalMethods.presentAlert(
                  "Error", "An error occured while fetching areas"
                );
                return;
              }

              this.areas = resp.areas;
              console.log('Areas:', this.areas);
            } catch (error) {
              console.error("Query areas error:", error);
              loading.dismiss();
            }
          },
          error: (error) => {
            console.error("Query areas error:", error);
            this.globalMethods.presentAlert(
              "Error",
              error.message || "Network request failed"
            );
            loading.dismiss();
          }
        })

    } catch (error) {
      console.error("Exception in queryPRN:", error);
      this.globalMethods.presentAlert("Exception", "Unexpected error occurred");
      loading.dismiss();
    }
  }

  async payNWSC() {
    const loading = await this.globalMethods.presentLoading();

    try {
      if (this.payNWSCForm.invalid) {
        loading.dismiss()
        this.globalMethods.presentAlert('Error', 'Missing required values')
        return
      }

      // const floatAccount = this.accounts.find(account =>
      //   account.accountName.toLowerCase() === "float account"
      // );

      // const floatAccountBalance = floatAccount ? floatAccount.balance : null;

      // // Validate transaction amount
      // const transactionAmount = this.payNWSCForm.controls['amount'].value;

      // // Check for insufficient funds
      // if (floatAccountBalance === null) {
      //   loading.dismiss();
      //   this.globalMethods.presentAlert("Error", "Float account not found");
      //   return;
      // }

      // if (transactionAmount > floatAccountBalance) {
      //   loading.dismiss();
      //   this.globalMethods.presentAlert("Error", "Insufficient funds");
      //   return;
      // }
      // // Check transaction limit
      // if (transactionAmount > this.user.transactionLimit) {
      //   loading.dismiss();
      //   this.globalMethods.presentAlert("Error", "Amount exceeds your transaction limit");
      //   return;
      // }

        this.transactionData = {
          customerReferenceNumber: this.payNWSCForm.controls['meterNumber'].value,
          accountToDebit: this.accounts.find(account => account.accountName === 'float account')?.accountNumber,
          area: this.payNWSCForm.controls['area'].value,
          amount: this.payNWSCForm.controls['amount'].value.toString(),
          name: this.payNWSCForm.controls['name'].value,
          outstandingBalance: this.payNWSCForm.controls['outstandingBalance'].value,
          registrationStatus: this.payNWSCForm.controls['registrationStatus'].value,
          paymentMode: "CASH",
          paymentIdentity: "11",
          phonenumber: this.payNWSCForm.controls['phoneNumber'].value,
          source: "APP",
          terminalId: this.deviceId.toString(),
          customerId: this.user.customerId,
          productId: this.productID,
          charges: this.payNWSCForm.controls['charges'].value,
          initiatedBy: this.user.userId,
          commission: this.nwscCommission
        }

      console.log('Transaction data:', this.transactionData);
      this.finance.PostData(this.transactionData, "PostNWSC").subscribe({
        next: (data) => {
          const s = JSON.stringify(data);
          const resp = JSON.parse(s);

          if (resp.code !== '200' || resp.status.toUpperCase() !== 'SUCCESS') {
            this.globalMethods.presentAlert(
              "Error", resp.Message || "An error occured. Please try again"
            );
            return;
          }

          console.log('Post NWSC response:', resp);
          this.globalMethods.presentAlert('Success', 'Transaction completed')

          const receiptData = {
            transactionID: resp.transactionId,
            account: this.accounts.find(account => account.accountName === 'float account')?.accountNumber,
            amount: this.payNWSCForm.controls['amount'].value,
            product: 'NWSC',
            transactionReference: resp.transactionId || '0',
            externalReference: null,
            transferedBy: this.user.customerId,
            transDate: this.globalMethods.getDate(),
            customerName: this.user.names,
            charges: this.payNWSCForm.controls['charges'].value.toString(),
            commission: this.nwscCommission,
            contact: this.payNWSCForm.controls['phoneNumber'].value.toString()
          }

          const navigationExtras: NavigationExtras = {
            queryParams: {
              transaction: JSON.stringify(receiptData),
            },
          };

          this.navCtrl.navigateForward('print', navigationExtras);

        },
        error: (error) => {
          console.error("Post NWSC error:", error);
          this.globalMethods.presentAlert(
            "Error",
            error.message || "Network request failed"
          );
          loading.dismiss();
        }
      })
    }
    catch (error) {
      loading.dismiss()
      console.log('Exception in payNWSC', error)
      this.globalMethods.presentAlert('Exception', 'An unknown error occured')
    }
    finally {
      loading.dismiss()
    }
  }

  submitForm() {
    if (this.payNWSCForm.valid) {
      const formData = this.payNWSCForm.value;
      console.log('Form submitted:', formData);
      // Add logic to process the payment (e.g., call an API)
    } else {
      console.log('Form is invalid');
    }
  }
}
