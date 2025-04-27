import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RedeemFloatPage } from './redeem-float.page';

const routes: Routes = [
  {
    path: '',
    component: RedeemFloatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RedeemFloatPageRoutingModule {}
