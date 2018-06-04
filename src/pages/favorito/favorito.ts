import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController, LoadingController } from 'ionic-angular';
import { PublicacionModel } from '../../modelo/publicacion';
import { FireServiceProvider } from '../../providers/fire-service/fire-service';
import { UserModel } from '../../modelo/user';
import { FireserviceUserProvider } from '../../providers/fireservice-user/fireservice-user';

/**
 * Generated class for the FavoritoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-favorito',
  templateUrl: 'favorito.html',
})
export class FavoritoPage {

  listaPublicaciones: PublicacionModel[];

  fireService: FireServiceProvider;

  user: UserModel;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    fireService: FireServiceProvider,
    public actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private fireUser: FireserviceUserProvider) {

    this.fireService = fireService;
  }
  ionViewDidLoad() {

    if (this.navParams.get("userKey") != undefined) {
      this.fireService.traerFavoritosProfile(this.navParams.get("userKey")).then(val => {
        this.listaPublicaciones = this.fireService.listaPublicacionesFavoritos;
      });
    } else {
      this.fireService.traerFavoritos().then(val => {
        this.listaPublicaciones = this.fireService.listaPublicacionesFavoritos;
      });
    }
  }


  abrirMas(titulo, descripcion, key, userKey) {
    let actionSheet;
    if (this.navParams.get("userKey") != undefined) {
      actionSheet = this.actionSheetCtrl.create({
        title: titulo,
        buttons: [{
          text: 'Cancelar',
          role: 'cancel',
        }, {
          text: 'Comentarios',
          handler: () => {
            let loading = this.loadingCtrl.create({
              content: 'Cargando...'
            });
            loading.present();



            this.navCtrl.push("ComentariosPage", {
              idPost: key,
              idUser: userKey,
              loader: loading
            });
          }
        }, {
          text: 'Favorito',
          handler: () => {
            this.fav(key, userKey);
          }
        },
        ]
      });
    } else {
      actionSheet = this.actionSheetCtrl.create({
        title: titulo,
        buttons: [
          {
            text: 'Borrar',
            role: 'destructive',
            handler: () => {
              let alert = this.alertCtrl.create({
                title: 'Borrar de favoritos',
                message: '¿Deseas realmente borrarla de favoritos?',
                buttons: [
                  {
                    text: 'Cancelar',
                    role: 'cancel',
                  },
                  {
                    text: 'Aceptar',
                    handler: () => {
                      this.fireService.borrarPublicacionFav(key).then(value => this.ionViewDidLoad());
                    }
                  }
                ]
              });
              alert.present();
            }
          }, {
            text: 'Cancelar',
            role: 'cancel',
          }, {
            text: 'Comentarios',
            handler: () => {
              let loading = this.loadingCtrl.create({
                content: 'Cargando...'
              });
              loading.present();



              this.navCtrl.push("ComentariosPage", {
                idPost: key,
                idUser: userKey,
                loader: loading
              });
            }
          }
        ]
      });
    }
    actionSheet.present();

  }


  votar(voto, postKey, userKey) {
    if (this.fireUser.obtenerRol() != "Fitness") {
      let loading = this.loadingCtrl.create({
        content: 'Valorando...'
      });
      loading.present();

      this.fireService.valorarPublicacion(voto, postKey, userKey).then(val => {
        this.ionViewDidLoad();
        loading.dismiss();
      });
    } else {
      let alert = this.alertCtrl.create({
        title: 'Eres un fitness',
        subTitle: 'Lo sentimos pero solo usuarios promocionados pueden votar. Si quieres promocionarte accede a tus datos de perfil o envianos un correo desde la pestaña de soporte.',
        buttons: ['Vale']
      });
      alert.present();
    }
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

  meGusta(key, keyUser, likes) {
    this.fireService.meGusta(key, keyUser, likes);
  }


  fav(key, keyUser) {
    let alert = this.alertCtrl.create({
      title: 'Añadir a favoritos',
      message: '¿Deseas realmente agregarla a favortios?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.fireService.annadirFav(key, keyUser);
          }
        }
      ]
    });
    alert.present();

  }




}
