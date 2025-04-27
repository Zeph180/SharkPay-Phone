import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayNWSCPage } from './pay-nwsc.page';

const routes: Routes = [
  {
    path: '',
    component: PayNWSCPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayNWSCPageRoutingModule {}
