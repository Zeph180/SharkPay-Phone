import { Component, OnInit } from '@angular/core';
import { GlobalMethodsService } from '../helpers/global-methods.service';
import { FinanceService } from '../sharkServices/finance.service';

@Component({
  selector: 'app-commission-transactions',
  templateUrl: './commission-transactions.page.html',
  styleUrls: ['./commission-transactions.page.scss'],
})
export class CommissionTransactionsPage implements OnInit {
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


  constructor(
    public globalMethods: GlobalMethodsService,
    public finance: FinanceService
  ) { }

  ngOnInit() {
  }

  async queryCommissionTransactions() {
    const queryData = {
      transactionID: "",
      mode: "",
      status: "",
      postedBy: "",
      dateFrom: "",
      dateTo: "",
      customer: "",
      createdBy: "",
    }

    const loading = await this.globalMethods.presentLoading(); // Show a loading spinner
    try {
      // Fetch data from the backend
      this.finance.PostData(queryData, 'getFilteredCommissionTransactions').subscribe({
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
    }
  }
}
