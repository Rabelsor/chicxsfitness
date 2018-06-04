import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, App } from 'ionic-angular';
import { UserModel } from '../../modelo/user';
import { FireserviceUserProvider } from '../../providers/fireservice-user/fireservice-user';
import { ChatModel } from '../../modelo/chat';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  me: UserModel;
  to: UserModel;
  mensajes: ChatModel[] = [];
  mensajeEnviar: string = "";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private fireUser: FireserviceUserProvider,
    public loadingCtrl: LoadingController,
    public appCtrl: App,
  ) {
  }

  ionViewDidLoad() {

    this.me = new UserModel();
    this.to = new UserModel();

    this.fireUser.iniciarConversasionTo(this.navParams.get("toUser")).then(val => {
      this.to = this.fireUser.to;
      this.fireUser.iniciarConversasionMe().then(val => {
        this.me = this.fireUser.me;
        this.fireUser.rescatarTodosLosMensajes().then(val => {
          //this.mensajes = this.fireUser.mensajes;
         // this.mensajes.reverse();
          this.navParams.get("loader").dismiss();
          this.fireUser.comprobarMensajesEntrantes().on('child_added', (snapshot) => {
            if (snapshot.key != 'notificacion') {
              let chat = new ChatModel();
              chat.contenido = snapshot.child('contenido').val();
              chat.fecha = snapshot.child('fecha').val(),
                chat.uid = snapshot.child('uid').val();
              this.mensajes.unshift(chat);
            }
          });
        });
      });
    });


  }


  enviarMensaje() {
    if (this.mensajeEnviar.length != 0) {
      this.fireUser.enviarMensaje(this.mensajeEnviar).then(val => {

        let loading = this.loadingCtrl.create({
          content: 'Enviando...'
        });

        loading.present();

        this.fireUser.rescatarTodosLosMensajes().then(val => {
          this.mensajes = this.fireUser.mensajes;
          this.mensajes.reverse();
          loading.dismiss();
        });
      });
      this.mensajeEnviar = "";
    }
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


  volverAmigos() {
    let loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });
    loading.present();

    this.fireUser.quitarNotificacion(this.to.uid).then(val => {
      this.appCtrl.getRootNav().setRoot('AmigosPage', {
        loader: loading
      });
    });


  }





}
