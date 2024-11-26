import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PayDataPageRoutingModule } from './pay-data-routing.module';

import { PayDataPage } from './pay-data.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PayDataPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PayDataPage]
})
export class PayDataPageModule { }
