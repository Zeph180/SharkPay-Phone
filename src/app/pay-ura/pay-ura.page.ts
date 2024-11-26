import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinanceService } from '../sharkServices/finance.service';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule


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

  constructor(
    private fb: FormBuilder,
    private finance: FinanceService,
    public loadingController: LoadingController,
    private alertController: AlertController,
    public navCtrl: NavController,
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

  async presentAlert(headerText: string, message: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: headerText,
      message: message,
      buttons: ['Dismiss'],
      animated: true,
    });

    await alert.present();
  }


  hasError(controlName: string, errorName: string): boolean {
    return this.FormData.controls[controlName].hasError(errorName);
  }

  async queryPRN(prn: string) {
    try {
      if (this.FormData.controls['Prn'].valid) {
        this.queryData = {
          prn,
          requestedBy: ""
        }

        const loading = await this.presentLoading();

        this.finance.PostData(this.queryData, "/QueryURA").subscribe(
          (data) => {
            const s = JSON.stringify(data);
            const resp = JSON.parse(s);
            loading.dismiss();
            if (resp.CODE == '1000') {
              this.prnValidated = true;
              this.FormData.controls['tin'].setValue(resp.MESSAGE);
            }
            else {

            }
          }
        )
      }
    } catch (error) {
      this.presentAlert('Exception', 'An unknown error occured')
    }
  }

  async payPRN() {
    try {
      if (this.FormData.valid) {
        const loading = await this.presentLoading();

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
            if (resp.CODE == '1000') {
              this.presentAlert('Success', 'Transaction completed')
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
              this.presentAlert('Failed', 'Transaction failed')
            }
          }
        )
      }
    }
    catch {
      this.presentAlert('Exception', 'An unknown error occured')
    }
  }
}
