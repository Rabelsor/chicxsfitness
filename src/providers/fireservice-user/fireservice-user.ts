import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { UserModel } from '../../modelo/user';
import { Camera } from '@ionic-native/camera';
import { PhotoLibrary } from '@ionic-native/photo-library';
import 'firebase/storage';
import { Platform } from 'ionic-angular';
import { ChatModel } from '../../modelo/chat';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

/*
  Generated class for the FireserviceUserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FireserviceUserProvider {

  usuario: UserModel = new UserModel();
  userProfile: UserModel;
  isAmigo: Boolean;
  listaAmigos: UserModel[] = [];
  me: UserModel = new UserModel;
  to: UserModel = new UserModel;
  mensajes: ChatModel[] = [];
  urlFoto: string;
  user: Observable<firebase.User>;
  afAuth: AngularFireAuth;
  database: any;
  logueado: boolean;
  busquedaAmigosGlobal: UserModel[] = [];

  actualizar: Observable<Boolean>;
  public base64Image: string;


  constructor(
    afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    public cameraPlugin: Camera,
    public photoLibrary: PhotoLibrary,
    public storage: AngularFireStorage,
    public platform: Platform,
    private transfer: FileTransfer,

  ) {
    this.user = afAuth.authState;
    this.afAuth = afAuth;
    this.database = firebase.database();
  }

  obtenerRol() {
    firebase.database().ref('/users/' + this.afAuth.auth.currentUser.uid + '/rol/').on('value', data => {
      this.usuario.rol = data.val();
    });
    return this.usuario.rol;
  }

  rellenarUsuario() {

    let uidd = this.afAuth.auth.currentUser.uid;
    let ref = this.database.ref('/users/' + uidd);

    return ref.once('value', snapShot => {

      this.usuario.apellidos = snapShot.child("apellidos").val();
      this.usuario.correo = snapShot.child("correo").val();
      this.usuario.edad = snapShot.child("edad").val();
      this.usuario.foto = snapShot.child("foto").val();
      this.usuario.nombre = snapShot.child("nombre").val();
      this.usuario.peso = snapShot.child("peso").val();
      this.usuario.rol = snapShot.child("rol").val();
      this.usuario.sexo = snapShot.child("sexo").val();
    });

  }

  guardarDatos(apellidos, edad, nombre, sexo, peso) {

    let uidd = this.afAuth.auth.currentUser.uid;

    firebase.database().ref('/users/' + uidd + '/rol/').on('value', data => {
      this.usuario.rol = data.val();
    });


    firebase.database().ref('/users/' + uidd + '/foto/').on('value', data => {
      this.usuario.foto = data.val();
    });

    var rol = 'Fitness';

    if (this.usuario.rol != null) {
      rol = this.usuario.rol;
    }

    var foto = 'http://chicxsfitness.ddns.net:8081/subirFoto/upload/principal.jpg';

    if (this.usuario.foto != null) {
      foto = this.usuario.foto;
    }


    return firebase.database().ref('/users/' + uidd).update({
      apellidos: apellidos,
      correo: this.afAuth.auth.currentUser.email,
      edad: edad,
      nombre: nombre,
      rol: rol,
      sexo: sexo,
      foto: foto,
      peso: peso,
    });
  }

  guardarDatosNuevos(apellidos, edad, nombre, sexo, peso) {

    let uidd = this.afAuth.auth.currentUser.uid;

    var rol = 'Fitness';

    var foto = 'http://chicxsfitness.ddns.net:8081/subirFoto/upload/principal.jpg';

    return firebase.database().ref('/users/' + uidd).update({
      apellidos: apellidos,
      correo: this.afAuth.auth.currentUser.email,
      edad: edad,
      nombre: nombre,
      rol: rol,
      sexo: sexo,
      foto: foto,
      peso: peso,
    });
  }

  subirFoto() {
    return this.cameraPlugin.getPicture({
      quality: 95,
      destinationType: this.cameraPlugin.DestinationType.DATA_URL,
      sourceType: this.cameraPlugin.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: this.cameraPlugin.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      saveToPhotoAlbum: false
    });






  }

  cambiarFoto0(imageData) {
    let uidd = this.afAuth.auth.currentUser.uid;

    let ref = this.database.ref('/users/' + uidd);

    this.base64Image = "data:image/jpeg;base64," + imageData;

    const alea = Math.floor(Math.random() * 10000001);
    
    let options: FileUploadOptions = {
      fileKey: 'file_upload',
      fileName: this.afAuth.auth.currentUser.uid.toString() + alea + ".jpeg",
      headers: {}

    }
    const fileTransfer: FileTransferObject = this.transfer.create();
    return fileTransfer.upload(this.base64Image, 'http://chicxsfitness.ddns.net:8081/subirFoto/subirFichero.php', options)
      .then(val => {
        ref.update({
          foto: 'http://chicxsfitness.ddns.net:8081/subirFoto/upload/' + uidd + alea + ".jpeg",
        });
        this.usuario.foto = 'http://chicxsfitness.ddns.net:8081/subirFoto/upload/' + uidd + alea + ".jpeg";
      });



  }

  rellenarUsuarioProfile(userKey) {

    let uidd = userKey;
    this.userProfile = new UserModel;
    let ref = this.database.ref('/users/' + uidd);



    return ref.once('value', snapShot => {
      this.userProfile.apellidos = snapShot.child("apellidos").val();
      this.userProfile.correo = snapShot.child("correo").val();
      this.userProfile.edad = snapShot.child("edad").val();
      this.userProfile.foto = snapShot.child("foto").val();
      this.userProfile.nombre = snapShot.child("nombre").val();
      this.userProfile.peso = snapShot.child("peso").val();
      this.userProfile.rol = snapShot.child("rol").val();
      this.userProfile.sexo = snapShot.child("sexo").val();
    });

  }

  esAmigo(userKey) {
    let ref = this.database.ref('/users/' + this.afAuth.auth.currentUser.uid + '/amigos');
    this.isAmigo = false;

    return ref.once('value', snapShot => {
      snapShot.forEach(childSnapshot => {
        if (childSnapshot.child("uid").val() == userKey) {
          this.isAmigo = true;
        }
      });
    });
  }

  isYour(userKey): Boolean {
    if (userKey == this.afAuth.auth.currentUser.uid) {
      return true
    } else {
      return false
    }
  }

  seguirUsuario(userKey) {
    let ref = this.database.ref('/users/' + this.afAuth.auth.currentUser.uid + '/amigos');

    ref.push({
      uid: userKey
    })
  }

  dejarSeguirUsuario(userKey) {
    let ref = this.database.ref('/users/' + this.afAuth.auth.currentUser.uid + '/amigos');
    return ref.once('value', snapShot => {
      snapShot.forEach(childSnapshot => {
        if (childSnapshot.child("uid").val() == userKey) {
          ref.child(childSnapshot.key).remove();
        }
      })
    });
  }

  rellenarAmigos() {
    this.listaAmigos = [];
    let ref = this.database.ref('/users/' + this.afAuth.auth.currentUser.uid + '/amigos');
    return ref.once('value', snapShot => {
      snapShot.forEach(childSnapshot => {
        let uid = childSnapshot.child("uid").val();
        this.rellenarUsuarioAmigo(uid);
      });
    });
  }

  rellenarUsuarioAmigo(userKey) {

    let uidd = userKey;
    this.userProfile = new UserModel;
    let ref = this.database.ref('/users/' + uidd);


    ///////////////////////////////////////////// NOTIFICACIONES

    let refNotificacion = this.database.ref('/users/' + this.afAuth.auth.currentUser.uid + '/datos/mensajes/' + userKey);


    //////////////////////////////////////////


    let userAmigo: UserModel = new UserModel();


    return ref.once('value', snapShot => {
      userAmigo.apellidos = snapShot.child("apellidos").val();
      userAmigo.correo = snapShot.child("correo").val();
      userAmigo.edad = snapShot.child("edad").val();
      userAmigo.foto = snapShot.child("foto").val();
      userAmigo.nombre = snapShot.child("nombre").val();
      userAmigo.peso = snapShot.child("peso").val();
      userAmigo.rol = snapShot.child("rol").val();
      userAmigo.sexo = snapShot.child("sexo").val();
      userAmigo.uid = userKey;

    }).then(val => {
      refNotificacion.once('value', snapShot => {
        userAmigo.notificacion = snapShot.child('notificacion').val();
      }).then(val => {
        this.listaAmigos.push(userAmigo);
      });

    });

  }

  iniciarConversasionTo(uidTo) {

    this.to = new UserModel();

    let refTo = this.database.ref('/users/' + uidTo);

    return refTo.once('value', snapShot => {
      this.to.apellidos = snapShot.child("apellidos").val();
      this.to.nombre = snapShot.child("nombre").val();
      this.to.foto = snapShot.child("foto").val();
      this.to.uid = uidTo;
    });
  }

  iniciarConversasionMe() {
    let refMe = this.database.ref('/users/' + this.afAuth.auth.currentUser.uid);

    return refMe.once('value', snapShot => {
      this.me.apellidos = snapShot.child("apellidos").val();
      this.me.nombre = snapShot.child("nombre").val();
      this.me.foto = snapShot.child("foto").val();
      this.me.uid = this.afAuth.auth.currentUser.uid;
    });

  }

  rescatarTodosLosMensajes() {
    this.mensajes = [];
    //this.comprobarMensajesEntrantes();
    let ref = this.database.ref('/users/' + this.afAuth.auth.currentUser.uid + '/datos/mensajes/' + this.to.uid);
    return ref.once('value', snapShot => {
      snapShot.forEach(childSnapshot => {
        if (childSnapshot.key != 'notificacion') {
          let chat: ChatModel = new ChatModel;
          chat.uid = childSnapshot.child("uid").val();
          chat.contenido = childSnapshot.child("contenido").val();
          chat.fecha = childSnapshot.child("fecha").val();
          this.mensajes.push(chat);
        } else {
          if (childSnapshot.val()) {
            ref.update({
              notificacion: false
            })
          }
        }
      });
    });
  }

  enviarMensaje(mensaje: string) {
    return this.comprobarSiEsAmigo().then(val => {

      let refMe = this.database.ref('/users/' + this.me.uid + '/datos/mensajes/' + this.to.uid);
      let refTo = this.database.ref('/users/' + this.to.uid + '/datos/mensajes/' + this.me.uid);

      var dt = new Date();

      // Display the month, day, and year. getMonth() returns a 0-based number.
      var month = dt.getMonth() + 1;
      var day = dt.getDate();
      var year = dt.getFullYear();
      var hour = dt.getHours();
      var min = dt.getMinutes();

      if (this.isAmigo == false) {
        this.database.ref('/users/' + this.to.uid + '/amigos').push({
          uid: this.me.uid
        });
      }

      refMe.push({
        fecha: day + '-' + month + '-' + year + '/' + hour + ':' + min,
        uid: this.me.uid,
        contenido: mensaje
      });

      this.database.ref('/users/' + this.me.uid + '/datos/mensajes/' + this.to.uid).update({
        notificacion: false
      });

      refTo.push({
        fecha: day + '-' + month + '-' + year + '/' + hour + ':' + min,
        uid: this.me.uid,
        contenido: mensaje
      });

      this.database.ref('/users/' + this.to.uid + '/datos/mensajes/' + this.me.uid).update({
        notificacion: true
      });

    });
  }

  comprobarSiEsAmigo() {

    let ref = this.database.ref('/users/' + this.to.uid + '/amigos');
    this.isAmigo = false;

    return ref.once('value', snapShot => {
      snapShot.forEach(childSnapshot => {
        if (childSnapshot.child('uid').val() == this.me.uid) {
          this.isAmigo = true;
        }
      });
    });
  }

  comprobarMensajesEntrantes() {
    return this.database.ref('/users/' + this.afAuth.auth.currentUser.uid + '/datos/mensajes/' + this.to.uid);
  }

  quitarNotificacion(userKey) {
    let ref = this.database.ref('/users/' + this.afAuth.auth.currentUser.uid + '/datos/mensajes/' + userKey);
    return ref.once('value', snapShot => {
      snapShot.forEach(childSnapshot => {
        ref.update({
          notificacion: false
        });
      });
    });
  }

  borrarMisMensajes(userKey) {
    this.database.ref('/users/' + this.afAuth.auth.currentUser.uid + '/datos/mensajes/' + userKey).remove();
  }

  buscarPorCorreo(correoRegex) {
    this.busquedaAmigosGlobal = [];
    let ref = this.database.ref('/users');
    return ref.once('value', snapShot => {
      snapShot.forEach(childSnapshot => {
        if (childSnapshot.child('correo').val().indexOf(correoRegex) != -1) {
          let userEncontrado = new UserModel();
          userEncontrado.apellidos = childSnapshot.child("apellidos").val();
          userEncontrado.correo = childSnapshot.child("correo").val();
          userEncontrado.edad = childSnapshot.child("edad").val();
          userEncontrado.foto = childSnapshot.child("foto").val();
          userEncontrado.nombre = childSnapshot.child("nombre").val();
          userEncontrado.peso = childSnapshot.child("peso").val();
          userEncontrado.rol = childSnapshot.child("rol").val();
          userEncontrado.sexo = childSnapshot.child("sexo").val();
          userEncontrado.uid = childSnapshot.key;
          this.busquedaAmigosGlobal.push(userEncontrado);
        }
      });
    });
  }

}
