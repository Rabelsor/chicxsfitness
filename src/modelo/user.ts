import { PublicacionModel } from "./publicacion";

export class UserModel {
  
    correo?:any;
    apellidos?:any;
    edad?:any;
    nombre?:any;
    sexo?:any;
    rol?:any;
    foto?:any;
    peso?:any;
    uid?:any;
    listaPublicaciones?:PublicacionModel[] = [];
    notificacion?:any;

    constructor( 
       ){
         
        }


        get diagnostic() { return JSON.stringify(this); }
    
}