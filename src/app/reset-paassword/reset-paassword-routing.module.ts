import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResetPaasswordPage } from './reset-paassword.page';

const routes: Routes = [
  {
    path: '',
    component: ResetPaasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResetPaasswordPageRoutingModule {}
