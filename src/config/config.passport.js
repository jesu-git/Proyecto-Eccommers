import passport from "passport"
import github from 'passport-github2'
import local from 'passport-local'
import { cartsMongo } from "../dao/class/managerCartsMongo.js"
import { UsuarioManager } from "../dao/class/managerUsuario.js"
import { config } from "./config.js"
import { createHash, verificar } from "../utils.js"



export const initPassport = () => {

    passport.use('registro', new local.Strategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },

        async (req, username, password, done) => {

            let { first_name, last_name, email, age } = req.body

            if (!first_name || !last_name || !email || !age || !password) {

                return done(null, false)
            }

            let exist = await UsuarioManager.userEmailFilter(email)

            if (exist.length > 0) {


                return done(null, false, { mensaje: 'ERROR, El email ingresado ya esta en uso, ingrese uno nuevo' })
            }


            password = createHash(password)

            let rol

            if (email == 'adminCoder@coder.com') {

                rol = "admin"
            }
            let status = [{ indetificacion: false, comprobanteD: false, comprobanteC: false }]

            try {

                let newCart = await cartsMongo.createCart()
                let cart = newCart._id.valueOf()
                let usuario = await UsuarioManager.userCreate(first_name, last_name, email, age, password, cart, rol, status)
                req.logger.info(`Usuario ${usuario.email} creado correctamente`)

                return done(null, usuario)

            } catch (error) {

                return done(null, false, { mensaje: 'Error, usuario no creado' })

            }



        }
    ))
    passport.use('login', new local.Strategy(
        {
            usernameField: 'email'
        },
        async (username, password, done) => {

            if (!username || !password) {

                return done(null, false)
            }
            try {


                let usuario = await UsuarioManager.userEmailFilter(username)
                if (usuario == []) {
                    return done(null, false, { message: 'No concuerdan sus datos' })
                }
                usuario = usuario[0]
                if (!verificar(usuario, password)) {
           
                    return done(null, false, { message: 'Datos invalidos' })
                }

                let conexion = new Date()
                delete usuario.password
                usuario.last_connection = conexion
                let AddConenection = await UsuarioManager.updateUser(usuario)
                return done(null, usuario)

            } catch (error) {

                return done(error, false)
            }

        }
    ))
    passport.serializeUser((usuario, done) => {
        return done(null, usuario._id)
    })
    passport.deserializeUser(async (id, done) => {
        let usuario = await UsuarioManager.idFilter(id)
        return done(null, usuario)
    })
}
export const startPassport = () => {

    passport.use('github', new github.Strategy(
        {
            clientID: config.clientID,
            clientSecret: config.passClient,
            callbackURL: config.call

        },
        async (accesToken, refreshToken, profile, done) => {

            try {

                let usuarioBd = await UsuarioManager.userEmailFilter(profile._json.email)
                let usuario = usuarioBd[0]
                let rol = "user"
                let status = [{ indetificacion: false, comprobanteD: false, comprobanteC: false }]


                if (usuarioBd.length == 0) {

                    let newCart = await cartsMongo.createCart()
                    let cart = newCart._id.valueOf()
                    let userNew = {
                        first_name: profile._json.name,
                        email: profile._json.email,
                        age: "",
                        cart: cart,
                        rol: rol,
                        status: status,
                        profile
                    }

                    usuario = await UsuarioManager.userGitCreate(userNew)
                }
                let conexion = new Date()
                usuario.last_connection = conexion
                let AddConenection = await UsuarioManager.updateUser(usuario)
                return done(null, usuario)


            } catch (error) {

                return done(error)

            }

        }

    ))

    passport.serializeUser((usuario, done) => {

        return done(null, usuario._id)
    })
    passport.deserializeUser(async (id, done) => {
        let usuario = await UsuarioManager.idFilter(id)
        return done(null, usuario)
    })
}