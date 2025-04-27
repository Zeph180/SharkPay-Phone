import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalMethodsService } from '../helpers/global-methods.service';
import Swiper from 'swiper';
import { FinanceService } from '../sharkServices/finance.service';

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
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public popularServices = [
    {
      title: 'URA',
      icon: 'phone-portrait-outline',
      color: 'primary',
      route: "/pay-ura"
    },
    {
      title: 'UMEME',
      icon: 'flash-outline',
      color: 'secondary',
      route: "/pay-umeme"
    },
    {
      title: 'TV',
      icon: 'tv-outline',
      color: 'tertiary',
      route: "/airtime"
    },
  ]

  public transactions: {
    transactionID: string;
    account: string;
    amount: string;
    balanceBefore: string;
    balanceAfter: string;
    transType: string;
    productID: string;
    product: string;
    transactionReference: string;
    externalReference: null;
    transferedBy: string;
    remarks: null;
    status: string;
    transDate: string;
    customerID: string;
    customerName: string;
    transferedByName: string;
  }[] = [];

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

  public swiper!: Swiper
  isLoading: boolean = true; // Loader state

  constructor(
    public router: Router,
    private globalMethods: GlobalMethodsService,
    public finance: FinanceService
  ) {
    this.accounts = this.globalMethods.getUserData<{
      accountNumber: string;
      balance: string;
      accountName: string;
      accountTypeId: string;
      accountType: string;
    }[]>('accounts') || [];

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

    this.queryTransactions();
  }

  ngOnInit() {
    console.log("acc:  ", this.accounts)
  }

  async ionViewWillEnter() {
    // Show the loader while loading transactions
    this.isLoading = true;
    //this.queryTransactions();
    this.isLoading = false;
  }

  navigateTo(service: any) {
    if (service.route) {
      this.router.navigate([service.route]);
    } else {
      console.log('Route not defined for this service');
    }
  }

  async queryTransactions() {
    const queryData = {
      transactionID: "",
      product: "",
      status: "",
      postedBy: "",
      dateFrom: "",
      dateTo: "",
      customer: this.user.customerId,
      createdBy: ""
    }

    const loading = await this.globalMethods.presentLoading(); // Show a loading spinner
    this.isLoading = true
    try {
      // Fetch data from the backend
      this.finance.PostData(queryData, 'getfilteredtransactions').subscribe({
        next: (data) => {
          console.log('API Response:', data);

          // Validate the response
          if (!data || data.message !== 'Data Retrieved Successfully') {
            this.globalMethods.presentAlert(
              'Error',
              data?.message || 'Failed to retrieve transactions.'
            );
            return;
          }

          // Check if transactions are present
          if (!data.transactions || data.transactions.length === 0) {
            this.globalMethods.presentAlert(
              'Error',
              'No transactions found for the selected criteria.'
            );
            return;
          }

          // Assign transactions to the local property
          this.transactions = data.transactions;
          console.log('Retrieved Transactions:', this.transactions);
        },
        error: (error) => {
          console.error('Error while fetching transactions:', error);
          this.globalMethods.presentAlert(
            'Error',
            'An error occurred while fetching transactions.'
          );
        },
      });
    } catch (error) {
      console.error('Exception in queryTransactions:', error);
      this.globalMethods.presentAlert(
        'Exception',
        'An unexpected error occurred.'
      );
    } finally {
      loading.dismiss(); // Dismiss the loading spinner in all cases
      this.isLoading = false
    }
  }

  async queryTransactionDetails(tranRef: string, product: string, prodName: string) {
    const queryData = {
      transactionID: tranRef,
      product: product,
      status: "",
      postedBy: "",
      dateFrom: "",
      dateTo: "",
      customer: this.user.customerId,
      createdBy: ""
    }

    console.log("Details data: ", queryData)

    if (queryData.product !== '4') {
      this.globalMethods.presentAlert('Sorry', 'Action available for on URA payments!');
      return;
    }

    const loading = await this.globalMethods.presentLoading(); // Show a loading spinner
    this.isLoading = true
    try {
      // Fetch data from the backend
      this.finance.PostData(queryData, 'getTransactionDetails').subscribe({
        next: (data) => {
          console.log('Tran Details API Response:', data);

          // Validate the response
          if (!data || data.message !== 'Data Retrieved Successfully') {
            this.globalMethods.presentAlert(
              'Error',
              data?.message || 'Failed to retrieve transactions.'
            );
            return;
          }

          // Check if transactions are present
          if (!data.transactionDetails || data.transactionDetails.length === 0) {
            this.globalMethods.presentAlert(
              'Error',
              'No transactions found for the selected criteria.'
            );
            return;
          }

          // Assign transactions to the local property
          const transaction = data.transactionDetails[0];
          transaction.product = product;
          transaction.productName = prodName;
          transaction.userName = this.user.customerName;
          console.log('Retrieved Transactions:', transaction);
          this.router.navigate(['/chckout'], {
            queryParams: { transaction: JSON.stringify(transaction) },
          });
        },
        error: (error) => {
          console.error('Error while fetching transactions:', error);
          this.globalMethods.presentAlert(
            'Error',
            'An error occurred while fetching transactions.'
          );
        },
      });
    } catch (error) {
      console.error('Exception in queryTransactions:', error);
      this.globalMethods.presentAlert(
        'Exception',
        'An unexpected error occurred.'
      );
    } finally {
      loading.dismiss(); // Dismiss the loading spinner in all cases
      this.isLoading = false
    }
  }


  goToPrintPage(transaction: any) {
    // Navigate to the PrintPage and pass the transaction as a query parameter
    this.router.navigate(['/print'], {
      queryParams: { transaction: JSON.stringify(transaction) },
    });
  }
}
