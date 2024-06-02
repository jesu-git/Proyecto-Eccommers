import mongoose from 'mongoose'


const collectionCarts = 'carts'
const schemaCarts = new mongoose.Schema({


    productCarts: {
        type: [{
            productId: {type: mongoose.Schema.Types.ObjectId,
            ref:'productos'},
            quantity: { type: Number }
        }]
    }
}, {
    timestamps: true
})

export const CartModelo = mongoose.model(collectionCarts, schemaCarts)