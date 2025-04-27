import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PayNWSCPageRoutingModule } from './pay-nwsc-routing.module';

import { PayNWSCPage } from './pay-nwsc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PayNWSCPageRoutingModule,
    ReactiveFormsModule

  ],
  declarations: [PayNWSCPage]
})
export class PayNWSCPageModule { }
