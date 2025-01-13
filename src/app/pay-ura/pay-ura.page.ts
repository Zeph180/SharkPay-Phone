import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinanceService } from '../sharkServices/finance.service';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
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
  selector: 'app-pay-ura',
  templateUrl: './pay-ura.page.html',
  styleUrls: ['./pay-ura.page.scss'],
})
export class PayUraPage implements OnInit {
  FormData!: FormGroup;
  queryData: object = {}
  transactionData: object = {}
  prnValidated: boolean = false;
  deviceId: string = "";
  details: {
    prn: string;
    taxpayername: string;
    amount: string;
    tin: string;
    prnStatus: string;
    statusDesc: string;
    charges: string;
    commission: string;
    productId: string
  } = {
      prn: '',
      taxpayername: '',
      amount: '0',
      tin: '',
      prnStatus: '',
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
    public loadingController: LoadingController,
    public navCtrl: NavController,
    private globalMethods: GlobalMethodsService
  ) {
    this.FormData = this.fb.group({
      tin: ['', Validators.minLength(10)],
      prn: ['', [Validators.required, Validators.minLength(10)]],
      amount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      charges: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      payerName: ['', Validators.required],
      prnStatus: ['', Validators.required],
      // password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.minLength(10), Validators.maxLength(13)]],
      commission: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
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
    this.resetForm();
  }

  ngOnInit() {

  }

  // Handle form submission
  submit() {
    if (this.FormData.valid) {
      console.log('URA Payment Data:', this.FormData.value);
      // Add logic for payment processing (e.g., send data to the backend)
    } else {
      console.log('Form is invalid');
    }
  }

  async queryPRN(prn: string) {
    const loading = await this.globalMethods.presentLoading();

    try {
      if (this.FormData.controls['prn'].invalid) {
        this.globalMethods.presentAlert("Error", "Invalid PRN number");
        loading.dismiss();
        return;
      }

      // Prepare query data
      this.queryData = {
        prn: prn.toString(),
        requestedBy: this.user.userId,
        accountToDebit: "",
        prnStatusCode: "",
        taxpayername: "",
        amount: "",
        tin: "",
        charges: "",
        initiatedBy: "",
        source: "",
        terminalId: this.deviceId,
        customerId: this.user.customerId,
        productId: "4",
      };

      console.log("QueryPrn Data: ", this.queryData)

      // Perform API call
      this.finance.PostData(this.queryData, "QueryURA").subscribe({
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
            if (this.details.statusDesc !== "available") {
              this.globalMethods.presentAlert(
                "Error", this.details.statusDesc || "Invalid PRN"
              );
              return;
            }

            this.prnValidated = true;

            this.FormData.patchValue({
              prnStatus: this.details.statusDesc || '',
              payerName: this.details.taxpayername || '',
              amount: this.details.amount || '',
              tin: this.details.tin || '',
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

  async payPRN() {
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

        const totalAmount = parseFloat(this.FormData.controls['amount'].value) + parseFloat(this.FormData.controls['charges'].value);

        this.transactionData = {
          accountToDebit: floatAccountNumber,
          prn: this.FormData.controls['prn'].value.toString(),
          prnStatusCode: this.FormData.controls['prnStatus'].value,
          taxPayerName: this.FormData.controls['payerName'].value,
          amount: this.FormData.controls['amount'].value.toString(),
          tin: this.FormData.controls['tin'].value,
          //TODO Update charges to be dynamic from server
          //charges: this.FormData.controls['charges'].value,
          charges: "2550",
          initiatedBy: this.user.userId,
          source: "APP",
          customerId: this.user.customerId,
          phone: this.FormData.controls['phone'].value,
          terminalId: this.deviceId,
          prnStatus: this.details.prnStatus,
          statusDesc: this.details.statusDesc,
          productId: this.details.productId
        }

        console.log("PostPrn Data : ", this.transactionData)

        this.finance.PostData(this.transactionData, "PostURA").subscribe({
          next: (data) => {
            const s = JSON.stringify(data);
            const resp = JSON.parse(s);

            if (resp.code !== '200' || resp.status.toUpperCase() !== 'SUCCESS') {
              this.globalMethods.presentAlert(
                "Error", resp.message || "An error occured. Please try again"
              );
              return;
            }

            //RECIEPT DATA
              //This i generated on every payment to avoid cluttering the print logic
              const receiptData = {
                transactionID: resp.transactionId,
                account: floatAccountNumber,
                amount: totalAmount,
                product: 'URA Payment',
                transactionReference: resp.transactionId || '0',
                externalReference: null,
                transferedBy: this.user.customerId,
                transDate: this.globalMethods.getDate(),
                customerName: this.user.names,
                charges: this.details.charges,
                commission: this.details.commission || '0',
                contact: this.FormData.controls['phone'].value.toString() || '',
                prn: this.FormData.controls['prn'].value.toString(),
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
    }
    catch {
      this.globalMethods.presentAlert('Exception', 'An unknown error occured')
    } finally {
      loading.dismiss();
    }
  }

  resetForm() {
    this.FormData.reset(); // Reset form controls
    this.details = {   // Reset variables to default
      prn: '',
      taxpayername: '',
      amount: '0',
      tin: '',
      prnStatus: '',
      statusDesc: '',
      charges: '0',
      commission: '',
      productId: ''
    };
    this.prnValidated = false;
  }
}
