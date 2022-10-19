const isValidUserData = require('../DataValidation/dataValidationModules');
const orderModel = require("../Models/orderModel");
const mongoose = require('mongoose')
const cartModel = require('../Models/cartModel');
require('dotenv').config();



//===============================> (Cart data get by get api) <===========================================//

const createOrder = async (req, res)=>{
    try{
        let UserId = req.params.userId

        // using destructuring of body data.  
        let cartData =await cartModel.findOne({userId: UserId})
        if(!cartData){
            return res.status(400).send({status: false, message: "Your cart product's not exist."})
        }
        if(cartData.items.length == 0){
            return res.status(400).send({status: false, message: "product add in your cart."})
        }
        let Quantity = 0
        for(let i = 0; i < cartData.items.length; i++){
            let QTY = cartData.items[i].quantity
            Quantity += QTY
        }

        //Create User data after format 
        const orderData = {
            userId: UserId,
            items: cartData.items,
            totalPrice: cartData.totalPrice,
            totalItems : cartData.totalItems,
            totalQuantity: Quantity
        };
        await orderModel.create(orderData);
        await cartModel.findOneAndDelete({ userId: UserId })
        // await cartModel.findOneAndUpdate({userId: UserId}, {$set: {items: [], totalPrice: 0, totalItems: 0}},{new: true})
        let createOrder = await cartModel.findOne({ userId: UserId }).populate({path: "items.productId", model: "Product"})
        return res.status(200).send({ status: true, message: "Checkout successfully", data: createOrder })


    }catch(error){
        return res.status(500).send({status: false, message: error.message})
    }
}


//===============================> (Cart data get by get api) <===========================================//

const updateOrder = async (req, res)=>{
    try{
        let UserId = req.params.userId;
        let {status, orderId} = req.body;

        if (mongoose.Types.ObjectId.isValid(orderId) == false){
           return res.status(400).send({status: false, message:"OrderId Id is not valid"}) 
        } 
        
        let OrderData= await orderModel.findOne({_id: orderId})
        if(OrderData.userId != UserId) return res.status(404).send({status: false, message: 'Invalide order Id.'})

        let message = isValidUserData.isValidStatus(status)
        if(message){
            return res.status(400).send({status: false, message: message})
        }
        
        await orderModel.findOneAndUpdate({_id: orderId},{$set: {status: status}}, {new: true})
        let updateData = await orderModel.findOne({userId: UserId})
        return res.status(200).send({status: false, message: "Status update Successfully", data: updateData})

    }catch(error){
        return res.status(500).send({status: false, message: error.message})
    }
}



const getAllOrder = async(req, res)=>{
    try{
        let UserId = req.params.userId;
        let data = req.body;
        data.userId = UserId

        if(data.status){
            let message = isValidUserData.isValidStatus(data.status)
            if(message) return res.status(400).send({status: false, message: message})
        }

        let getData = await orderModel.find(data)
        return res.status(200).send({status: false, message: "All order get Successfully", data: getData})


    }catch(error){
        return res.status(500).send({status: false, message: error.message})
    }
}


module.exports = {createOrder, updateOrder, getAllOrder}