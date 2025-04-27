import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayUMEMEPage } from './pay-umeme.page';

const routes: Routes = [
  {
    path: '',
    component: PayUMEMEPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayUMEMEPageRoutingModule {}
