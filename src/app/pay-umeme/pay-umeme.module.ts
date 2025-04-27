import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PayUMEMEPageRoutingModule } from './pay-umeme-routing.module';

import { PayUMEMEPage } from './pay-umeme.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PayUMEMEPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PayUMEMEPage]
})
export class PayUMEMEPageModule { }
