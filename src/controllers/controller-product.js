
import { io } from '../app.js'
import { ServiceProduct } from '../service/service.product.js'


export class ControllerProduct {

    static async getProductHome(req, res) {

        let { limit = 10, sort = {}, page = 1 } = req.query
        let sortValue = {}
        if (sort === "asc") {
            sortValue = { price: 1 };
        } else if (sort === "desc") {
            sortValue = { price: -1 }
        }

        let { category } = req.query

        if (category == undefined || null) {
            category = {}
        } else {

            category = { category: category }
        }

        try {

            let products = await ServiceProduct.servicePaginate(category, limit, page, sortValue)
            let { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = products
            let prevLink = '', nextLink = '';

            if (hasPrevPage) {

                prevLink = `localhost:8080/api/products?limit=${limit}&page=${prevPage}`

            } else { prevLink = null }

            if (hasNextPage) {

                nextLink = `localhost:8080/api/products?limit=${limit}&page=${nextPage}`

            } else { nextLink = null }

            if (!products) {

                res.status(400).json({ error: 'Error al intentar recuperar productos de la DB.' })

            };
            res.status(200).send(
                {
                    status: 'sucess',
                    payload: products.docs,
                    totalPages, hasNextPage, hasPrevPage, prevPage, nextPage, prevLink, nextLink
                })

        } catch (error) {

            res.status(500).send("Error  interno del servidor, intente mas tarde")

        }

    }
    static async getProductId(req, res) {

        let { id } = req.params

        try {

            let product = await ServiceProduct.serviceId(id)
            res.status(200).json(product)

        } catch (error) {
            req.logger.error(`El producto con id ${id} no existe`)
            res.status(400).json("El id ingresado no se en encuentra en la BD")

        }

    }
    static async createProduct(req, res) {

        let body = req.body
        let exist = await ServiceProduct.filterCode(body.code)
        let { usuario } = req.session

        if (exist.length > 0) res.redirect("/views/createProduct?error=Debe ingresar un code que no este en uso")

        const date = ['title', 'description', 'price', 'code', 'stock', 'category']

        let filter = date.filter(x => !(x in body));

        if (filter.length > 0) {

            return res.redirect("/views/createProduct?error=Complete los datos solicitados,Datos insuficientes")

        }
        body.price = parseInt(body.price)
        body.stock = parseInt(body.stock)


        const typeDate = {

            title: 'string',
            description: 'string',
            code: 'string',
            price: 'number',
            status: 'boolean',
            stock: 'number',
            category: 'string'

        }

        let incorrectDate = Object.entries(typeDate).reduce((acc, [date, type]) => {
            if (body[date] !== undefined) {

                if (typeof body[date] !== type) acc.push(date)
            } return acc
        }, [])

        if (incorrectDate.length > 0) {

            req.logger.error("Los datos incorrectos")
            return res.status(400).json("Los datos ingresados en un tipo de dato invalido")
        }

        const thumbnails = body.thumbnails || []
        body.status = body.status || true
        if (!Array.isArray(thumbnails)) return res.status(400).json("El campo thumbnails es  inválido ")

        let owner = usuario.email || "admin"
        let product = { ...body, owner }
        if (Object.values(product).includes("")) return res.redirect("/views/createProduct?error=Complete los datos,campos vacios")

        let respuesta = await ServiceProduct.addProduct(product);
        if (!respuesta) res.status(400).json('No se pudo crear su producto')
        else {

            req.logger.info(`El producto ${body.title} ha sido creado correctamente`)
            io.emit("newProduct", respuesta)
           return res.status(200).json(`El producto ${body.title} ha sido creado correctamente`)
        }

    }
    static async updateProduct(req, res) {

        let modify = req.body
        let { id } = req.params

        let respuesta = await ServiceProduct.serviceUpdate(id, modify)

        if (!respuesta) res.status(400).json("No se ha podido actualizar el producto ,verifique el id o intente mas tarde")
        else {

            res.status(200).json("Actualizado con exito")

        }

    }
    static async deleteProduct(req, res) {

        let { id } = req.params
        let respuesta = await ServiceProduct.serviceDelete(id)

        if (!respuesta) return res.status(400).json("Error al eliminar, vuelva intentar")
        else {

            res.status(200).json(`El producto con id ${id} ha sido eliminado`)
            io.emit("delete", id)

        }

    }
}

