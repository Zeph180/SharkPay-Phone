import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PayAirtimePageRoutingModule } from './pay-airtime-routing.module';

import { PayAirtimePage } from './pay-airtime.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PayAirtimePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PayAirtimePage]
})
export class PayAirtimePageModule { }
