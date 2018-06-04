import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { EmailComposer } from '@ionic-native/email-composer';


/*
  Generated class for the FireserviceAuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FireserviceAuthProvider {

  afAuth: AngularFireAuth;

  constructor(
    afAuth: AngularFireAuth,
    private emailComposer: EmailComposer
  ) {
    this.afAuth = afAuth;

  }

  loginUser(email: string, password: string) {

    return this.afAuth.auth.signInWithEmailAndPassword(email, password);

  }

  logOut() {
    return this.afAuth.auth.signOut();
  }

  registrarUsuarioCorreo(email,password){
    return this.afAuth.auth.createUserWithEmailAndPassword(email,password);
  }

  promocionarUsuario(email:string){

    let sendEmail = {
      to:'jesusmserralbo@hotmail.com',
      cc:  email,
      subject: 'Jesus, este usuario te ha pedido promocion',
      body: 'El uid del usuario es: '+this.afAuth.auth.currentUser.uid+ ' con email: '+email,
      isHtml: true
    };
 

    this.emailComposer.isAvailable().then((available: boolean) =>{
      if(available) {
      }
     });
     

    this.emailComposer.open(sendEmail);

  }

  enviarCorreoAdmin(){
    let sendEmail = {
      to:'jesusmserralbo@hotmail.com',
      isHtml: true
    };
 

    this.emailComposer.isAvailable().then((available: boolean) =>{
      if(available){
      }
     });
     

    this.emailComposer.open(sendEmail);
  }






}
