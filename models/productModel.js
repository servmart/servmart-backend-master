const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type:String,
        required: [true, 'Product Title is a required field'],
        unique: true,
        trim:true// removes white spaces
    },
    description: {
        type:String,
        trim:true// removes white spaces
    },
    imgLink:{
        type:String,
        required:[true, 'Image is a required field']
    },
    oldPrice: {
        type:Number,
        required: [true, 'Old Price is a required field']
    },
    newPrice: {
        type:Number,
        required: [true, 'New Price is a required field']
    },
    type: {
        type:String
    },
    createdAt: {
        type:Date,
        default:Date.now(),
        select:false
    }
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;