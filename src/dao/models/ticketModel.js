import mongoose, { Schema } from "mongoose";


export const ticketModel = mongoose.model('ticket', new Schema({

    code: String,

    amount: { type: Number, unique: true },

    purchaser: String

}, {
    timestamps: true
}))