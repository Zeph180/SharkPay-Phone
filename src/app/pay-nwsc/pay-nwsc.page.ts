import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinanceService } from '../sharkServices/finance.service';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

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


  areas: string[] = ['Kampala', 'Entebbe', 'Mukono', 'Jinja'];

  constructor(
    private formBuilder: FormBuilder,
    private finance: FinanceService,
    public loadingController: LoadingController,
    private alertController: AlertController,
    public navCtrl: NavController,
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
  }

  ngOnInit() {

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

  async queryNWSC(prn: string) {
    try {
      if (this.payNWSCForm.controls['meterNumber'].valid) {
        this.queryData = {
          prn,
          requestedBy: ""
        }

        const loading = await this.presentLoading();

        this.finance.PostData(this.queryData, "/QueryNWSC").subscribe(
          (data) => {
            const s = JSON.stringify(data);
            const resp = JSON.parse(s);
            loading.dismiss();
            if (resp.CODE == '1000') {
              this.meterValidated = true;
              //TODO Populate non editable values got from api
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

  async payNWSC() {
    try {
      if (this.payNWSCForm.valid) {
        const loading = await this.presentLoading();

        this.transactionData = {
          accountToDebit: this.payNWSCForm.controls['account'].value,
          customerReferenceNumber: this.payNWSCForm.controls['meterNumber'].value,
          area: this.payNWSCForm.controls['area'].value,
          amount: this.payNWSCForm.controls['amount'].value,
          name: this.payNWSCForm.controls['name'].value,
          phonenumber: this.payNWSCForm.controls['phoneNumber'].value,
          charges: this.payNWSCForm.controls['charges'].value,
          initiatedBy: this.payNWSCForm.controls['initiator'].value,
          source: this.payNWSCForm.controls['source'].value,
          customerID: this.payNWSCForm.controls['customerID'].value,
        }

        this.finance.PostData(this.transactionData, "/PostNWSC").subscribe(
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
