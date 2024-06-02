import session from 'supertest-session'
import { describe, it } from 'mocha'
import { expect } from 'chai'
import mongoose from 'mongoose'
import { usuarioModelo } from '../src/dao/models/usuariosModel.js'



let requester = session("http://localhost:8080")
await mongoose.connect("mongodb+srv://suarezjesu90:codercoder@eccommer.u1pd7r0.mongodb.net/?retryWrites=true&w=majority", { dbName: 'Eccommers' })


describe("Tests de router sessions", async function () {

    describe("Testeo de endpoints de ruta /api/session", async function () {

        this.timeout(8000)
        before(async function () {

            let resultado = await mongoose.connection.collection("usuarios").deleteOne({ email: 'lmartinez@gmail.com' })


        })



        it("Test registro de usuario", async () => {

            let newUser = {
                first_name: 'laura',
                last_name: 'martinez',
                email: 'lmartinez@gmail.com',
                age: '35',
                password: '1234'
            }
            let consulta = await requester.post("/api/session/registro").send(newUser)

            let user = await usuarioModelo.findOne({ email: 'lmartinez@gmail.com' }).lean()


            expect(consulta.statusCode).to.be.equal(302)
            expect(user._id).exist
        })
        it("Test error registro", async () => {

            let consulta = await requester.get("/api/session/errorRegistro")

            expect(consulta.res.statusMessage).to.be.equal("Found")
            expect(consulta.status).to.be.equal(302)

        })
        it("Test error login", async () => {

            let consulta = await requester.get("/api/session/errorLogin")

            expect(consulta.res.statusMessage).to.be.equal("Found")
            expect(consulta.status).to.be.equal(302)
        })
        it("Test de login", async () => {

            let user = { "email": "suarezjesu90@gmail.com", "password": "1234" }

            let consulta = await requester.post("/api/session/login").send(user)


            expect(consulta.res.statusMessage).to.be.equal("Found")
            expect(consulta.status).to.be.equal(302)
        })
        it("Test logout", async () => {

            let user = { "email": "suarezjesu90@gmail.com", "password": "1234" }

            let logueo = await requester.post("/api/session/login").send(user)
            let consulta = await requester.get("/api/session/logout")

            expect(consulta.res.statusMessage).to.be.equal("Found")
            expect(consulta.status).to.be.equal(302)
            expect(consulta.text).to.be.equal('Found. Redirecting to /views/login')
        })
        it("Test current", async () => {

            let user = { "email": "suarezjesu90@gmail.com", "password": "1234" }
            let logueo = await requester.post("/api/session/login").send(user)

            let consulta = await requester.get("/api/session/current")


            expect(consulta._body.mostrar).exist
            expect(consulta.status).to.be.equal(200)
        })
    })




})

