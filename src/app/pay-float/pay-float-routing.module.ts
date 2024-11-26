import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayFloatPage } from './pay-float.page';

const routes: Routes = [
  {
    path: '',
    component: PayFloatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayFloatPageRoutingModule {}
