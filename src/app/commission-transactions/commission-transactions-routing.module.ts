import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommissionTransactionsPage } from './commission-transactions.page';

const routes: Routes = [
  {
    path: '',
    component: CommissionTransactionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommissionTransactionsPageRoutingModule {}
