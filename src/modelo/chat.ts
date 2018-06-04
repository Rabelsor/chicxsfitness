export class ChatModel {

    uid?: string;
    contenido?: string;
    fecha?: any;
    constructor(
    ) {

    }
    get diagnostic() { return JSON.stringify(this); 
    }
}