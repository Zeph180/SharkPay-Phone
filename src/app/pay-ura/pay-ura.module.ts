import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PayUraPageRoutingModule } from './pay-ura-routing.module';

import { PayUraPage } from './pay-ura.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PayUraPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PayUraPage]
})
export class PayUraPageModule { }
