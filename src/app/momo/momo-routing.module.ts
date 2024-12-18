import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MomoPage } from './momo.page';

const routes: Routes = [
  {
    path: '',
    component: MomoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MomoPageRoutingModule {}
