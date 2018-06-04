import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UserModel } from '../../modelo/user';
import { FireserviceUserProvider } from '../../providers/fireservice-user/fireservice-user';

/**
 * Generated class for the BusquedaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-busqueda',
  templateUrl: 'busqueda.html',
})
export class BusquedaPage {

  listaEncontrados: UserModel[] = [];
  myInput: string = "";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private fireUser: FireserviceUserProvider,
    public loadingCtrl: AlertController,
  ) {
  }

  ionViewDidLoad() {
    this.listaEncontrados = [];
  }

  onInput(evt) {
    if (this.myInput.length >= 3) {
      this.fireUser.buscarPorCorreo(this.myInput).then(val => {
        this.listaEncontrados = this.fireUser.busquedaAmigosGlobal;
      });
    }
  }

  onCancel(evt) {
  }

  verPerfil(userKey) {

    // let loading = this.loadingCtrl.create({
    //   content: 'Cargando...'
    // });
    let loading = this.loadingCtrl.create({

    })
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

}
