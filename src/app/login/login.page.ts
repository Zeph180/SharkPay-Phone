import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../sharkServices/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  username: string = '';
  password: string = '';
  // Hardcoded credentials (for demo purposes)
  private correctUsername: string = 'testuser';
  private correctPassword: string = 'test123';

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private router: Router,
    private formBuilder: FormBuilder,
    public loadingController: LoadingController,
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
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

  // async onLogi1n() {
  //   if (this.loginForm.valid) {

  //     const loading = await this.presentLoading();

  //     const postData = {
  //       // Username: this.globalMethodsService.encryptData(this.FormData.controls['username'].value),
  //       // Password: this.globalMethodsService.encryptData(this.FormData.controls['Password'].value),
  //       Username: this.loginForm.controls['username'].value,
  //       Password: this.loginForm.controls['Password'].value
  //     };

  //     // Call the login method of AuthService
  //     this.authService.UserLogin(postData).subscribe(
  //       (response) => {
  //         if (response && response.token) {
  //           // Store the token or any user data for later use
  //           this.authService.storeUserData(response);
  //           console.log('Login successful');
  //           this.router.navigate(['/home']); // Navigate to home page on successful login
  //         } else {
  //           console.log('Invalid credentials');
  //           alert('Invalid username or password');
  //         }
  //       },
  //       (error) => {
  //         console.log('Error:', error);
  //         alert('An error occurred. Please try again later.');
  //       }
  //     );
  //   } else {
  //     alert('Please fill in all the fields.');
  //   }
  // }
}
