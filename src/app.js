
import express from 'express'
import { router as router_products } from './Routers/routerProducts.js'
import { router as router_cart } from './Routers/routerCart.js'
import { router as router_views } from './Routers/routerViews.js'
import { router as router_session } from './Routers/routerSessions.js'
import { router as router_users } from './Routers/routerUser.js'
import { config } from './config/config.js'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import __dirname from './utils.js'
import path from 'path'
import { messageModelo } from './dao/models/messageModelo.js'
import sessions from 'express-session'
import MongoStore from 'connect-mongo';
import { connection } from './dao/bd.js'
import { initPassport, startPassport } from './config/config.passport.js'
import passport from 'passport'
import { router as mockingRouter } from './Routers/routerMocking.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { loggerMid } from './utils/winston.js'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'


const app = express()
const PORT = config.NPORT

const options = {

    definition:{
        openapi:"3.0.0",
        info:{

            title:"API abm Usuarios",
            version:"1.0.0",
            description:"Documentacion API "
        }
    },
    apis:["./src/docs/*.yaml"]
}

const specs = swaggerJsdoc(options)
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(specs))

app.use(loggerMid)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessions({
    secret: config.secret,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({

        mongoUrl: config.mongo_URL,
        mongoOptions: { dbName: config.dbName },
        ttl: 3600
    })
}))

startPassport()
initPassport()
app.use(passport.initialize())
app.use(passport.session())

app.engine('handlebars', engine());
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, './views'))

app.use('/public', express.static(__dirname + '/public'))

app.get("/", (req, res) => {

    res.status(200).render('home')
  

})

app.use('/api/products', router_products)
app.use('/api/carts', router_cart)
app.use('/views', router_views)
app.use('/api/session', router_session)
app.use('/mokingProducts', mockingRouter)
app.use('/api/users',router_users)

app.use(errorHandler)
const server = app.listen(PORT, () => {

    console.log("Server in service")
    
})


export const io = new Server(server)

let usuarios = []

io.on("connection", socket => {
    console.log(`Se ha conectado ${socket.id}`)

    socket.on("nombre", async (nombre) => {
        usuarios.push({ nombre, id: socket.id })
        socket.broadcast.emit("nuevoConectado", nombre)
        socket.emit("comienzo", await messageModelo.find().lean())
    })
    socket.on("mensaje", async (datos) => {
        await messageModelo.create({ 'nombre': datos.emisor, 'mensaje': datos.mensaje })

        io.emit("nuevoMensaje", datos)
    })
    socket.on("disconnect", () => {

        let name = usuarios.find(x => x.id === socket.id)
        if (name) {
            io.emit("desconectado", name.nombre)

        }
    })

})  

  await connection(config.mongo_URL, config.dbName )



