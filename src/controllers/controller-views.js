
import { ServiceViews } from '../service/service.views.js'
import jwt from 'jsonwebtoken'
import { sendEmail } from '../utils/mails.js'
import { createHash, verificar } from '../utils.js'
import { config } from '../config/config.js'


export class views {

    static async getViewsProduct(req, res) {
        let { usuario } = req.session
        let products = await ServiceViews.getService()
        let acceso

        if (!usuario) {

            return res.redirect("/views/login?error=Debe loguearse para tener acceso.")
        }

        if (usuario) {

            if (usuario.rol == "user") {
                acceso = true
            } else {
                acceso = false
            }


        }
        let admin = false
        if (usuario.rol == "admin") {

            admin = true
        }
        res.setHeader('content-type', 'text/html')
        res.status(200).render("home", { titulo: "home page", products, usuario, acceso, admin })

    }
    static async realtimeproducts(req, res) {

        let products = ServiceViews.getService
        res.status(200).render('websocket', { products, titulo: "Web socket" })

    }
    static async productsV(req, res) {

        try {

            let { usuario } = req.session
            let { limit = 10, sort = {}, page = 1 } = req.query
            let sortValue = {}
            let { category } = req.query

            if (!usuario) {

                return res.redirect("/views/login?error=Debe loguearse para tener acceso.")
            }

            if (sort === "asc") {
                sortValue = { price: 1 };
            }
            else if (sort === "desc") {
                sortValue = { price: -1 }
            }

            if (category == undefined || null) {
                category = {}
            }
            else {

                category = { category: category }
            }


            let acceso
            if (usuario.rol == "user") {
                acceso = true
            } else {
                acceso = false
            }
            let admin = false
            if (usuario.rol == "admin" || usuario.rol == "premium") {

                admin = true
            }
            let products = await ServiceViews.servicePaginate(category, limit, page, sortValue)
            let { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } = products
            let onlyPruducts = products.docs
            let ruta = true
            res.status(200).render('product', { data: onlyPruducts, ruta, usuario, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage, limit, acceso, admin })

        } catch (error) {

            res.status(400).json("Error, no se pudo renderizar la pagina")

        }

    }
    static async getCart(req, res) {

        try {
            let { usuario } = req.session
            let cartId = req.session.usuario.cart
            let cart = await ServiceViews.servicePopulate(cartId, 'productCarts.productId')
            let ruta = true

            if (cartId == null || cartId == undefined) {

                cartId = 'El carrito esta vacio'
            }
            res.status(200).render('cart', { products: cart.productCarts, cart: cartId, ruta, usuario })
        } catch (error) {

            return console.log(error.message)

        }

    }


    static async registro(req, res) {

        let { error } = req.query

        res.setHeader('content-type', 'text/html')
        res.status(200).render('registro', { error })
    }
    static async perfil(req, res) {

        let { usuario } = req.session
        let acceso
        if (usuario.rol == "user") {
            acceso = true
        } else {
            acceso = false
        }
        let admin = false
        if (usuario.rol == "admin") {

            admin = true
        }
        res.setHeader('content-type', 'text/html')
        res.status(200).render('perfil', { usuario, acceso, admin })

    }
    static async login(req, res) {

        let { mensaje } = req.query
        let { error } = req.query

        res.setHeader('content-type', 'text/html')
        res.status(200).render('login', { mensaje, error })

    }
    static async addProd(req, res) {

        let { error, mensaje } = req.query
        let { usuario } = req.session
        if (error) {
            req.logger.info(error.message)
        }
        let admin = false
        if (usuario.rol == "admin") {

            admin = true
        }
        res.setHeader('content-type', 'text/html')
        res.status(200).render('addProduct', { error, usuario, mensaje, admin })

    }


    static async recupero(req, res) {
        let { error } = req.query
        res.status(200).render("recupero", { error: error })
    }
    static async recuperotk(req, res) {

        let { email } = req.body
        let user = await ServiceViews.filterUser(email)

        if (user) {

            if (user.password == undefined) {

                res.setHeader('Content-Type', 'application/json')

                return res.redirect("/views/recupero?error=El email ingresado es invalido para esta accion!")
            }

            delete user.password
            let tk = jwt.sign({ ...user }, config.tkSecret, { expiresIn: "1h" })

            let message = `Has solicitado restablecer tu contraseña, ingresa a el link <a href="http://localhost:8080/views/change?tk=${tk}">restablecer contraseña</a> para poder realizar la operacion.`

            let ask = await sendEmail(email, "Restablecer contraseña", message)

            if (ask.accepted.length > 0) {

                res.redirect("/views/login?mensaje=Se enviara un mail a su correo para restablecer su contraseña")
            }

        } else {

            res.redirect("/views/login?error= No se ha podido realizar el restablecimiento de su contraseña, verifique email o intente mas tarde")
        }
    }
    static async change(req, res) {

        let { tk, error, mensaje } = req.query

        try {

            let dateTk = jwt.verify(tk, config.tkSecret)
            res.render("reseteo", { tk: tk, error: error })

        } catch (error) {

            res.redirect("/views/login?error=Credenciales expiradas o invalidas")

        }
    }
    static async updatepass(req, res) {

        let { password, password2, token } = req.body

        let datos = jwt.verify(token, config.tkSecret)
        let user = await ServiceViews.filterUser(datos.email)

        if (password != password2) {

            let mensaje = "Las contraseñas no concuerdan , coloque contraseñas igual"
            return res.redirect(`/views/change?error=${mensaje}&tk=${token}`)

        }

        if (verificar(user, password)) {

            let mError = "Password ya utilizado en el pasado, elija uno nuevo"
            return res.redirect(`/views/change?error=${mError}&tk=${token}`)

        }

        password = createHash(password)
        let newPass = { ...user, password }

        try {
            await ServiceViews.passUpdate(newPass)
            res.redirect("/views/login?mensaje=Tu password fue restablecida con exito")
        } catch (error) {
            res.redirect("/views/login?error= Error inesperado, intente mas tarde")
        }
    }



    static async documentForm(req, res) {

        let { user } = req.session.passport
        let { usuario } = req.session
        let { mensaje } = req.query
        let url = `/api/users/${user}/documents`
        return res.status(200).render('documentsUploads', { usuario: usuario, user: user, mensaje: mensaje })
    }
    static async chat(req, res) {
        let { usuario } = req.session
        let { rol } = req.session.usuario
        let acceso
        if (rol == "user") {
            acceso = true
        } else {
            acceso = false
        }

        console.log(acceso)
        res.status(200).render('chat', { acceso, usuario })

    }
} 
