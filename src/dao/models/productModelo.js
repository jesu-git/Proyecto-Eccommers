import mongoose from 'mongoose'
import paginate from 'mongoose-paginate-v2'

export const productSchema = new mongoose.Schema({

    title: { type: String, required: true },

    description: { type: String, required: true },

    code: { type: String, required: true, unique: true },

    price: { type: Number, required: true },

    status: { type: Boolean, required: true },

    stock: { type: Number, required: true },

    category: { type: String, required: true },

    owner: { type: String,require:true , default:"admin"},

    thumbnails: [String]

}, {

    timestamps: true

});

productSchema.plugin(paginate)
export const productModelo = mongoose.model('productos', productSchema)