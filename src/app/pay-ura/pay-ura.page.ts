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
  accounts = [
    { accNo: '123456' },
    { accNo: '369852' },
    { accNo: '147852' },
  ];

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
      account: ['', [Validators.required]],
      tin: ['', [Validators.required, Validators.minLength(10)]],
      prn: ['', [Validators.required, Validators.minLength(10)]],
      amount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      charges: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      payerName: ['', Validators.required],
      initiator: ['', Validators.required],
      source: ['', Validators.required],
      prnStatus: ['', Validators.required],
      customerID: ['', Validators.required],
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

  hasError(controlName: string, errorName: string): boolean {
    return this.FormData.controls[controlName].hasError(errorName);
  }


  async queryPRN(prn: string) {
    const loading = await this.globalMethods.presentLoading()
    try {
      if (this.FormData.controls['Prn'].valid) {
        this.queryData = {
          prn,
          requestedBy: this.user.customerId
        }

        this.finance.PostData(this.queryData, "/QueryURA").subscribe(
          (data) => {
            const s = JSON.stringify(data);
            const resp = JSON.parse(s);
            loading.dismiss()
            if (resp.CODE == '200') {
            //   {
            //     "status": "SUCCESS",
            //     "code": "200",
            //     "message": null,
            //     "details": {
            //         "prn": "2250006676819",
            //         "taxpayername": "",
            //         "amount": "",
            //         "tin": "",
            //         "prnStatus": "n",
            //         "statusDesc": "invalid prn",
            //         "charges": "0"
            //     }
            // }
              this.prnValidated = true;
              this.FormData.controls['tin'].setValue(resp.MESSAGE);
              this.FormData.controls['prnStatus'].setValue(resp.details.statusDesc);
              this.FormData.controls['payerName'].setValue(resp.details.taxpayername);
              this.FormData.controls['amount'].setValue(resp.details.amount);
              this.FormData.controls['tin'].setValue(resp.details.tin);
              this.FormData.controls['charges'].setValue(resp.details.charges);
              this.FormData.controls['prnStatus'].setValue(resp.details.prnStatus);
            }
            else {
              this.globalMethods.presentAlert('Error', resp.message)
            }
          }
        )
      }
    } catch (error) {
      this.globalMethods.presentAlert('Exception', 'An unknown error occured')
    }
  }

  async payPRN() {
    const loading = await this.globalMethods.presentLoading();

    try {
      if (this.FormData.valid) {

        this.transactionData = {
          accountToDebit: this.FormData.controls['account'].value,
          prn: this.FormData.controls['prn'].value,
          prnStatusCode: this.FormData.controls['prnStatus'].value,
          taxPayerName: this.FormData.controls['payerName'].value,
          amount: this.FormData.controls['amount'].value,
          tin: this.FormData.controls['tin'].value,
          charges: this.FormData.controls['charges'].value,
          initiatedBy: this.FormData.controls['initiator'].value,
          source: this.FormData.controls['source'].value,
          customerID: this.FormData.controls['customerID'].value,
        }

        this.finance.PostData(this.transactionData, "/PostURA").subscribe(
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
