import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, MenuController, NavController } from '@ionic/angular';
import { GlobalMethodsService } from '../helpers/global-methods.service';
import { FinanceService } from '../sharkServices/finance.service';
import { DatePipe, formatDate } from '@angular/common';

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
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {
  FormData: FormGroup;
  userdata: any;
  details: any;
  cred: any;
  searchData: any;
  returnedData: any;
  showStartDateCalendar: boolean = false;
  showEndDateCalendar: boolean = false;
  isLoading: boolean = true; // Loader state


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
  public filteredTransactions: any[] = [];


  constructor (
    public fb: FormBuilder,
    public navCtrl: NavController,
    public loadingController: LoadingController,
    public menuCtrl: MenuController,
       public globalMethods: GlobalMethodsService,
    public finance: FinanceService,
  ) { 
    this.FormData = this.fb.group({
      Account: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      prn: ['', Validators.pattern('^[0-9]*$')],
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

    this.queryTransactions();
  }

  ngOnInit() {
    console.log("")
  }

  showCalendar(inputName: string) {
    if (inputName === 'startDate') {
      this.showStartDateCalendar = true;
    } else if (inputName === 'endDate') {
      this.showEndDateCalendar = true;
    }
  }


  isFormValid(): boolean {
    const startDate = this.FormData.get('startDate')?.value;
    const endDate = this.FormData.get('endDate')?.value;
    const prn = this.FormData.get('prn')?.value;

    const hasDates = startDate && endDate;
    const hasPrn = prn && prn.trim() !== '';

    return hasDates || hasPrn;
  }

  async queryTransactions() {
    var startDate = this.getFormattedDate(this.FormData.controls['startDate'].value)
    var endDate = this.getFormattedDate(this.FormData.controls['endDate'].value)
    const queryData = {
      transactionID: "",
      product: "",
      status: "",
      postedBy: "",
      dateFrom: startDate|| '',
      dateTo: endDate|| '',
      customer: this.user.customerId,
      createdBy: "",
      prn: this.FormData.controls['prn'].value || '',
    }


    const loading = await this.globalMethods.presentLoading(); // Show a loading spinner
    this.isLoading = true
    try {
      var endpoint = 'getfilteredtransactions';
      if (this.FormData.controls['prn'].value) {
        endpoint = 'getFilteredUraTransactions';
        queryData.product = '4';
      } 
      // Fetch data from the backend
      this.finance.PostData(queryData, endpoint).subscribe({
        next: (data) => {
          console.log("RequestData : ", queryData);
          console.log('API Response:', data);

          // Validate the response
          if (!data || data.message !== 'Data Retrieved Successfully') {
            var msg = '';
            data.code === '109' ? msg = 'No transactions found in the provide date range' :  msg = 'Failed to retrieve transactions.' 
            this.globalMethods.presentAlert(
              'Error',
              data?.message || msg
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
          this.filteredTransactions = [...this.transactions];
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
      loading.dismiss();
      this.isLoading = false
    }
  }

  getFormattedDate(date: any) {
    if (date) {
      return new Date(date).toISOString().split('T')[0];
    }
    return '';
  }
}
