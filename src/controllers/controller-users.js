import { UsuarioManager } from "../dao/class/managerUsuario.js"
import { usuarioModelo } from "../dao/models/usuariosModel.js"
import { ServiceUser } from "../service/serviceUser.js"

export class Manager_users {


    static async changePremium(req, res) {

        let userId = req.params.uid
        let exist = await usuarioModelo.find({ _id: userId }).lean()
        let usuario = exist[0]
        if (usuario.length < 0 || usuario == undefined) {

            return res.status(400).json("El usuario ingresado no existe o ya no pertenece al servicio")

        }

        if (usuario && usuario.rol !== "admin") {

            if (usuario.rol == "user") {

                let userModific = { ...usuario, rol: "premium" }
                console.log(userModific)
                await ServiceUser.UpdateU(userModific)
                res.setHeader('Content-Type', 'application/json')
                res.status(200).json("El rol del usuario ingresado ha sido modificado a Premium ")

            } else {

                let userRol = { ...usuario, rol: "user" }
                await ServiceUser.UpdateU(userRol)
                res.setHeader('Content-Type', 'application/json')
                res.status(200).json("El rol del usuario ingresado ha sido modificado a user ")
            }


        }


    }
    static async uploadsFile(req, res) {

        let { id } = req.params
        let document = req.body

        let usuario = await UsuarioManager.idFilter(id)

        let name = document.category
        let reference = req.file.path
        let data = { name, reference }
        usuario.documents.push(data)

        if (name == "identificacion") {

            usuario.status[0].identificacion = true
        }
        if (name == "domicilio") {

            usuario.status[0].comprobanteD = true
        }
        if (name == "cuenta") {

            usuario.status[0].comprobanteC = true
        }

        try {
            const add = await UsuarioManager.updateUser(usuario)
            if (add) {
                res.setHeader('Content-Type', 'application/json')
                res.redirect("/views/userDocuments?mensaje=Se ingresaron su datos correctamente")

            }
        } catch (error) {
            res.setHeader('Content-Type', 'application/json')
            res.redirect("/views/userDocuments?error=No se pudo ingresar su datos correctamente")
        }




    }

}
