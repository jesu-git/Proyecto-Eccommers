import mongoose, { Schema } from "mongoose"


const userCollecion = new mongoose.Schema({

    first_name: 'String',

    last_name: 'String',

    email: { type: 'String', unique: true },

    age: 'Number',

    password: 'String',

    cart: 'String',

    rol: { type: 'String', default: 'user' },

    documents: [{ name: 'String', reference: 'String' }],

    status: [{ identificacion: 'Boolean', comprobanteD: 'Boolean', comprobanteC: 'Boolean' }],

    last_connection: 'String'
}, {
    timestamps: true,
    strict: false
})


export const usuarioModelo = new mongoose.model('usuario', userCollecion)