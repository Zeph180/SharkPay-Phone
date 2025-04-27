import { Injectable } from '@angular/core';
import { FinanceService } from '../sharkServices/finance.service';
import { GlobalMethodsService } from '../helpers/global-methods.service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionStatusService {
  private transactionStatusInterval: any;

  constructor (
    private finance: FinanceService,
    private globalMethods: GlobalMethodsService,
    private authService: AuthenticationService
  ) { }

  startTransactionStatusCheck(transData: {}) {
    this.transactionStatusInterval = setInterval(() => {
      this.checkTransactionStatus(transData);
    }, 30000); // Check every 30 seconds
  }

  stopTransactionStatusCheck() {
    if (this.transactionStatusInterval) {
      clearInterval(this.transactionStatusInterval);
      this.transactionStatusInterval = null;
    }
  }

  private checkTransactionStatus(transData: {}) {
    console.log("Status payload", transData);
    this.finance.PostData(transData, 'GetMMTransactionStatus').subscribe({
      next: (data: any) => {
        const s = JSON.stringify(data);
        const resp = JSON.parse(s);
        if (resp.code === '200' && resp.status.toUpperCase() === 'SUCCESS') {
          // Handle successful transaction status
          this.authService.updateAccounts(JSON.stringify(data.accounts))
          this.globalMethods.presentAlert('Success', 'Mobile money transaction completed');
          this.stopTransactionStatusCheck();
        } else if (resp.code === '201') {
          console.log('Transaction is still pending, will check again.');
        } else {
          // Handle unsuccessful transaction status
          this.globalMethods.presentAlert('Error', data.message || 'Transaction failed')
          this.stopTransactionStatusCheck();
        }
      },
      error: (error) => {
        console.log("Error checking transaction status: ", error);
      }
    });
  }
}