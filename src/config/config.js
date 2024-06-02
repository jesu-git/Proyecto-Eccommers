import Dotenv from 'dotenv'

Dotenv.config({

     override: true,
     path: './src/.env'
 })

export let config = {

    NPORT: process.env.port_n||8080,
    mongo_URL: process.env.mongo_URL,
    dbName: process.env.dbName,
    passClient: process.env.passClient,
    secret: process.env.secret,
    MODE: process.env.mode,
    clientID: process.env.cID,
    call: process.env.callbackUrl,
    userEmail: process.env.userEmail,
    emailPass: process.env.emailPass,
    tkSecret: process.env.tkSecret
}
