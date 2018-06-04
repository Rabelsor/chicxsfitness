import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubirPublicacionPage } from './subir-publicacion';

@NgModule({
  declarations: [
    SubirPublicacionPage,
  ],
  imports: [
    IonicPageModule.forChild(SubirPublicacionPage),
  ],
})
export class SubirPublicacionPageModule {}
