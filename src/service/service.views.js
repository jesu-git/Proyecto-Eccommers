import { cartsMongo } from '../dao/class/managerCartsMongo.js'
import { ProductsMongo } from '../dao/class/managerProductsMongo.js'
import { UsuarioManager } from '../dao/class/managerUsuario.js'
export class ServiceViews { 

static async getService() {

    return await ProductsMongo.getProduct()

}
static async servicePaginate(category, limit, page, sortValue) {

        return await ProductsMongo.productPaginate(category, limit, page, sortValue)
       
}
static async servicePopulate(id, route) {

        return await cartsMongo.cartIdPopulate(id,route)

}
static async filterUser(email){

        return await UsuarioManager.emailFilter(email)
}
static async passUpdate (user){

        return await UsuarioManager.updateUser(user)
}
}