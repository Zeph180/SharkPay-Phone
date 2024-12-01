import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommissionTransactionsPageRoutingModule } from './commission-transactions-routing.module';

import { CommissionTransactionsPage } from './commission-transactions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommissionTransactionsPageRoutingModule
  ],
  declarations: [CommissionTransactionsPage]
})
export class CommissionTransactionsPageModule {}
