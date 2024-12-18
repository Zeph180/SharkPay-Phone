import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MomoPageRoutingModule } from './momo-routing.module';

import { MomoPage } from './momo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MomoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [MomoPage]
})
export class MomoPageModule { }
