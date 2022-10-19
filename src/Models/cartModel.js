const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId


const cartSchema = new mongoose.Schema({ 
    userId: {        
        type     : ObjectId,
        required : [true, "userId must be provided"],
        ref      : "User",
        trim     : true },
    items: [{
        productId: {
            type     : ObjectId,
            required : [true, "product must be provided"],
            ref      : "Product",
            trim     : true 
        },
        quantity: {
            type: Number, 
            required : [true, "quantity must be provided"],
            min: 1
        },
        _id: false
    }],
    totalPrice: {
        type: Number, 
        required : [true,"Holds total price of all the items in the cart"],
    },
    totalItems: {
        type: Number, 
        required : [true,"Holds total number of items in the cart"],
    }
}, { timestamps: true})


module.exports = mongoose.model("Cart", cartSchema)
