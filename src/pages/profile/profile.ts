import { Component } from '@angular/core';
import { IonicPage, NavController, App, AlertController, NavParams, MenuController, LoadingController } from 'ionic-angular';
import { UserModel } from '../../modelo/user';
import { FireServiceProvider } from '../../providers/fire-service/fire-service';
import { FireserviceUserProvider } from '../../providers/fireservice-user/fireservice-user';
import { ImageViewerController } from 'ionic-img-viewer';
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  user: UserModel;
  usuario: any;

  rol: string;
  nombre: string;
  correo: string;
  edad: string;
  sexo: string;
  apellidos: string;
  foto: string;
  peso: number;



  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public menu: MenuController,
    private fireService: FireServiceProvider,
    public appCtrl: App,
    private fireUser: FireserviceUserProvider,
    private imageViewerCtrl: ImageViewerController,
    public loadingCtrl: LoadingController,
  ) {



  }

  ionViewDidLoad() {

    this.menu.enable(true, "menu");
    this.menu.enable(false, "menuInicio");

    this.fireService.rellenarUsuario().then(val => {

      this.user = this.fireService.usuario;

      this.rol = this.fireService.usuario.rol;
      this.edad = this.fireService.usuario.edad;
      this.nombre = this.fireService.usuario.nombre;
      this.apellidos = this.fireService.usuario.apellidos;
      this.sexo = this.fireService.usuario.sexo;
      this.correo = this.fireService.usuario.correo;
      this.foto = this.fireService.usuario.foto;
      this.peso = this.fireService.usuario.peso;
    });

  }

  cambiarFoto() {

    this.fireUser.subirFoto().then(val => {
      this.fireUser.cambiarFoto0(val).then(val => {
        this.fireUser.rellenarUsuario().then(val => {
          this.ionViewDidLoad();
        });
      });
    });

  }


  editarPerfil() {

    this.navCtrl.push('DatosPage');

  }

  abrirPublicaciones(tipo: string) {
    this.navCtrl.push('PublicacionesPage', {
      tipo: tipo,
    });
  }

  abrirFavoritos() {
    this.navCtrl.push('FavoritoPage');
  }

  presentImage(myImage) {
    const imageViewer = this.imageViewerCtrl.create(myImage);
    imageViewer.present();

  }

}

