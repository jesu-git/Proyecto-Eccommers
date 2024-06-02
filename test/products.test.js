
import mongoose from "mongoose";
import { describe, it } from 'mocha'
import { productModelo } from "../src/dao/models/productModelo.js";
import session from 'supertest-session'
import { expect } from "chai";




const requester = session("http://localhost:8080")

await mongoose.connect("mongodb+srv://suarezjesu90:codercoder@eccommer.u1pd7r0.mongodb.net/?retryWrites=true&w=majority", { dbName: 'Eccommers' })

  

describe("Testeo de router products", async function () {

    this.timeout(7000)

    describe("Testeo ruta get api/products", async function(){

        it("La ruta limita la cantidad de productos a mostrar mediante un query y genera una paginacion ", async () => {

            let { _body } = await requester.get("/api/products?limit=5")
            let limite = _body

            expect(limite.payload.length).to.be.equal(5)
            expect(limite.totalPages).exist
        })

        it("Filtra productos por categoria ingresada", async () => {

            let categoria = "bazar"

            let consulta = await requester.get("/api/products?category=" + categoria)

            let { body } = consulta

            expect(body.payload[0].category).to.be.equal(categoria)
        })

        it("Devuelve una pagina expecifica pasada por query", async () => {

            let page = "2"

            let query = await requester.get("/api/products?page=" + page)
            let { body } = query

            expect(body.prevPage).to.be.equal(1)

        })

        it("Muestra un producto  con un id expecifico", async () => {

            let id = '65eba1f29aad2466062e33e7'

            let peticion = await requester.get('/api/products/' + id)

            expect(peticion).exist
            expect(peticion.body._id).to.be.equal(id)

        })


    })

    describe("Testeo de metodo post,put y delete de ruta api/products", async function () {

        before(async function () {

          let resultado =  await mongoose.connection.collection("productos").deleteOne({code:"56136"})

        })

        this.timeout(9000)
        
        let idProducto
   
        
        it("Creacion de un nuevo producto en base de datos", async () => {
            
            let user = { "email": "suarezjesu90@gmail.com", "password": "1234" }
            let conexion = await requester.post("/api/session/login").send(user)

            let producto = {

                "title": "Mesa",
                "description": "prueba",
                "code": "56136",
                "price": "17000",
                "stock": "1500",
                "category": "bazar",
                "thumbnails": []

            }

            let check = await requester.post("/api/products").send(producto)

            let comprobacion = await productModelo.findOne({ code: producto.code }).lean()

            idProducto = comprobacion._id

            expect(comprobacion).exist
            expect(check.statusCode).to.be.equal(302)
            expect(comprobacion.code).to.be.equal(producto.code)

        })
        it("Update(actualizacion) de datos de  productos", async () => {

            let user = { "email": "suarezjesu90@gmail.com", "password": "1234" }
            let conexion= await requester.post("/api/session/login").send(user)


            let modify = { "price": 20000 }
            let chequeo = await requester.put("/api/products/" + idProducto).send(modify)
            let checkDb = await productModelo.findOne({ _id: idProducto }).lean()


            expect(chequeo.body).includes("Actualizado con exito")
            expect(chequeo).ok
            expect(checkDb.price).to.be.equal(20000)
        })
        it("Eliminacion  de  productos", async () => {

            let user = { "email": "suarezjesu90@gmail.com", "password": "1234" }
            let conexion = await requester.post("/api/session/login").send(user)


            let chequeo = await requester.delete("/api/products/" + idProducto)
            let checkDb = await productModelo.findOne({ _id: idProducto }).lean()


            expect(chequeo.body).includes(`El producto con id ${idProducto} ha sido eliminado`)
            expect(chequeo).ok
            
        })


    })


})

