import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransferFloatPageRoutingModule } from './transfer-float-routing.module';

import { TransferFloatPage } from './transfer-float.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransferFloatPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [TransferFloatPage]
})
export class TransferFloatPageModule { }
