
import { ServiceCart } from '../service/service.carts.js'
import { sendEmail } from '../utils/mails.js'

export class ControllerCart {

    static async cartId(req, res) {

        let { id } = req.params
        let respuesta = await ServiceCart.servicePopulate(id, 'productCarts.productId')

        if (!respuesta || respuesta == null)return res.status(400).json("No se ha encontrado el carrito ingresado") 
        else { res.status(200).json(respuesta) }

    }
    static async create_cart(req, res) {

        let create = await ServiceCart.serviceCreateCart()

        if (!create) return res.status(400).json("Error de creacion de carrito")
       
        req.logger.info("Creacion correcta de cart")
        return res.status(200).json(` ${create}`)

    }
    static async addProduct(req, res) {

        let { id } = req.params
        let { product } = req.params
        let { usuario } = req.session

        let exist = await ServiceCart.productById(product)
        if (exist.owner == usuario.email) {

            return res.status(403).json("NoAccess")

        }
        let respuesta = await ServiceCart.serviceAddP(id, product)
        console.log("respuesta",respuesta)
        req.logger.info(`Se ha agregado correctamente el producto al carrito: ${respuesta}`)

        if (!respuesta || respuesta == null) return res.status(400).json("Error a cargar el producto, revisar los valores.")
        else {

            return res.status(200).json("Tu producto ha sido agregado con exito")

        }

    }
    static async productDeleteCart(req, res) {

        let { cartId } = req.params
        let { idProduct } = req.params

        try {

            ServiceCart.serviceDeleteP(cartId, idProduct)
            res.status(200).json("Producto eliminado con exito")

        } catch (error) {

            res.status(400).json("No existe el carrito o producto ingresado")

        }

    }
    static async updateWArray(req, res) {

        try {
            let { _id } = req.params
            let data = req.body

           let newArray = await ServiceCart.serviceUpdateA(_id, data)
            res.status(200).json("Se ha actualizado su carrito")

        } catch (error) {

            res.status(400).json("Error al intentar actualizar carrito con array")

        }

    }
    static async insertQuality(req, res) {

        let id = req.params.id
        let idProduct = req.params.product
        let quantity = req.body.quantity
            
        try {

         let change =  await ServiceCart.serviceIQuality(id, idProduct, quantity)
         
            res.status(200).json("Se ha colocado la cantidad ingresada")

        } catch (error) {

            res.status(400).json("Error al cambiar la cantidad del producto")

        }

    }
    static async empyCart(req, res) {

        try {

            let { id } = req.params
            let vaciarCart = await ServiceCart.serviceEmpyCart(id)
            res.status(200).json("Se a vaciado su carrito")

        } catch (error) {

            res.status(400).json("Fallo al intentar vaciar su carrito")

        }


    }
    static async cartPurchase(req, res) {

        let { cartId } = req.params
        let { email } = req.session.usuario
        let cart = await ServiceCart.servicePopulate(cartId, 'productCarts.productId')
        let products = cart.productCarts

        if (products.length < 0) {

            return res.status(400).send("No hay productos en tu carrito")

        } else {

            let total = 0
            let sinStock = []
            let conStock = []
            products.forEach((x) => {

                
                if (x.productId.stock > x.quantity) {

                    let newStock = x.productId.stock - x.quantity
                    let subtotal = x.productId.price * x.quantity
                    ServiceCart.updateProducts(x.productId._id, { "stock": newStock })
                    total += subtotal
                    conStock.push(x.productId)
                } else {
                    let devolucion = { productId: x.productId._id, quantity: x.quantity }
                    sinStock.push(devolucion)
                }

            })
            if (conStock.length > 0) {

                let moldeTicket = {

                    code: Date.now(),
                    amount: total,
                    purchaser: email

                }
                try {

                    let ticket = await ServiceCart.ticket(moldeTicket)
                    await ServiceCart.serviceUpdateA(cartId, sinStock)
                    console.log("Se realizo su ticket con exito")

                    let message =`<h1>Resumen de compra</h1>
                    <p>
                        Numero de compra: ${moldeTicket.code}<br>
                        monto total: $${moldeTicket.amount}<br>
                        cuenta:  ${moldeTicket.purchaser}<br>
                    </p>`

                    let ask = await sendEmail(email,"Su compra se realizo con exito", message)
                    return res.status(200).json("exito")

                } catch (error) {
                    res.setHeader('Content-Type', 'application/json')
                    res.status(500).json("ERROR, No se pudo realizar su compra")
                }
            } else {
                if (sinStock.length >= 0) {
                    console.log("Sin productos")
                    return res.status(200).json("No")

                }

            }

        }

    }

}

