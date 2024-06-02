import { productModelo } from "../dao/models/productModelo.js"



export function premiumAuth() {

    return async function (req, res, next) {


        let { id } = req.params  
        let producto = await productModelo.findOne({ _id: id }).lean()


        if (producto.owner !== req.session.usuario.email) {

            res.setHeader('Content-Type', 'application/json')
           return res.status(403).json("No tiene permisos necesarios para acceder a este sector")
           
        } else {

            next()
        }


    }
}
