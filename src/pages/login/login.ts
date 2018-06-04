import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController, MenuController, App } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomePage } from '../home/home';
import { FireServiceProvider } from '../../providers/fire-service/fire-service';
import { FireserviceAuthProvider } from '../../providers/fireservice-auth/fireservice-auth';
import { FireserviceUserProvider } from '../../providers/fireservice-user/fireservice-user';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {


  logueado: boolean;
  myForm: FormGroup;
  public loading: Loading;





  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public menu: MenuController,
    public fireService: FireServiceProvider,
    public appCtrl: App,
    private fireAuth: FireserviceAuthProvider,
    private fireUser: FireserviceUserProvider,
  ) {


    this.myForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

  }


  loginUser() {

    if (this.logueado == true) {
      window.localStorage.setItem("logueado", "true");
      window.localStorage.setItem("email", this.myForm.value.email);
      window.localStorage.setItem("password", this.myForm.value.password);
    }

    this.fireAuth.loginUser(this.myForm.value.email, this.myForm.value.password).then(() => {
      this.fireUser.rellenarUsuario();
      this.appCtrl.getRootNav().setRoot(HomePage);
    }, (error => {
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Email o contraseña incorrecta',
        buttons: ['Vale']
      });
      alert.present();
    }
      ));


  }
  ionViewDidLoad() {
    this.menu.enable(false, "menu");
    this.menu.enable(true, "menuInicio");
  }






  goToSignup() {
    this.appCtrl.getRootNav().setRoot('SignupPage')
  }

  goToResetPassword() {
    this.appCtrl.getRootNav().setRoot('ResetPasswordPage');
  }


}
