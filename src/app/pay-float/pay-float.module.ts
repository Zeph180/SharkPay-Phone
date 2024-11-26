import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PayFloatPageRoutingModule } from './pay-float-routing.module';

import { PayFloatPage } from './pay-float.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PayFloatPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PayFloatPage]
})
export class PayFloatPageModule { }
