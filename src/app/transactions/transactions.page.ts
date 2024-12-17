import { Component, OnInit } from '@angular/core';
import { GlobalMethodsService } from '../helpers/global-methods.service';
import { FinanceService } from '../sharkServices/finance.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {
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
  public categories: string[] = ['All', 'Credit', 'Debit'];
  public selectedCategory: string = 'All';
  isLoading: boolean = true; // Loader state

  constructor(
    public globalMethods: GlobalMethodsService,
    public finance: FinanceService,
    public router: Router
  ) { }

  ngOnInit() {
    this.queryTransactions();
  }

  async queryTransactions() {
    const queryData = {
      transactionID: "",
      product: "",
      status: "",
      postedBy: "",
      dateFrom: "",
      dateTo: "",
      customer: "",
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

  // Filter transactions based on category
  filterTransactions(category: string) {
    this.selectedCategory = category;

    if (category === 'All') {
      this.filteredTransactions = [...this.transactions];
    } else if (category === 'Credit') {
      this.filteredTransactions = this.transactions.filter(
        (transaction) => transaction.transType.toUpperCase() === 'CREDIT'
      );
    } else if (category === 'Debit') {
      this.filteredTransactions = this.transactions.filter(
        (transaction) => transaction.transType.toUpperCase() === 'DEBIT'
      );
    }
  }

  goToPrintPage(transaction: any) {
    // Navigate to the PrintPage and pass the transaction as a query parameter
    this.router.navigate(['/print'], {
      queryParams: { transaction: JSON.stringify(transaction) },
    });
  }
}
