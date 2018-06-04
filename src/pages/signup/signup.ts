import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController ,Loading, AlertController, MenuController, App } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatosNuevosPage } from '../datos-nuevos/datos-nuevos'
import { FireServiceProvider } from '../../providers/fire-service/fire-service';
import { FireserviceAuthProvider } from '../../providers/fireservice-auth/fireservice-auth';


/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  myForm: FormGroup;
  fireservice:FireServiceProvider
  public loading:Loading;
  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public afAuth: AngularFireAuth, 
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public menu: MenuController,
    public appCtrl: App, 
    fireservice:FireServiceProvider,
    private fireAtuh : FireserviceAuthProvider
  ) {

    this.fireservice=fireservice;

    this.myForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      passwordRetype: ['', Validators.required],
    });
  }

  signup(){

   
    if(this.myForm.value.password==this.myForm.value.passwordRetype){
      this.fireAtuh.registrarUsuarioCorreo(this.myForm.value.email, this.myForm.value.password)
      .then(
        res => {
          this.fireAtuh.loginUser(this.myForm.value.email,this.myForm.value.password)
          this.appCtrl.getRootNav().setRoot(DatosNuevosPage);
        }, error => {
          this.loading.dismiss().then( () => {
            let alert = this.alertCtrl.create({
              message: error.message,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          });
        });
      

        this.loading = this.loadingCtrl.create({
          dismissOnPageChange: true,
        });
        this.loading.present();

    }else{
      let alert = this.alertCtrl.create({
        title: 'Contraseñas diferentes',
        subTitle: 'Debes escribir la misma contraseña',
        buttons: ['Vale']
      });
      alert.present();
    }
    
  }


  ionViewDidLoad() {
    this.menu.enable(true,"menuInicio");
    this.menu.enable(false,"menu");
  }

}
