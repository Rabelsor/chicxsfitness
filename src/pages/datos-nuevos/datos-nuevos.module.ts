import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DatosNuevosPage } from './datos-nuevos';

@NgModule({
  declarations: [
    DatosNuevosPage,
  ],
  imports: [
    IonicPageModule.forChild(DatosNuevosPage),
  ],
})
export class DatosNuevosPageModule {}
