import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayUraPage } from './pay-ura.page';

const routes: Routes = [
  {
    path: '',
    component: PayUraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayUraPageRoutingModule { }
