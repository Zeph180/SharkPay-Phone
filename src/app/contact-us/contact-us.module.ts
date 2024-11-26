import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactUSPageRoutingModule } from './contact-us-routing.module';

import { ContactUSPage } from './contact-us.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactUSPageRoutingModule
  ],
  declarations: [ContactUSPage]
})
export class ContactUSPageModule {}
