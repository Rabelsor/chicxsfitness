import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublicacionesPage } from './publicaciones';

@NgModule({
  declarations: [
    PublicacionesPage,
  ],
  imports: [
    IonicPageModule.forChild(PublicacionesPage),
  ],
})
export class PublicacionesPageModule {}
