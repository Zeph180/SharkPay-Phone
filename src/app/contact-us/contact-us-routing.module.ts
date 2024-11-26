import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactUSPage } from './contact-us.page';

const routes: Routes = [
  {
    path: '',
    component: ContactUSPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactUSPageRoutingModule {}
