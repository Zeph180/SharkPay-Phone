import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { GlobalMethodsService } from './helpers/global-methods.service';

register();

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
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Payments', url: '/payments', icon: 'shuffle' },
    { title: 'Transactions', url: '/transactions', icon: 'list' },
    { title: 'Account', url: '/my-account', icon: 'person' },
    // { title: 'Print', url: '/print', icon: 'warning' },
    { title: 'App Updates', url: '/', icon: 'appstore' },
    { title: 'Contact us', url: '/contact-us', icon: 'call' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  showMenu = true;

  public accounts: {
    accountNumber: string
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

  public floatAccountNumber: string = ""

  constructor(
    private router: Router,
    private globalMethods: GlobalMethodsService,
  ) {
    // Subscribe to route changes
    this.router.events.subscribe(() => {
      // Hide the menu on the login page
      this.showMenu = !this.router.url.includes('/login');
      console.log(this.showMenu)
    });
  }
  ngOnInit() {
    // this.globalMethods.getAccountsObservable().subscribe((accounts) => {
    //   if (accounts) {
    //     this.accounts = accounts;
    //     console.log('Accounts updated:', this.accounts);
    //     this.floatAccountNumber = this.accounts.find(account => account.accountName === 'float account')?.accountNumber || '';
    //   }
    // });

    this.globalMethods.getUserObservable().subscribe((user) => {
      if (user) {
        this.user = user;
        console.log('User information updated:', this.user);
      }
    });

    // Initialize user on app load
    const storedUser = this.globalMethods.getUserData<User>('user') || {
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
    if (storedUser) {
      this.user = storedUser;
    }
  }

  async logOut() {
    try {
      this.globalMethods.logout(this.router)
    }
    catch {
      this.globalMethods.presentAlert("Error", "Error logging out. Please try again")
    }
  }
}
