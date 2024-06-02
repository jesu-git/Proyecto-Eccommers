import { usuarioModelo } from "../dao/models/usuariosModel.js"


export function authStatus() {
   
    return async (req, res, next) => {


        let { uid } = req.params
        
        try {
            let usuario = await usuarioModelo.findOne({ _id:uid }).lean()

            if (usuario) {
                if (usuario.status[0].identificacion == true && usuario.status[0].comprobanteD == true && usuario.status[0].comprobanteC == true) {

                    next()

                }
                else {
                    res.setHeader('Content-Type', 'application/json')
                    return res.status(400).json({ Error: "Usuario con datos pendientes" })
                }
            }


        } catch (error) {

            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ Error: "Usuario no valido o sin permisos para esta accion" })

        }

    }

}