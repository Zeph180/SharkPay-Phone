import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RedeemFloatPageRoutingModule } from './redeem-float-routing.module';

import { RedeemFloatPage } from './redeem-float.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RedeemFloatPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RedeemFloatPage]
})
export class RedeemFloatPageModule { }
