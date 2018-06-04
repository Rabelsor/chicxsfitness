import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { FireServiceProvider } from '../../providers/fire-service/fire-service';
import { PublicacionModel } from '../../modelo/publicacion';
import { FireserviceUserProvider } from '../../providers/fireservice-user/fireservice-user';
import { ImageViewerController } from 'ionic-img-viewer';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',

})
export class HomePage {

  listaPublicacionesFiltrada: PublicacionModel[];
  isPost: boolean;
  isEjercicio: boolean;
  isDieta: boolean;
  isAll: boolean;
  listaPublicaciones: PublicacionModel[];
  public loading: Loading;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menu: MenuController,
    private fireService: FireServiceProvider,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private fireUser: FireserviceUserProvider,
    private imageViewerCtrl: ImageViewerController,
  ) {


    this.menu.enable(true, "menu");
    this.menu.enable(false, "menuInicio");


    try {
      this.loading = this.navParams.get("loader");
      this.loading.dismiss();
    } catch (Exception) {

    }
    this.fireUser.rellenarUsuario();
  }


  nuevaPublicacion() {
    this.navCtrl.push('SubirPublicacionPage');
  }


  ionViewDidLoad() {

    this.isAll = true;
    this.isDieta = false;
    this.isEjercicio = false;
    this.isPost = false;

    this.fireService.traerPublicacionesGlobales().then(val => {
      this.listaPublicaciones = this.fireService.listaPublicacionesGlobales;
    });


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

  comentarios(keyPost, keyUser) {

    let loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });
    loading.present();



    this.navCtrl.push("ComentariosPage", {
      idPost: keyPost,
      idUser: keyUser,
      loader: loading
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

  doRefresh(refresher) {
    setTimeout(() => {
      this.ionViewDidLoad();
      refresher.complete();
    }, 2000);
  }

  filtrar() {
    this.listaPublicacionesFiltrada = [];
    this.fireService.traerPublicacionesGlobales().then(val => {
      this.listaPublicaciones = this.fireService.listaPublicacionesGlobales;

      this.listaPublicaciones.forEach(publi => {
        if (this.isDieta && publi.tipo == 'dieta') {
          this.listaPublicacionesFiltrada.push(publi);
        }
        if (this.isEjercicio && publi.tipo == 'ejercicio') {
          this.listaPublicacionesFiltrada.push(publi);
        }
        if (this.isPost && publi.tipo == 'post') {
          this.listaPublicacionesFiltrada.push(publi);
        }
      });
      if(this.listaPublicacionesFiltrada.length!=0){
        this.listaPublicaciones = [];
        this.listaPublicaciones = this.listaPublicacionesFiltrada;
      }
    });

  }

  seleccionFiltrado() {
    this.isAll = false;
    this.isDieta = false;
    this.isEjercicio = false;
    this.isPost = false;

    let alert = this.alertCtrl.create();
    alert.setTitle('Realize los filtros que quiera');

    alert.addInput({
      type: 'checkbox',
      label: 'Todos',
      value: 'all',
      checked: true
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Dietas',
      value: 'dietas'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Ejercicios',
      value: 'ejercicios'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Posts',
      value: 'post'
    });

    alert.addButton('Cancelar');
    alert.addButton({
      text: 'Filtrar',
      handler: data => {
        data.forEach(value => {
          if (value == 'all') {
            this.isAll = true;
          }
          if (value == 'ejercicios') {
            this.isEjercicio = true;
          }
          if (value == 'post') {
            this.isPost = true;
          }
          if (value == 'dietas') {
            this.isDieta = true;
          }
        });
        if (this.isAll) {
          this.isDieta = false;
          this.isEjercicio = false;
          this.isPost = false;
        }
        if (!this.isAll && !this.isDieta && !this.isEjercicio && !this.isPost) {
          this.isAll = true;
        }
        this.filtrar();
      }
    });
    alert.present();
  }

  
  presentImage(myImage) {
    const imageViewer = this.imageViewerCtrl.create(myImage);
    imageViewer.present();

  }

}
