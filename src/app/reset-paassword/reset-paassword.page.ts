import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../sharkServices/authentication.service';
import { ContactUSPageRoutingModule } from '../contact-us/contact-us-routing.module';
import { GlobalMethodsService } from '../helpers/global-methods.service';
import { Router } from '@angular/router';

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
  selector: 'app-reset-paassword',
  templateUrl: './reset-paassword.page.html',
  styleUrls: ['./reset-paassword.page.scss'],
})
export class ResetPaasswordPage implements OnInit {
  resetPasswordForm: FormGroup;
  deviceId: string = "";

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
    public authService: AuthenticationService,
    public globalMethods: GlobalMethodsService,
    private router: Router,

  ) {
    this.resetPasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
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

    this.deviceId = this.globalMethods.getUserData2('deviceID') || '';

  }

  ngOnInit() {
    console.log("")
  }

  async resetPassword() {
    const loading = await this.globalMethods.presentLoading();
    try {
      console.log('Device', this.deviceId)
      const postData = {
        username: this.user.username,
        oldPassword: this.resetPasswordForm.controls['oldPassword'].value.toString(),
        newPassword: this.resetPasswordForm.controls['newPassword'].value.toString(),
        customerId: this.user.customerId, 
        updatedBy: this.user.userId,
        device: this.deviceId,
      }

      console.log('Reset PWD Data', postData)
      this.authService.PostData(postData, 'ResetPassword').subscribe({
        next: (data) => {
          try {
            console.log('Reset pwd resp', data)
            if (!data || data.status !== "SUCCESS" || data.code !== "200") {
              this.globalMethods.presentAlert(
                "Error",
                data.message
              );
              return;
            }

            this.globalMethods.presentAlert(
              "Success",
              data.message
            )

            this.router.navigate(['/login']);

          } catch (parseError) {
            this.globalMethods.presentAlert("Error", "Unable to process server response");
          } finally {
            loading.dismiss();
          }
        },
        error: (error) => {
          this.globalMethods.presentAlert(
            "Error",
            error.message || "Network request failed"
          );
          loading.dismiss();
        }
      })
    } catch (error: any) {
      this.globalMethods.presentAlert("Exception", error.message);
      loading.dismiss();
    }
  }
}
