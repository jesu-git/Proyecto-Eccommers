import { UsuarioManager } from "../dao/class/managerUsuario.js";



export class ServiceUser {


    static async UpdateU(user){

        return await UsuarioManager.updateUser(user)
    }
}