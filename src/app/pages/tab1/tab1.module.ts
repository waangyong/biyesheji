import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ThsListComponentModule } from '../../components/ths-list/ths-list.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([ { path: '', component: Tab1Page } ]),
    ThsListComponentModule
  ],
  declarations: [ Tab1Page ]
})
export class Tab1PageModule {
}
