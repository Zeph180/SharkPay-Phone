import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResetPaasswordPageRoutingModule } from './reset-paassword-routing.module';

import { ResetPaasswordPage } from './reset-paassword.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResetPaasswordPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ResetPaasswordPage]
})
export class ResetPaasswordPageModule {}
