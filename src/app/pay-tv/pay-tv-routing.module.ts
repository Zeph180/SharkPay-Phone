import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayTvPage } from './pay-tv.page';

const routes: Routes = [
  {
    path: '',
    component: PayTvPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayTvPageRoutingModule {}
