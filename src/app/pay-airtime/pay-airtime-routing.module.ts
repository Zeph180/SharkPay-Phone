import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayAirtimePage } from './pay-airtime.page';

const routes: Routes = [
  {
    path: '',
    component: PayAirtimePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayAirtimePageRoutingModule {}
