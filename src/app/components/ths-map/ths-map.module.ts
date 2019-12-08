import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ThsMapComponent } from './ths-map.component';

@NgModule({
  declarations: [ThsMapComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [ThsMapComponent]
})
export class ThsMapModule { }
