import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClient, HttpClientModule } from '@angular/common/http';


//Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';

//Fotos
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';

//Camara
import { Camera } from '@ionic-native/camera';
import { PhotoLibrary } from '@ionic-native/photo-library';

//Correo
import { EmailComposer } from '@ionic-native/email-composer';

//Permisos
import { AndroidPermissions } from '@ionic-native/android-permissions';

//Ionic Image view
import { IonicImageViewerModule } from 'ionic-img-viewer';


//Mis clases
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DatosNuevosPage } from '../pages/datos-nuevos/datos-nuevos';
import { FireServiceProvider } from '../providers/fire-service/fire-service';
import { FireserviceAuthProvider } from '../providers/fireservice-auth/fireservice-auth';
import { FireserviceUserProvider } from '../providers/fireservice-user/fireservice-user';


//Firebase
export const firebaseConfig = {
  apiKey: "AIzaSyAldF49gbCP8NPa7uTWwd90sk9oi7rQbKM",
  authDomain: "chicxsfitness.firebaseapp.com",
  databaseURL: "https://chicxsfitness.firebaseio.com",
  storageBucket: "gs://chicxsfitness.appspot.com/",
  messagingSenderId: "957082514782",
  projectId: "chicxsfitness",
};


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DatosNuevosPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    IonicImageViewerModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DatosNuevosPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    FireServiceProvider,
    Camera,
    PhotoLibrary,
    AndroidPermissions,
    FireserviceAuthProvider,
    FireserviceUserProvider,
    EmailComposer,
    HttpClient,
    FileTransfer,
    FileTransferObject,
    FilePath,
    File,
  ]
})
export class AppModule { }

