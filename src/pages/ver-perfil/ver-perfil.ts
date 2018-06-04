import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserModel } from '../../modelo/user';
import { FireserviceUserProvider } from '../../providers/fireservice-user/fireservice-user';
import { ImageViewerController } from 'ionic-img-viewer';

/**
 * Generated class for the VerPerfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ver-perfil',
  templateUrl: 'ver-perfil.html',
})
export class VerPerfilPage {

  userProfile : UserModel;
  isAmigo : Boolean; 
  isYour : Boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private fireUser : FireserviceUserProvider,
              public imageViewerCtrl: ImageViewerController) {
                this.userProfile = new UserModel;
                
              
  }

  ionViewDidLoad() {

    this.fireUser.rellenarUsuarioProfile(this.navParams.get("userKey")).then(val=>{
      this.userProfile=this.fireUser.userProfile
    });

    this.fireUser.esAmigo(this.navParams.get("userKey")).then(val=>{
      this.isAmigo = this.fireUser.isAmigo;
    });

    this.navParams.get("loader").dismiss();
   
  }


  abrirPublicaciones(tipo : string){
    this.navCtrl.push('PublicacionesPage',{
      tipo : tipo,
      userKey : this.navParams.get("userKey")
    });
  }

  abrirFavoritos(){
    this.navCtrl.push('FavoritoPage',{
      userKey : this.navParams.get("userKey")
    });
  }

  seguir(){
    this.fireUser.seguirUsuario( this.navParams.get("userKey"));
    this.isAmigo = !this.isAmigo;
  }

  dejarSeguir(){
    this.fireUser.dejarSeguirUsuario( this.navParams.get("userKey"));
    this.fireUser.esAmigo(this.navParams.get("userKey")).then(
      this.isAmigo = this.fireUser.isAmigo
    );
  }

  presentImage(myImage) {
    const imageViewer = this.imageViewerCtrl.create(myImage);
    imageViewer.present();

  }

}
