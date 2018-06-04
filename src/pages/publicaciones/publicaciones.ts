import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { FireServiceProvider } from '../../providers/fire-service/fire-service';
import { PublicacionModel } from '../../modelo/publicacion';
import { UserModel } from '../../modelo/user';
import { ActionSheetController } from 'ionic-angular';
import { FireserviceUserProvider } from '../../providers/fireservice-user/fireservice-user';
import { ImageViewerController } from 'ionic-img-viewer';

/**
 * Generated class for the PublicacionesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-publicaciones',
  templateUrl: 'publicaciones.html',
})
export class PublicacionesPage {

  listaPublicaciones: PublicacionModel[];

  fireService: FireServiceProvider;

  titulo: String;

  user: UserModel;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    fireService: FireServiceProvider,
    public actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private fireUser: FireserviceUserProvider,
    private imageViewerCtrl: ImageViewerController,
  ) {

    this.fireService = fireService;
  }

  ionViewDidLoad() {
    if (this.navParams.get("tipo") == "post") {
      this.titulo = 'Publicaciones';
    } else {
      this.titulo = this.navParams.get("tipo");
      this.titulo = this.titulo.trim().charAt(0).toLocaleUpperCase() + this.titulo.slice(1) + 's';
    }


    if (this.navParams.get("userKey") != undefined) {
      this.fireService.traerPublicacionesProfile(this.navParams.get("tipo"), this.navParams.get("userKey")).then(val => {
        this.user = this.fireService.usuario;
        this.listaPublicaciones = this.user.listaPublicaciones;
      });
    } else {
      this.fireService.traerPublicaciones(this.navParams.get("tipo")).then(val => {
        this.user = this.fireService.usuario;
        this.listaPublicaciones = this.user.listaPublicaciones;
      });
    }

  }


  abrirMas(titulo, descripcion, key, userKey, tipo, imagen) {

    let actionSheet;
    if (this.navParams.get("userKey") != undefined) {
      actionSheet = this.actionSheetCtrl.create({
        title: titulo,
        buttons: [
          {
            text: 'Favorito',
            handler: () => {
              this.fav(key, userKey);
            }
          }, {
            text: 'Comentarios',
            handler: () => {
              this.comentarios(key, userKey);
            }
          }, {
            text: 'Cancelar',
            role: 'cancel',
          }
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
              this.fireService.borrarPublicacion(key).then(value => this.ionViewDidLoad());
            }
          }, {
            text: 'Editar',
            handler: () => {
              this.navCtrl.push('SubirPublicacionPage', {
                titulo: titulo,
                descripcion: descripcion,
                key: key,
                tipo: tipo,
                imagen: imagen
              });
            }
          }, {
            text: 'Favorito',
            handler: () => {
              this.fav(key, userKey);
            }
          }, {
            text: 'Comentarios',
            handler: () => {
              this.comentarios(key, userKey);
            }
          }, {
            text: 'Cancelar',
            role: 'cancel',
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
    }else{
      let alert = this.alertCtrl.create({
        title: 'Eres un fitness',
        subTitle: 'Lo sentimos pero solo usuarios promocionados pueden votar. Si quieres promocionarte accede a tus datos de perfil o envianos un correo desde la pestaña de soporte.',
        buttons: ['Vale']
      });
      alert.present();
    }

  }

  meGusta(key, keyUser, likes) {
    this.fireService.meGusta(key, keyUser, likes).then(value => {
      this.ionViewDidLoad();
    });
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

  comentarios(idPost, idUser) {
    let loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });
    loading.present();



    this.navCtrl.push("ComentariosPage", {
      idPost: idPost,
      idUser: idUser,
      loader: loading
    });
  }


  nuevaPublicacion() {
    this.navCtrl.push('SubirPublicacionPage');
  }


  
  presentImage(myImage) {
    const imageViewer = this.imageViewerCtrl.create(myImage);
    imageViewer.present();

  }

}
