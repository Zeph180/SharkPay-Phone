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

  areas: string[] = [];

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
      meterNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      area: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      charges: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^(\+256|0)[7-9]\d{8}$/)],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', Validators.required],
      source: ['', Validators.required],
      prnStatus: ['', Validators.required],
      customerID: ['', Validators.required],
      account: ['', [Validators.required]],
      initiator: ['', Validators.required],
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

  }

  ionViewWillEnter() {
    this.queryNWSCAreas();
  }

  async presentLoading(message: string = 'Please wait...') {
    const loading = await this.loadingController.create({
      message,
      translucent: true,
      cssClass: 'my-custom-loader',
      backdropDismiss: true,
      spinner: 'lines-sharp',
      animated: true,
    });
    await loading.present();
    return loading;
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
          requestedBy: "18"
        }

      this.finance.PostData(this.queryData, "QueryNWSC").subscribe({
        next: (data) => {
          try {
            const s = JSON.stringify(data);
            const resp = JSON.parse(s);
            loading.dismiss();
            if (resp.CODE == '200' && resp.details) {

              this.meterValidated = true;
              //TODO Populate non editable values got from api
            }
            else {
              this.globalMethods.presentAlert("Error", resp.message)
            }
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
      if (this.payNWSCForm.controls['meterNumber'].valid) {
        this.queryData = {
          customerReferenceNumber: "",
          area: "",
          amount: "",
          name: "",
          outstandingBalance: "",
          registrationStatus: "",
          paymentMode: "",
          paymentIdentity: "",
          phoneNumber: "",
          source: "",
          terminalId: this.deviceId.toString(),
          customerId: "",
          productId: "",
        }

        this.finance.PostData(this.queryData, "/QueryAreas").subscribe({
          next: (data) => {
            try {
              const s = JSON.stringify(data);
              const resp = JSON.parse(s);
              loading.dismiss();

              if (!resp.areas) {
                this.globalMethods.presentAlert(
                  "Error", "An error occured while fetching areas"
                );
                return;
              }

              this.areas = resp.areas;
            } catch {

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
      }
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

      const floatAccount = this.accounts.find(account =>
        account.accountName.toLowerCase() === "float account"
      );

      const floatAccountBalance = floatAccount ? floatAccount.balance : null;

      // Validate transaction amount
      const transactionAmount = this.payNWSCForm.controls['amount'].value;

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

        this.transactionData = {
          accountToDebit: this.accounts.find(account => account.accountName === 'float account')?.accountNumber,
          customerReferenceNumber: this.payNWSCForm.controls['meterNumber'].value,
          area: this.payNWSCForm.controls['area'].value,
          amount: this.payNWSCForm.controls['amount'].value,
          name: this.payNWSCForm.controls['name'].value,
          phonenumber: this.payNWSCForm.controls['phoneNumber'].value,
          charges: this.payNWSCForm.controls['charges'].value,
          initiatedBy: this.user.userId,
          source: "APP",
          customerId: this.payNWSCForm.controls['customerID'].value,
          terminalId: this.deviceId.toString(),
          //TODO Add pay nwsc productID
          productId: "1"
        }

      this.finance.PostData(this.transactionData, "PostNWSC").subscribe(
          (data) => {
            const s = JSON.stringify(data);
            const resp = JSON.parse(s);
            loading.dismiss();

          if (resp.code !== '200' || resp.status.toUpperCase() !== 'SUCCESS') {
            this.globalMethods.presentAlert(
              "Error", resp.Message || "An error occured. Please try again"
            );
            return;
          }

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

            //TODO Add commission amount  and charges
            charges: '0',
            commission: '0',
            contact: this.payNWSCForm.controls['phoneNumber'].value.toString()
          }

              const navigationExtras: NavigationExtras = {
                queryParams: {
                  special: JSON.stringify(receiptData),
                },
              };

              this.navCtrl.navigateForward('print', navigationExtras);

          }
        )
    }
    catch {
      loading.dismiss()
      this.globalMethods.presentAlert('Exception', 'An unknown error occured')
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
