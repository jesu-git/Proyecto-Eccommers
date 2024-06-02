
import { errorCodes } from "../utils/codeError.js"
import { ManejoErrores } from "../utils/customError.js"
import { errorLogueo } from "../utils/errores.js"



export function authRol(permisos = []) {

    return function (req, res, next) {

    

        if(!req.user || req.user == undefined){

             throw ManejoErrores.manejo("Error de logueo","Debes loguearte para tener acceso",errorCodes.ERROR_AUTH,errorLogueo())
        }
 

        if (req.user.rol == permisos[0] || permisos[1]) {

            return next()
        }else{
            res.setHeader('Content-Type','application/json')
            res.status(403).json("No tiene permisos necesarios para acceder a este sector") 
        }

    }

}