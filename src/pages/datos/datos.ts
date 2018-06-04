import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController, App } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserModel } from '../../modelo/user';
import { FireServiceProvider } from '../../providers/fire-service/fire-service';
import { FireserviceUserProvider } from '../../providers/fireservice-user/fireservice-user';
import { FireserviceAuthProvider } from '../../providers/fireservice-auth/fireservice-auth';
/**
 * Generated class for the DatosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */



@IonicPage()
@Component({
  selector: 'page-datos',
  templateUrl: 'datos.html',
})



export class DatosPage {

  myForm: FormGroup;
  user: UserModel;
  isPromocionado: string = 'false';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public afAuth: AngularFireAuth,
    public database: AngularFireDatabase,
    public formBuilder: FormBuilder,
    public appCtrl: App,
    private fireService: FireServiceProvider,
    private fireUser: FireserviceUserProvider,
    private fireAuth: FireserviceAuthProvider,
  ) {



    this.myForm = this.formBuilder.group({
      nombre: [this.fireService.usuario.nombre, Validators.required],
      apellidos: [this.fireService.usuario.apellidos, Validators.required],
      sexo: [this.fireService.usuario.sexo, Validators.required],
      edad: [this.fireService.usuario.edad, Validators.required],
      peso: [this.fireService.usuario.peso, Validators.required],
    });


  }

  ionViewDidLoad() {
    this.isPromocionado = window.localStorage.getItem("promocionado");
  }

  guardarDatos() {
    this.fireUser.guardarDatos(this.myForm.value.apellidos, this.myForm.value.edad, this.myForm.value.nombre, this.myForm.value.sexo, this.myForm.value.peso).then(this.appCtrl.getRootNav().setRoot('ProfilePage'));

  }

  promocionarUsuario() {
    let alert = this.alertCtrl.create({
      title: 'Deseas promocionarte',
      message: 'Con esta opción te damos la oportunidad de cambiar de usuario. Si deseas realmente' +
        'promocionar de usuario confirma y pronto nos pondremos en contacto contigo a través de email',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Promocionar',
          handler: () => {
            this.fireAuth.promocionarUsuario(this.fireService.usuario.correo);
            window.localStorage.setItem("promocionado", 'true');         
          }
        }
      ]
    });
    alert.present();
  }

}
