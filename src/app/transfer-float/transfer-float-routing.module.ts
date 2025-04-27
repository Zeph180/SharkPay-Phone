import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransferFloatPage } from './transfer-float.page';

const routes: Routes = [
  {
    path: '',
    component: TransferFloatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransferFloatPageRoutingModule {}
