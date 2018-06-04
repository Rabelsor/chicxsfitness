import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController } from 'ionic-angular';
import { FireServiceProvider } from '../../providers/fire-service/fire-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ImageViewerController } from 'ionic-img-viewer';
import { HomePage } from '../home/home';

/**
 * Generated class for the SubirPublicacionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-subir-publicacion',
  templateUrl: 'subir-publicacion.html',
})
export class SubirPublicacionPage {

  myForm: FormGroup;
  tit: string;
  desc: string;
  tip: String;
  imgPost: any;
  fotoActu: Boolean;
  imgPreview: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public appCtrl: App,
    private fireService: FireServiceProvider,
    public loadingCtrl: LoadingController,
    private imageViewerCtrl: ImageViewerController,
  ) {

    try {
      this.tit = this.navParams.get("titulo");
      this.desc = this.navParams.get("descripcion");
      this.tip = this.navParams.get("tipo");
      this.imgPreview = this.navParams.get("imagen");
    } catch (Excpetion) {

    }
    this.myForm = this.formBuilder.group({
      titulo: [this.tit, Validators.required],
      descripcion: [this.desc, Validators.required],
      tipo: [this.tip, Validators.required],
    });

  }

  abrirCamara() {
    this.fireService.subirFotoPost(this.myForm.value.titulo).then(val => {
      this.fotoActu = true;
      this.imgPost = val;
      this.imgPreview = 'data:image/jpeg;base64,' + val;
    });


  }

  ionViewDidLoad() {
    this.fireService.imagenSubir = "";
    if( this.navParams.get("imagen") === undefined)
      this.fotoActu = false;
    else
      this.fotoActu = true;

  }

  guardarPublicacion() {
    let loading = this.loadingCtrl.create({
      content: 'Subiendo...'
    });
    loading.present();
    if (this.navParams.get("titulo") === undefined) {
      if (this.fotoActu) {
        this.fireService.postPicture(this.imgPost, this.myForm.value.titulo).then(val => {
          this.fireService.subirPublicacion(this.myForm.value.titulo, this.myForm.value.descripcion, this.myForm.value.tipo).then(value => {
            loading.dismiss();
            this.appCtrl.getRootNav().setRoot(HomePage);
          });
        });
      } else {
        this.fireService.subirPublicacion(this.myForm.value.titulo, this.myForm.value.descripcion, this.myForm.value.tipo).then(value => {
          loading.dismiss();
          this.appCtrl.getRootNav().setRoot(HomePage);
        });
      }
    } else {
      if (this.fotoActu) {
        this.fireService.postPicture(this.imgPost, this.myForm.value.titulo).then(val => {
          this.fireService.actualizarPublicacion(this.myForm.value.titulo, this.myForm.value.descripcion, this.myForm.value.tipo, this.navParams.get("key")).then(value => {
            loading.dismiss();
            this.appCtrl.getRootNav().setRoot(HomePage);
          });
        });
      } else {
        this.fireService.actualizarPublicacionSinFoto(this.myForm.value.titulo, this.myForm.value.descripcion, this.myForm.value.tipo, this.navParams.get("key"), ).then(value => {
          loading.dismiss();
          this.appCtrl.getRootNav().setRoot(HomePage);
        });
      }

    }
  }


  
  presentImage(myImage) {
    const imageViewer = this.imageViewerCtrl.create(myImage);
    imageViewer.present();

  }



}
