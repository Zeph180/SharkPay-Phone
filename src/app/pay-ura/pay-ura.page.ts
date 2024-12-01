import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinanceService } from '../sharkServices/finance.service';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
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
    private alertController: AlertController,
    public navCtrl: NavController,
    private globalMethods: GlobalMethodsService
  ) {
    this.FormData = this.fb.group({
      tin: ['', Validators.minLength(10)],
      prn: ['', [Validators.required, Validators.minLength(10)]],
      amount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      charges: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      payerName: ['', Validators.required],
      source: ['', Validators.required],
      prnStatus: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
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
      if (!this.FormData.controls['prn'].valid) {
        this.globalMethods.presentAlert("Error", "Invalid PRN number");
        loading.dismiss();
        return;
      }

      // Prepare query data
      this.queryData = {
        prn: prn.toString(),
        requestedBy: this.user.customerId,
      };

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
            const details = data.details || {};

            if (details.statusDesc !== "available") {
              this.globalMethods.presentAlert(
                "Error", details.statusDesc || "Invalid PRN"
              );
              return;
            }

            this.prnValidated = true;

            this.FormData.patchValue({
              prnStatus: details.statusDesc || '',
              payerName: details.taxpayername || '',
              amount: details.amount || '',
              tin: details.tin || '',
              charges: details.charges || '0'
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

        this.transactionData = {
          accountToDebit: floatAccountNumber,
          prn: this.FormData.controls['prn'].value,
          prnStatusCode: this.FormData.controls['prnStatus'].value,
          taxPayerName: this.FormData.controls['payerName'].value,
          amount: this.FormData.controls['amount'].value,
          tin: this.FormData.controls['tin'].value,
          charges: this.FormData.controls['charges'].value,
          initiatedBy: this.user.customerName,
          source: this.FormData.controls['source'].value,
          customerID: this.user.customerId,
        }
        console.log("postura trandata : ", this.transactionData)
        this.finance.PostData(this.transactionData, "PostURA").subscribe(
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
              console.log("PostUraResp : ", resp)
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
