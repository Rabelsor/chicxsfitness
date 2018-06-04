import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FireServiceProvider } from '../../providers/fire-service/fire-service';
import { PublicacionModel } from '../../modelo/publicacion';
import { FireserviceUserProvider } from '../../providers/fireservice-user/fireservice-user';
import { ComentariosModel } from '../../modelo/comentariosUsuarios';
import { ImageViewerController } from 'ionic-img-viewer';
/**
 * Generated class for the ComentariosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comentarios',
  templateUrl: 'comentarios.html',


})
export class ComentariosPage {


  idPost: string;
  idUser: string;
  post: PublicacionModel;
  tittle: string;
  textoComentario: string;
  comentarios: ComentariosModel[];
  uid:String;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private fireService: FireServiceProvider,
    public loadingCtrl: LoadingController,
    private fireUser: FireserviceUserProvider,
    private imageViewerCtrl: ImageViewerController,) {



    this.textoComentario = "";

    this.post = new PublicacionModel();
    this.comentarios = [new ComentariosModel()];
    let loading = this.navParams.get("loader");
    this.idPost = navParams.get("idPost");
    this.idUser = navParams.get("idUser");
    this.fireService.rescatarPost(this.idPost, this.idUser).then(val => {
      this.post = this.fireService.postComentarios;
      this.tittle = this.post.titulo;
      loading.dismiss();
      
    });

    this.uid = this.fireService.afAuth.auth.currentUser.uid;
    this.fireService.rellenarComentarios(this.idPost, this.idUser).then(val=>{
      this.comentarios = this.fireService.comentarios;
      this.comentarios.reverse();
    });
  

  }

  ionViewDidLoad() {
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
    }
  }

  meGusta(key, keyUser, likes) {
    this.fireService.meGusta(key, keyUser, likes);
  }

  comentar() {
    if(this.textoComentario!="")
      this.fireService.comentarPost(this.textoComentario,this.idPost, this.idUser).then(
        this.fireService.rellenarComentarios(this.idPost, this.idUser).then(
          this.comentarios = this.fireService.comentarios));

    this.textoComentario=""
  }

  borrarComentario(idComen){
    this.fireService.borrarComentario(this.idPost,this.idUser,idComen).then(
      this.fireService.rellenarComentarios(this.idPost, this.idUser).then(
        this.comentarios = this.fireService.comentarios));
  }

   
  presentImage(myImage) {
    const imageViewer = this.imageViewerCtrl.create(myImage);
    imageViewer.present();

  }


}
