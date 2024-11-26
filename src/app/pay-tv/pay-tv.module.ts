import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PayTvPageRoutingModule } from './pay-tv-routing.module';

import { PayTvPage } from './pay-tv.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PayTvPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PayTvPage]
})
export class PayTvPageModule { }
