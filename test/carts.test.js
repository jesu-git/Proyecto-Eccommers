import mongoose from "mongoose";
import session from 'supertest-session'
import { expect } from "chai";
import { describe, it } from "mocha";


let requester = session("http://localhost:8080")
await mongoose.connect("mongodb+srv://suarezjesu90:codercoder@eccommer.u1pd7r0.mongodb.net/?retryWrites=true&w=majority", { dbName: 'Eccommers' })



describe("Tests de modulo de  ruta /api/carts", function () {

    describe("Test de rutas get  ", async function () {

        this.timeout(8000)

        let cart
        let product = '65eba1f29aad2466062e33e7'

        it("Crea un nuevo carrito", async () => {


            let consulta = await requester.post("/api/carts")
            cart = consulta.body

            expect(consulta).ok
            expect(consulta.status).to.be.equal(200)
            expect(consulta.body).exist

        })
        it("Devuelve mediante un id el carrito correspondiente", async () => {

            let carrito = await requester.get("/api/carts/65a853dbc7212ae1028c0582")
            
            expect(carrito).ok
            expect(carrito.body._id).exist

        })
        it("Agregar productos a el carrito indicado", async () => {
            let user = { "email": "suarezjesu90@gmail.com", "password": "1234" }
            let conexion = await requester.post("/api/session/login").send(user)

            let addProduct = await requester.post("/api/carts/" + '65a853dbc7212ae1028c0582' + "/product/" + product)
            

            expect(addProduct._body).to.be.equal('Tu producto ha sido agregado con exito')
            expect(addProduct).ok
            expect(addProduct.status).to.be.equal(200)
        })
        it("Eliminar producto correcto del carrito indicado", async () => {

            let addProduct = await requester.delete("/api/carts/" + '65a853dbc7212ae1028c0582' + "/product/" + product)
            

            expect(addProduct._body).to.be.equal("Producto eliminado con exito")
            expect(addProduct).ok
            expect(addProduct.status).to.be.equal(200)

        })
        it("Actualizar carrito por un array de productos nuevos", async () => {
            let cartNew =[{

                "productId": "65ee3b52d39c703eb13cf8c0",
                "quantity": 4
                
                },
                {
                
                "productId": "65eba1f29aad2466062e33e7",
                "quantity": 5
                
                }]

            let updateArray = await requester.put("/api/carts/" + '65a853dbc7212ae1028c0582').send(cartNew)
        
            expect(updateArray._body).to.be.equal("Se ha actualizado su carrito")
            expect(updateArray).ok
            expect(updateArray.status).to.be.equal(200)
        })
        it("Actualizar la cantidad de un producto por un numero pasado", async () => {
            let cantidad = "20"
            let newQuality = await requester.put("/api/carts/" + '65a853dbc7212ae1028c0582'+"/product/65ee3b52d39c703eb13cf8c0").send(cantidad)
              
            expect(newQuality._body).to.be.equal("Se ha colocado la cantidad ingresada")
            expect(newQuality).ok
            expect(newQuality.status).to.be.equal(200)
        })
        it("Venta de carrito", async () => {

            let user = { "email": "suarezjesu90@gmail.com", "password": "1234" }
            let conexion = await requester.post("/api/session/login").send(user)

            let purchase = await requester.post("/api/carts/" + '65a853dbc7212ae1028c0582' + "/purchase")
            

            expect(purchase._body).to.be.equal('exito')
            expect(purchase).ok
            expect(purchase.status).to.be.equal(200)
        })
        it("Vaciar el carrito indicado", async () => {

            let empy = await requester.delete("/api/carts/" + '65a853dbc7212ae1028c0582')
            

            expect(empy._body).to.be.equal("Se a vaciado su carrito")
            expect(empy).ok
            expect(empy.status).to.be.equal(200)

        })
        



        


        // after(async()=>{

        //     let borrar = await mongoose.connection.collection("carts").deleteOne({_id : cart })

        // })
    })




})
