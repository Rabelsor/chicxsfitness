export class ComentariosModel {

    nombre?: String;
    apellidos?: String;
    comentario?: String;
    foto?:String;
    userId?:String;
    comenId?:String;

    constructor(
    ) {

    }

    get diagnostic() { return JSON.stringify(this); }



}