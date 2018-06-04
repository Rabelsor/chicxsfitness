import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, App, AlertController } from 'ionic-angular';
import { UserModel } from '../../modelo/user';
import { FireserviceUserProvider } from '../../providers/fireservice-user/fireservice-user';

/**
 * Generated class for the AmigosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-amigos',
  templateUrl: 'amigos.html',
})
export class AmigosPage {

  listaAmigos: UserModel[] = [];
  myInput: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private fireUser: FireserviceUserProvider,
    public loadingCtrl: LoadingController,
    private appCtrl: App,
    public alertCtrl: AlertController, ) {
  }

  ionViewDidLoad() {

    this.listaAmigos = [];
    this.fireUser.rellenarAmigos().then(val => {
      this.listaAmigos = this.fireUser.listaAmigos;
      if (this.navParams.get("loader") != undefined) {
        this.navParams.get("loader").dismiss();
      }
    });

  }




  verPerfil(userKey) {

    let loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });
    loading.present();

    if (this.fireUser.isYour(userKey)) {
      loading.dismiss();
      this.navCtrl.push("ProfilePage");
    } else {
      this.navCtrl.push("VerPerfilPage", {
        userKey: userKey,
        loader: loading
      });
    }
  }

  messageTo(userKey) {

    let loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });
    loading.present();


    this.appCtrl.getRootNav().setRoot('ChatPage', {
      toUser: userKey,
      loader: loading,
    });
  }


  borrarMensajes(uid) {
    let alert = this.alertCtrl.create({
      title: 'Borrar mensajes',
      message: 'Desea borrar los mensajes (esta opcion es permanente y tu amigo seguirá viendo los mensajes).',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Borrar',
          handler: () => {
            this.fireUser.borrarMisMensajes(uid);
          }
        }
      ]
    });
    alert.present();
  }

  onInput(evt) {
    this.listaAmigos = [];
    this.fireUser.listaAmigos.forEach(amigo => {
      if (amigo.nombre.indexOf(this.myInput) != -1) {
        this.listaAmigos.push(amigo);
      } else if (amigo.apellidos.indexOf(this.myInput) != -1) {
        this.listaAmigos.push(amigo);
      }
    });
  }

  onCancel(evt) {
    this.listaAmigos = [];
    this.fireUser.rellenarAmigos().then(val => {
      this.listaAmigos = this.fireUser.listaAmigos;
    });
  }

}
