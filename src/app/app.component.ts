import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, App, MenuController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireStorage } from 'angularfire2/storage';

//Permisos 
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { FireserviceAuthProvider } from '../providers/fireservice-auth/fireservice-auth';
import { FireserviceUserProvider } from '../providers/fireservice-user/fireservice-user';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  text: string = '';
  rootPage: any = 'LoginPage';
  pages: Array<{ title: string, component: any }>;

  constructor(platform: Platform,
    public appCtrl: App,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public menu: MenuController,
    public afAuth: AngularFireAuth,
    public storage: AngularFireStorage,
    private fireUser: FireserviceUserProvider,
    private fireAuth: FireserviceAuthProvider,
    private androidPermissions: AndroidPermissions,
    public plt: Platform,
    public loadingCtrl: LoadingController,
  ) {

    if (platform.is('android')) {

      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
        result => console.log('¿Tiene el permiso de la camara?', result.hasPermission),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
      );

      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.STORAGE).then(
        result => console.log('¿Tiene el permiso de almacenamiento?', result.hasPermission),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.STORAGE)
      );

      this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.STORAGE]);

    }





    platform.ready().then(() => {

      statusBar.styleDefault();
      splashScreen.hide();

      if (window.localStorage.getItem("logueado") == "true") {

        let loading = this.loadingCtrl.create({
          content: 'Engrasando máquinas...'
        });
        loading.present();
        this.fireAuth.loginUser(window.localStorage.getItem("email"), window.localStorage.getItem("password")).then(() => {
          this.fireUser.rellenarUsuario();
          this.appCtrl.getRootNav().setRoot(HomePage, {
            loader: loading,
          });
        });
      }


    });

    this.menu.enable(true, "menuInicio");
    this.menu.enable(false, "menu");


  }


  rightMenuClick(text) {
    this.appCtrl.getRootNav().setRoot(text);
    this.menu.close();
  }

  rightMenuClickSupport(text) {
    this.appCtrl.getRootNav().push(text);
    this.menu.close();
  }


  goHome() {
    this.appCtrl.getRootNav().setRoot(HomePage);
    this.menu.close();
  }

  cerrarSesion() {

    this.fireAuth.logOut();
    this.appCtrl.getRootNav().setRoot('LoginPage');
    window.localStorage.setItem("logueado", "false");
    //window.localStorage.clear();
    this.menu.close();

  }


}

