import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { UserModel } from '../../modelo/user';
import 'firebase/storage';
import { PublicacionModel } from '../../modelo/publicacion';
import { ComentariosModel } from '../../modelo/comentariosUsuarios';
import { Camera } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';



/*
  Generated class for the FireServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FireServiceProvider {

  user: Observable<firebase.User>;
  afAuth: AngularFireAuth;
  database: any;
  logueado: boolean;
  listaPublicaciones: PublicacionModel[] = [];
  usuario: UserModel = new UserModel();
  postComentarios: PublicacionModel = new PublicacionModel();
  listaPublicacionesGlobales: PublicacionModel[] = [];
  listaPublicacionesFavoritos: PublicacionModel[] = [];
  comentarios: ComentariosModel[];
  imagenSubir: String = "";


  constructor(
    afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    public storage: AngularFireStorage,
    public cameraPlugin: Camera,
    private transfer: FileTransfer,
  ) {
    this.user = afAuth.authState;
    this.afAuth = afAuth;
    this.database = firebase.database();


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

  traerPublicaciones(tipo: string) {

    var ref = this.database.ref('/users/' + this.afAuth.auth.currentUser.uid + '/datos/publicaciones/');
    var ref3 = this.database.ref('/users/' + this.afAuth.auth.currentUser.uid + '/foto');

    let currentUID = this.afAuth.auth.currentUser.uid

    this.usuario.listaPublicaciones = [];
    return ref.once('value', snapShot => {
      snapShot.forEach(childSnapshot => {
        if (childSnapshot.child('tipo').val() == tipo) {

          var publiUID = childSnapshot.key;

          var publi: PublicacionModel = new PublicacionModel();
          publi.key = childSnapshot.key;
          publi.titulo = childSnapshot.child('titulo').val();
          publi.descripcion = childSnapshot.child('descripcion').val();
          publi.fecha = childSnapshot.child('fecha').val();
          publi.likes = childSnapshot.child('/likes/numero').val();
          publi.valoracion = childSnapshot.child('/valoraciones/media').val();
          publi.tipo = childSnapshot.child('tipo').val();
          publi.fotoPubli = childSnapshot.child('imagen').val();

          ref3.on('value', data => {
            publi.foto = data.val();
          });

          publi.keyUser = currentUID;
          publi.key = publiUID;

          this.usuario.listaPublicaciones.push(publi);
        }
      });
      this.usuario.listaPublicaciones.reverse();
    });

  }

  subirFotoPost(titulo: string) {

    this.imagenSubir = "";
    return this.cameraPlugin.getPicture({
      quality: 100,
      destinationType: this.cameraPlugin.DestinationType.DATA_URL,
      sourceType: this.cameraPlugin.PictureSourceType.PHOTOLIBRARY,
      allowEdit: false,
      encodingType: this.cameraPlugin.EncodingType.PNG,
      targetWidth: 400,
      targetHeight: 400,
      saveToPhotoAlbum: false
    });
  }

  postPicture(postPicture,titulo) {
    // Send the picture to Firebase Storage
    let uidd = this.afAuth.auth.currentUser.uid;

    let base64Image = "data:image/jpeg;base64," + postPicture;

    const alea = Math.floor(Math.random() * 10000001);

    let options: FileUploadOptions = {
      fileKey: 'file_upload',
      fileName: titulo+this.afAuth.auth.currentUser.uid.toString()+alea+".jpeg",
      headers: {}

    }

    const fileTransfer: FileTransferObject = this.transfer.create();
    return fileTransfer.upload(base64Image, 'http://chicxsfitness.ddns.net:8081/subirFoto/subirPubli.php', options)
      .then(val => {
        this.imagenSubir = 'http://chicxsfitness.ddns.net:8081/subirFoto/publicaciones/' +titulo+ uidd+alea+".jpeg";
      });
  }

  subirPublicacion(titulo: string, descripcion: string, tipo: string) {
    let uidd = this.afAuth.auth.currentUser.uid;

    let ref = this.database.ref('/users/' + uidd + '/datos/publicaciones');

    var dt = new Date();

    // Display the month, day, and year. getMonth() returns a 0-based number.
    var month = dt.getMonth() + 1;
    var day = dt.getDate();
    var year = dt.getFullYear();

    return ref.push({
      descripcion: descripcion,
      fecha: day + '-' + month + '-' + year,
      likes: { numero: 0 },
      titulo: titulo,
      tipo: tipo,
      valoraciones: { media: 0 },
      imagen: this.imagenSubir
    }).then(value => {
      this.database.ref('/publicaciones/' + value.key).update({
        user: uidd
      })
    });

  }

  actualizarPublicacion(titulo: string, descripcion: string, tipo: any, key: string) {

    let uidd = this.afAuth.auth.currentUser.uid;

    let ref = this.database.ref('/users/' + uidd + '/datos/publicaciones/' + key);

    var dt = new Date();

    // Display the month, day, and year. getMonth() returns a 0-based number.
    var month = dt.getMonth() + 1;
    var day = dt.getDate();
    var year = dt.getFullYear();


    return ref.update({
      descripcion: descripcion,
      titulo: titulo,
      fecha: day + '-' + month + '-' + year,
      tipo: tipo,
      imagen: this.imagenSubir
    }).then(value => {
      this.database.ref('/publicaciones/' + key).update({
        user: uidd
      })
    });;


  }

  actualizarPublicacionSinFoto(titulo: string, descripcion: string, tipo: any, key: string) {

    let uidd = this.afAuth.auth.currentUser.uid;

    let ref = this.database.ref('/users/' + uidd + '/datos/publicaciones/' + key);

    var dt = new Date();

    // Display the month, day, and year. getMonth() returns a 0-based number.
    var month = dt.getMonth() + 1;
    var day = dt.getDate();
    var year = dt.getFullYear();


    return ref.update({
      descripcion: descripcion,
      titulo: titulo,
      fecha: day + '-' + month + '-' + year,
      tipo: tipo,
    }).then(value => {
      this.database.ref('/publicaciones/' + key).update({
        user: uidd
      })
    });;


  }

  borrarPublicacion(key) {

    let uidd = this.afAuth.auth.currentUser.uid;

    let ref = this.db.list('/users/' + uidd + '/datos/publicaciones/');
    let ref2 = this.db.list('/publicaciones');

    return ref.remove(key).then(value => ref2.remove(key));
  }


  traerPublicacionesGlobales() {

    var ref = this.database.ref('/publicaciones').limitToLast(100);

    this.listaPublicacionesGlobales = [];



    return ref.once('value', snapShot => {
      snapShot.forEach(childSnapshot => {
        var userUID = childSnapshot.child('user').val();
        var publiUID = childSnapshot.key;



        var publi: PublicacionModel = new PublicacionModel();


        firebase.database().ref('/users/' + userUID + '/datos/publicaciones/' + publiUID + '/titulo').on('value', data => {
          publi.titulo = data.val();
        });

        firebase.database().ref('/users/' + userUID + '/datos/publicaciones/' + publiUID + '/descripcion').on('value', data => {
          publi.descripcion = data.val();
        });

        firebase.database().ref('/users/' + userUID + '/datos/publicaciones/' + publiUID + '/tipo').on('value', data => {
          publi.tipo = data.val();
        });

        firebase.database().ref('/users/' + userUID + '/datos/publicaciones/' + publiUID + '/fecha').on('value', data => {
          publi.fecha = data.val();
        });

        firebase.database().ref('/users/' + userUID + '/datos/publicaciones/' + publiUID + '/likes/numero').on('value', data => {
          publi.likes = data.val();
        });

        firebase.database().ref('/users/' + userUID + '/datos/publicaciones/' + publiUID + '/valoraciones/media').on('value', data => {
          publi.valoracion = data.val();
        });

        firebase.database().ref('/users/' + userUID + '/datos/publicaciones/' + publiUID + '/imagen').on('value', data => {
          publi.fotoPubli = data.val();
        });

        firebase.database().ref('/users/' + userUID + '/nombre').on('value', data => {
          publi.nombreUsuario = data.val();
        });

        firebase.database().ref('/users/' + userUID + '/apellidos').on('value', data => {
          publi.apellidosUsuario = data.val();
        });

        firebase.database().ref('/users/' + userUID + '/foto').on('value', data => {
          publi.foto = data.val();
        });

        publi.keyUser = userUID;
        publi.key = publiUID;

        this.listaPublicacionesGlobales.push(publi);


      });
      this.listaPublicacionesGlobales.reverse();
    });

  }

  meGusta(key, keyUser, likes: number) {

    let likesAntiguo: number = likes;

    let currentUID = this.afAuth.auth.currentUser.uid;

    let bd = this.db;

    let ref = this.database.ref('/users/' + keyUser + '/datos/publicaciones/' + key + '/likes/users/');

    return ref.once('value', snapShot => {
      snapShot.forEach(childSnapshot => {
        if (childSnapshot.child('user').val() == currentUID) {
          likes--;
          bd.list('/users/' + keyUser + '/datos/publicaciones/' + key + '/likes/users').remove(childSnapshot);
          firebase.database().ref('/users/' + keyUser + '/datos/publicaciones/' + key + '/likes').update({
            numero: likes,
          });
        }
      });
    }).then(val => {

      if (likesAntiguo == likes) {
        likes++;
        firebase.database().ref('/users/' + keyUser + '/datos/publicaciones/' + key + '/likes/users').push({
          user: currentUID,
        });
        firebase.database().ref('/users/' + keyUser + '/datos/publicaciones/' + key + '/likes').update({
          numero: likes,
        });
      }
    });

  }

  valorarPublicacion(voto, postKey, userKey) {

    let currentUID = this.afAuth.auth.currentUser.uid;
    let post = false;
    let ref = this.database.ref('/users/' + userKey + '/datos/publicaciones/' + postKey + '/valoraciones/users/');

    return ref.once('value', snapShot => {
      snapShot.forEach(childSnapshot => {
        if (childSnapshot.child('user').val() == currentUID) {
          post = true;
          firebase.database().ref('/users/' + userKey + '/datos/publicaciones/' + postKey + '/valoraciones/users/' + childSnapshot.key).update({
            puntuacion: voto
          });
        }
      });
      if (snapShot.val() == null || !post) {
        firebase.database().ref('/users/' + userKey + '/datos/publicaciones/' + postKey + '/valoraciones/users').push({
          user: currentUID,
          puntuacion: voto
        });
      }

    }).then(val => {
      let users = 0;
      let puntuacionEntera = 0;
      let mediaFinal = 0;

      let ref = this.database.ref('/users/' + userKey + '/datos/publicaciones/' + postKey + '/valoraciones/users/');


      return ref.once('value', snapShot => {
        snapShot.forEach(childSnapshot => {
          users++;
          puntuacionEntera += childSnapshot.child('/puntuacion').val();
        });
      }).then(value => {
        mediaFinal = puntuacionEntera / users;
        firebase.database().ref('/users/' + userKey + '/datos/publicaciones/' + postKey + '/valoraciones').update({
          media: mediaFinal
        })
      });


    });

  }

  annadirFav(keyPost, keyUser) {

    let currentUID = this.afAuth.auth.currentUser.uid;

    let ref = this.database.ref('/users/' + currentUID + '/datos/favoritos/');
    let repetido = false;
    return ref.once('value', snapShot => {
      snapShot.forEach(childSnapshot => {
        if (childSnapshot.child('user').val() == keyPost) {
          repetido = true;
        }
      });
    }).then(val => {
      if (!repetido) {
        ref.child(keyPost).set({
          user: keyUser
        });
      }
    });
  }

  traerFavoritos() {

    var ref = this.database.ref('/users/' + this.afAuth.auth.currentUser.uid + '/datos/favoritos/');

    this.listaPublicacionesFavoritos = [];

    return ref.once('value', snapShot => {
      snapShot.forEach(childSnapshot => {
        var userUID = childSnapshot.child('user').val();
        var publiUID = childSnapshot.key;
        var publi: PublicacionModel = new PublicacionModel();

        firebase.database().ref('/users/' + userUID + '/datos/publicaciones/' + publiUID + '/titulo').on('value', data => {
          publi.titulo = data.val();
        });

        firebase.database().ref('/users/' + userUID + '/datos/publicaciones/' + publiUID + '/descripcion').on('value', data => {
          publi.descripcion = data.val();
        });

        firebase.database().ref('/users/' + userUID + '/datos/publicaciones/' + publiUID + '/fecha').on('value', data => {
          publi.fecha = data.val();
        });

        firebase.database().ref('/users/' + userUID + '/datos/publicaciones/' + publiUID + '/likes/numero').on('value', data => {
          publi.likes = data.val();
        });

        firebase.database().ref('/users/' + userUID + '/datos/publicaciones/' + publiUID + '/valoraciones/media').on('value', data => {
          publi.valoracion = data.val();
        });

        firebase.database().ref('/users/' + userUID + '/datos/publicaciones/' + publiUID + '/imagen').on('value', data => {
          publi.fotoPubli = data.val();
        });

        firebase.database().ref('/users/' + userUID + '/datos/publicaciones/' + publiUID + '/tipo').on('value', data => {
          publi.tipo = data.val();
        });

        firebase.database().ref('/users/' + userUID + '/nombre').on('value', data => {
          publi.nombreUsuario = data.val();
        });

        firebase.database().ref('/users/' + userUID + '/apellidos').on('value', data => {
          publi.apellidosUsuario = data.val();
        });

        firebase.database().ref('/users/' + userUID + '/foto').on('value', data => {
          publi.foto = data.val();
        });

        publi.keyUser = userUID;
        publi.key = publiUID;

        this.listaPublicacionesFavoritos.push(publi);


      });
      this.listaPublicacionesFavoritos.reverse();
    });

  }

  borrarPublicacionFav(key) {

    var ref = this.database.ref('/users/' + this.afAuth.auth.currentUser.uid + '/datos/favoritos/' + key);

    return ref.remove();

  }

  rescatarPost(idPost, idUser) {

    let ref = this.database.ref('/users/' + idUser + '/datos/publicaciones/' + idPost);


    return ref.once('value', snapShot => {

      firebase.database().ref('/users/' + idUser + '/datos/publicaciones/' + idPost).child('titulo').on('value', data => {
        this.postComentarios.titulo = data.val();
      });
      firebase.database().ref('/users/' + idUser + '/datos/publicaciones/' + idPost).child('descripcion').on('value', data => {
        this.postComentarios.descripcion = data.val();
      });
      firebase.database().ref('/users/' + idUser + '/datos/publicaciones/' + idPost).child('tipo').on('value', data => {
        this.postComentarios.tipo = data.val();
      });
      firebase.database().ref('/users/' + idUser + '/datos/publicaciones/' + idPost).child('fecha').on('value', data => {
        this.postComentarios.fecha = data.val();
      });
      firebase.database().ref('/users/' + idUser + '/datos/publicaciones/' + idPost).child('imagen').on('value', data => {
        this.postComentarios.fotoPubli = data.val();
      });
      firebase.database().ref('/users/' + idUser + '/datos/publicaciones/' + idPost).child('likes/numero').on('value', data => {
        this.postComentarios.likes = data.val();
      });
      firebase.database().ref('/users/' + idUser + '/datos/publicaciones/' + idPost).child('valoraciones/media').on('value', data => {
        this.postComentarios.valoracion = data.val();
      });
      firebase.database().ref('/users/' + idUser + '/nombre').on('value', data => {
        this.postComentarios.nombreUsuario = data.val();
      });

      firebase.database().ref('/users/' + idUser + '/apellidos').on('value', data => {
        this.postComentarios.apellidosUsuario = data.val();
      });

      firebase.database().ref('/users/' + idUser + '/foto').on('value', data => {
        this.postComentarios.foto = data.val();
      });

      this.postComentarios.keyUser = idUser;
      this.postComentarios.key = idPost;
    });

  }

  comentarPost(comentario, keyPost, keyUser) {
    let currentUID = this.afAuth.auth.currentUser.uid;

    return firebase.database().ref('/users/' + keyUser + '/datos/publicaciones/' + keyPost + '/comentarios').push({
      user: currentUID,
      comentario: comentario
    });
  }

  rellenarComentarios(keyPost, keyUser) {

    var ref = this.database.ref('/users/' + keyUser + '/datos/publicaciones/' + keyPost + '/comentarios/');

    this.comentarios = [new ComentariosModel()];

    return ref.once('value', snapShot => {
      snapShot.forEach(childSnapshot => {
        let comentario = new ComentariosModel();
        firebase.database().ref('/users/' + childSnapshot.child('user').val()).child('nombre').on('value', data => {
          comentario.nombre = data.val();
        });
        firebase.database().ref('/users/' + childSnapshot.child('user').val()).child('apellidos').on('value', data => {
          comentario.apellidos = data.val();
        });
        firebase.database().ref('/users/' + childSnapshot.child('user').val()).child('foto').on('value', data => {
          comentario.foto = data.val();
        });
        comentario.comentario = childSnapshot.child("comentario").val();
        comentario.userId = childSnapshot.child("user").val();
        comentario.comenId = childSnapshot.key
        this.comentarios.push(comentario);
      });
    });
  }

  borrarComentario(idPost, idUser, idComen) {
    return this.database.ref('/users/' + idUser + '/datos/publicaciones/' + idPost + '/comentarios/' + idComen).remove();
  }

  traerPublicacionesProfile(tipo: string, userKey: string) {

    var ref = this.database.ref('/users/' + userKey + '/datos/publicaciones/');
    var ref3 = this.database.ref('/users/' + userKey + '/foto');

    let currentUID = userKey

    this.usuario.listaPublicaciones = [];
    return ref.once('value', snapShot => {
      snapShot.forEach(childSnapshot => {
        if (childSnapshot.child('tipo').val() == tipo) {

          var publiUID = childSnapshot.key;

          var publi: PublicacionModel = new PublicacionModel();
          publi.key = childSnapshot.key;
          publi.titulo = childSnapshot.child('titulo').val();
          publi.descripcion = childSnapshot.child('descripcion').val();
          publi.fecha = childSnapshot.child('fecha').val();
          publi.likes = childSnapshot.child('/likes/numero').val();
          publi.valoracion = childSnapshot.child('/valoraciones/media').val();
          publi.tipo = childSnapshot.child('tipo').val();
          publi.fotoPubli = childSnapshot.child('imagen').val();

          ref3.on('value', data => {
            publi.foto = data.val();
          });

          publi.keyUser = currentUID;
          publi.key = publiUID;

          this.usuario.listaPublicaciones.push(publi);
        }
      });
      this.usuario.listaPublicaciones.reverse();
    });

  }

  traerFavoritosProfile(userKey: string) {

    var ref = this.database.ref('/users/' + userKey + '/datos/favoritos/');

    this.listaPublicacionesFavoritos = [];

    return ref.once('value', snapShot => {
      snapShot.forEach(childSnapshot => {
        var userUID = childSnapshot.child('user').val();
        var publiUID = childSnapshot.key;
        var publi: PublicacionModel = new PublicacionModel();

        firebase.database().ref('/users/' + userUID + '/datos/publicaciones/' + publiUID + '/titulo').on('value', data => {
          publi.titulo = data.val();
        });

        firebase.database().ref('/users/' + userUID + '/datos/publicaciones/' + publiUID + '/descripcion').on('value', data => {
          publi.descripcion = data.val();
        });

        firebase.database().ref('/users/' + userUID + '/datos/publicaciones/' + publiUID + '/fecha').on('value', data => {
          publi.fecha = data.val();
        });

        firebase.database().ref('/users/' + userUID + '/datos/publicaciones/' + publiUID + '/likes/numero').on('value', data => {
          publi.likes = data.val();
        });

        firebase.database().ref('/users/' + userUID + '/datos/publicaciones/' + publiUID + '/valoraciones/media').on('value', data => {
          publi.valoracion = data.val();
        });

        firebase.database().ref('/users/' + userUID + '/datos/publicaciones/' + publiUID + '/imagen').on('value', data => {
          publi.fotoPubli = data.val();
        });

        firebase.database().ref('/users/' + userUID + '/datos/publicaciones/' + publiUID + '/tipo').on('value', data => {
          publi.tipo = data.val();
        });

        firebase.database().ref('/users/' + userUID + '/nombre').on('value', data => {
          publi.nombreUsuario = data.val();
        });

        firebase.database().ref('/users/' + userUID + '/apellidos').on('value', data => {
          publi.apellidosUsuario = data.val();
        });

        firebase.database().ref('/users/' + userUID + '/foto').on('value', data => {
          publi.foto = data.val();
        });

        publi.keyUser = userUID;
        publi.key = publiUID;

        this.listaPublicacionesFavoritos.push(publi);


      });
      this.listaPublicacionesFavoritos.reverse();
    });

  }



}
