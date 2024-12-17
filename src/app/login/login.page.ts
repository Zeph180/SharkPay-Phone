import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../sharkServices/authentication.service';
import { Router } from '@angular/router';
import { GlobalMethodsService } from '../helpers/global-methods.service';
import { Device } from '@capacitor/device';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  username: string = '';
  password: string = '';
  deviceInfo: any;
  deviceID: { identifier: string } = { identifier: '' };


  // Hardcoded credentials (for demo purposes)
  private correctUsername: string = 'testuser';
  private correctPassword: string = 'test123';

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private globalMethods: GlobalMethodsService,
    private router: Router,
    private formBuilder: FormBuilder,
    public loadingController: LoadingController,
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async ngOnInit() {
    await this.getDeviceInfo();
  }

  onLogin() {
    if (this.username === this.correctUsername && this.password === this.correctPassword) {
      // On successful login, navigate to the home page
      console.log('Login successful');
      this.navCtrl.navigateRoot('/home');  // Redirect to home page
    } else {
      // On failed login, show an error message
      console.log('Invalid credentials');
      alert('Invalid username or password');
    }
  }

  async presentLoading(message: string = 'Please wait...') {
    const loading = await this.loadingController.create({
      message: message,
      translucent: true,
      cssClass: 'my-custom-loader',
      backdropDismiss: true,
      spinner: 'lines-sharp',
      animated: true,
    });
    await loading.present();
    return loading;
  }

  async onLogi1n() {
    const loading = await this.presentLoading();
    try {
      if (this.loginForm.valid) {

        const postData = {
          username: this.loginForm.controls['username'].value,
          password: this.loginForm.controls['password'].value.toString(),
          device: this.deviceID.identifier
        };
        this.loginForm.reset();

        console.log("Logindata: ", postData)
        // Call the login method of AuthService
        this.authService.UserLogin(postData).subscribe((response) => {
          loading.dismiss();
          console.log("login resp: ", response)
          if (response.code === '200') {
            // Store the token or any user data for later use
            this.authService.storeUserData('accessToken', response.accessToken.accessToken);
            this.authService.storeUserData('user', JSON.stringify(response.user));
            this.authService.storeUserData('accounts', JSON.stringify(response.accounts));

            //this.router.navigate(['/home']);

            //TODO CONDITIONALLY NAVIGATE
            console.log("USER: ", response.user)
            if (response.user.ispasswordChangeRequired === 'True') {
              console.log("IN PASSWORD RESET", response.user.ispasswordChangeRequired)
              this.router.navigate(['/reset-paassword']);
            }
            else {
              // Navigate to home page on successful login
              this.router.navigate(['/home']);
            }

          } else {
            console.log('Invalid credentials');
            alert('Invalid username or password');
          }
        },
          (error) => {
            console.log('Error:', error);
            loading.dismiss();
            alert('An error occurred. Please try again later.');
          }
        );
      } else {
        alert('Please fill in all the fields.');
      }
    } catch (error) {
      //TODO Present alert
      loading.dismiss()
      console.error(error)
      this.globalMethods.presentAlert("Exception", "An unknown error occured")
    }
  }

  async getDeviceInfo() {
    try {
      // Retrieve device information
      this.deviceInfo = await Device.getInfo();
      this.deviceID = await Device.getId();
      this.authService.storeUserData('deviceID', this.deviceID.identifier.toString());
    } catch (error) {
      console.error('Error fetching device info:', error);
    }
  }
}
