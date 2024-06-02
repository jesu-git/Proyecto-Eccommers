
import { CartModelo } from "../models/cartsModelo.js"
import { productModelo } from "../models/productModelo.js"
import { ticketModel } from "../models/ticketModel.js"

export class cartsMongo {

    static async getCart() {

        try {

            return await CartModelo.find().lean()

        } catch (error) {

            console.log("No hay carritos en BD..")
        }


    }
    static async createCart() {

        try {

 
            let productCarts = []
            let cart = {

                productCarts

            }

            let cartsMongo = await CartModelo.create(cart)
            
            return cartsMongo


        } catch (error) {

            console.log("No se pudo crear el carrito", error.message)

        }




    }
    static async addProductsCart(_id, prodId) {

        try {

            let existProduct = await productModelo.findOne({ _id: prodId }).lean()
            if (existProduct == null) return null

        } catch (error) {

            console.log("No se encontro su producto")

        }

        try {

            let cart = await CartModelo.findOne({ _id: _id })
            let product = cart.productCarts.find(x => x.productId == prodId)

            if (product !== undefined) {

                product.quantity++
                let modificado = cart.productCarts
                await CartModelo.findOneAndUpdate({ _id }, { 'productCarts': modificado })

                return cart
            }

            if (product == undefined) {

                await CartModelo.findByIdAndUpdate({ _id }, { $push: { 'productCarts': { productId: prodId, quantity: 1 } } })
                return _id

            }

        } catch (error) {


            return console.log("Error al agregar producto", error.message)


        }
    }
    static async getCartId(id) {

        try {

            let carts = await CartModelo.findById({ id }).lean()
            return carts

        } catch (error) {

            console.log("NO existe el carrito indicado", error.menssage)

        }




    }
    static async deleteProdcutsCart(id) {

        try {

            let cart = await CartModelo.findOne({ _id: id })
            cart.productCarts = []
            console.log(cart)
            let vaciar = await CartModelo.findByIdAndUpdate({ _id: id }, { 'productCarts': cart.productCarts })
            return res.status(200).json("Vaciado con exito")
            
        } catch (error) {

            console.log("fallo al vaciar")

        }


    }
    static async deleteOneProduct(cartId, idProduct) {

        try {

            let cart = await CartModelo.findOne({ _id: cartId })
            let product = cart.productCarts.filter(x => x.productId != idProduct)
            await CartModelo.updateOne({ _id: cartId }, { 'productCarts': product })

            return cart

        } catch (error) {

            console.log('ERROR, no se pudo eliminar el producto')

        }
    }
    static async updateArray(id, data) {

        try {

            return await CartModelo.updateOne({ _id: id }, { $set: { 'productCarts': data } })

        } catch (error) {

            console.log("Error a intentar actualizar carrito", error.menssage)

        }

    }
    static async updateQuantity(_id, idProduct, cantidad) {

        try {
            let cart = await CartModelo.findById(_id)
            let existProduct = await productModelo.findById(idProduct)
            let product = cart.productCarts.find(x => x.productId == idProduct)
            let cant = parseInt(cantidad)

            if (product !== undefined) {

                product.quantity = cant
                let modificado = cart.productCarts
                await CartModelo.findOneAndUpdate({ _id }, { $set: { 'productCarts': modificado } })
                return cart
            }
        } catch (error) {

            console.log("fallo inesperado")

        }



    }
    static async cartIdPopulate(id, route) {

        try {

            return await CartModelo.findById(id).populate(route).lean()

        } catch (error) {

            console.log('ERROR, al realizar populate', error.message)

        }

    }
    static async ProductById(id) {


        try {

            return await productModelo.findById({ _id: id }).lean()

        } catch (error) {

            console.log(`El producto con id ${id} no existe`)

        }
    }
    static async update(_id, obj) {

        try {

            let product = productModelo.findOneAndUpdate({ _id }, obj)

            return product

        }
        catch (error) {

            console.log("El id no se ecuentra en BD..")

        }


        const checkObj = (obj) => {
            return obj === Object(obj);
        };


        if (!checkObj) {
            console.log("No es un objeto");
            return;
        }

        const keys = Object.keys(obj);
        let checkCode = keys.find(x => x === "code")

        if (checkCode) {
            let codeC = all_products1.find(x => x.code == obj.code)

            if (codeC) return console.log("El code utilizado ya esta en uso")
        }


        const keys_old = ["title", "description", "code", "price", "status", "stock", "category", "thumbnails"]

        try {

            keys.forEach((date) => {

                let dato = keys_old.includes(date)

                if (!dato) {

                    throw new error("hubo error")

                }

            })
        } catch (error) {

            console.log("Verifique sus campos, no son correctos")
            return error.menssage

        }
        console.log(obj)

        try {

            let productModific = await productModelo.findByIdAndUpdate({ _id }, obj)
            return _id

        } catch (error) {

            console.log("No se pudo modificar el producto")

        }

    }
    static async GTicket(ticket) {

        return await ticketModel.create(ticket)

    }


}
