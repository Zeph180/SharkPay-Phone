import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayDataPage } from './pay-data.page';

const routes: Routes = [
  {
    path: '',
    component: PayDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayDataPageRoutingModule {}
