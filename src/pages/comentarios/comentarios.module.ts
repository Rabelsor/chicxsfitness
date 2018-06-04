import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComentariosPage } from './comentarios';
import {Autosize} from 'ionic2-autosize';

@NgModule({
  declarations: [
    ComentariosPage,
    Autosize
  ],
  imports: [
    IonicPageModule.forChild(ComentariosPage),
  ],
})
export class ComentariosPageModule {}
