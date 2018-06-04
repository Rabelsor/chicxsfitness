import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController, App } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HomePage } from '../home/home';
import { UserModel } from '../../modelo/user';
import { FireserviceUserProvider } from '../../providers/fireservice-user/fireservice-user';

/**
 * Generated class for the DatosNuevosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-datos-nuevos',
  templateUrl: 'datos-nuevos.html',
})
export class DatosNuevosPage {

  myForm: FormGroup;
  user: UserModel;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public formBuilder: FormBuilder,
    public appCtrl: App,
    private fireUser: FireserviceUserProvider,
  ) {

    this.myForm = this.formBuilder.group({
      nombre: ['',Validators.required],
      apellidos: ['',Validators.required],
      sexo: [Validators.required],
      edad: ['',Validators.required],
      peso: [0,Validators.required]
    });



  }

  ionViewDidLoad() {
  }

  guardarDatos() {
    this.fireUser.guardarDatosNuevos(this.myForm.value.apellidos, this.myForm.value.edad, this.myForm.value.nombre, this.myForm.value.sexo, this.myForm.value.peso).then(this.appCtrl.getRootNav().setRoot(HomePage));

  }

}
