import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckoutPage } from './checkout.page';
import {PrintPreviewComponent} from "../components/print-preview/print-preview.component";
import {IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle} from "@ionic/angular/standalone";
import {JsonPipe} from "@angular/common";

const routes: Routes = [
  {
    path: '',
    component: CheckoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), IonButton, IonCardContent, IonCardTitle, IonCardHeader, IonCard, JsonPipe],
  exports: [RouterModule, PrintPreviewComponent],
  declarations: [
    PrintPreviewComponent
  ]
})
export class CheckoutPageRoutingModule {}
