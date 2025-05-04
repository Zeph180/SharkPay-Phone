import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckoutPageRoutingModule } from './checkout-routing.module';

import { CheckoutPage } from './checkout.page';
import {PrinterControlComponent} from "../components/printer-control/printer-control.component";
import {PrintPreviewComponent} from "../components/print-preview/print-preview.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckoutPageRoutingModule
  ],
  declarations: [CheckoutPage, PrinterControlComponent, PrintPreviewComponent]
})
export class CheckoutPageModule {}
