import { ProductsMongo as dao } from '../dao/class/managerProductsMongo.js'


export class ServiceProduct {

    static async servicePaginate(category, limit, page, sortValue) {

        return await dao.productPaginate(category, limit, page, sortValue)


    }
    static async serviceId(id) {

        return await dao.filterForId(id)

    }
    static async filterCode(id) {


        return await dao.filterForCode(id)

    }
    static async addProduct(product) {

        return await dao.addProducts(product)

    }
    static async serviceUpdate(id, modify) {

        return await dao.update(id, modify)

    }
    static async serviceDelete(id) {

        return await dao.deleteProduct(id)

    }

}

