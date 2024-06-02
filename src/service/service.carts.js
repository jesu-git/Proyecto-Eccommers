import { cartsMongo as DAO, cartsMongo } from "../dao/class/managerCartsMongo.js";

export class ServiceCart {

    static async servicePopulate(id, route) {

        return await DAO.cartIdPopulate(id, route)

    }
    static async serviceCreateCart() {

        return await DAO.createCart()
    }
    static async serviceAddP(id, prodId) {

        return await DAO.addProductsCart(id, prodId)
    }
    static async serviceDeleteP(cartId, prodId) {

        return await DAO.deleteProdcutsCart(cartId)

    }
    static async serviceUpdateA(cartId, array) {

        return await DAO.updateArray(cartId, array)

    }
    static async serviceIQuality(id, idProduct, quantity) {

        return await DAO.updateQuantity(id, idProduct, quantity)

    }
    static async serviceEmpyCart(id) {

        return await DAO.deleteProdcutsCart(id)

    }
    static async productById(id) {

        try {
            return await cartsMongo.ProductById(id)

        } catch (error) {

            console.log("ERROR, no se pudo realizar la busqueda")
        }
    }
    static async updateProducts(_id, obj) {

        try {

            let product = cartsMongo.update(_id, obj)

            return product

        }
        catch (error) {

            console.log("El id no se ecuentra en BD..")

        }
    }
    static async ticket(ticket){

          return await DAO.GTicket(ticket)


    }
}

