import { Component } from '@angular/core';
import { IonicPage,NavController,AlertController, MenuController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {

  myForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public afAuth: AngularFireAuth,
    public nav: NavController,
    public alertCtrl: AlertController,
    public menu:MenuController
  ) {
    this.myForm = this.formBuilder.group({
      email: ['', Validators.required]
    });
  }

  ionViewDidLoad() {
    this.menu.enable(true,"menuInicio");
    this.menu.enable(false,"menu");
  }

  resetPassword(){
    
    this.afAuth.auth.sendPasswordResetEmail(this.myForm.value.email)
    .then((user) => {
      let alert = this.alertCtrl.create({
        message: "Te enviamos un link a tu correo.",
        buttons: [
          {
            text: "Ok",
            role: 'cancel',
            handler: () => {
              this.nav.pop();
            }
          }
        ]
      });
      alert.present();
    }, (error) => {
      var errorMessage: string = error.message;
      let errorAlert = this.alertCtrl.create({
        message: errorMessage,
        buttons: [
          {
            text: "Ok",
            role: 'cancel'
          }
        ]
      });
      errorAlert.present();
    });
  }

}
