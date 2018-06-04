export class PublicacionModel {
  
    titulo?:string;
    descripcion?:string;
    fecha?:Date;
    userId?:any;
    tipo?:string;
    likes?:number;
    valoracion?:number;
    key?:any;
    nombreUsuario?:string;
    apellidosUsuario?:string;
    foto?:any;
    keyUser?:any;
    fotoPubli?: any;

    constructor( 
       ){
         
        }

        get diagnostic() { return JSON.stringify(this); }


    
}