const { isValidCart, testCartItems } = require('../DataValidation/dataValidation')
const cartModel = require("../Models/cartModel");
const mongoose = require('mongoose')
const productModel = require('../Models/productModel');
require('dotenv').config();

//===============================> (Product data Add to cart by post api) <===========================================//

const AddtoCart = async (req, res) => {
    try {
        let UserId = req.params.userId
        // using destructuring of body data.  
        let data = req.body;

        let CartId = await cartModel.findOne({ userId: UserId })

        let message = isValidCart(data, UserId, CartId)
        if (message) {
            return res.status(400).send({ status: false, message: message })
        }
        let Products = await productModel.findOne({ isDeleted: false, _id: data.productId })
        if (!Products) {
            return res.status(404).send({ status: false, message: "Data not found." })
        }

        const { productId, cartId, quantity } = data;
        if (!CartId) {
            let Price = Products.price * quantity
            let Items = [{ productId: productId, quantity: quantity }]
            //Create User data after format 
            const CartData = {
                userId: UserId, items: Items,
                totalPrice: Price, totalItems: 1,
            };

            await cartModel.create(CartData)
            let createData = await cartModel.findOne({ userId: UserId }).populate({path: "items.productId", model: "Product"})
            return res.status(201).send({ status: true, message: "Cart created successfully", data: createData })
        }

        if (CartId) {
            let CartItems = CartId.items
            let CartData = testCartItems(CartItems, Products)
            if (!CartData) {
                return res.status(400).send({ status: false, message: "product already present in your cart." })
            }
            let Prices = CartId.totalPrice + Products.price * quantity
            let NewItems = { productId: productId, quantity: quantity }
            CartItems.push(NewItems)
            //Create User data after format 
            const CartDatas = {
                items: CartItems,
                totalPrice: Prices, totalItems: CartId.totalItems + 1,
            };
            // return res.send({data: CartDatas})
            await cartModel.findOneAndUpdate({ userId: UserId }, CartDatas, { new: true });
            let createDatas = await cartModel.findOne({ userId: UserId }).populate({path: "items.productId", model: "Product"})
            return res.status(201).send({ status: true, message: "Product add in Cart successfully", data: createDatas })
        }


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


//===============================> (Product data update by put api) <===========================================//

const updateCartData = async (req, res) => {
    try {
        let UserId = req.params.userId
        let data = req.body;
        const { removeProduct, productId, cartId } = data

        let cartData = await cartModel.findOne({ userId: UserId })
        if (!cartData) {
            return res.status(404).send({ status: false, message: "Add product in your cart" })
        }
        if (!(cartId == cartData._id)) {
            return res.status(400).send({ status: false, message: "please enter valid card Id." })
        }

        let Products = await productModel.findOne({ isDeleted: false, _id: productId })
        if (!Products) {
            return res.status(404).send({ status: false, message: "Data not found." })
        }
        
        if (removeProduct === 0) {
            let RemData = cartData.items
            //Find index of specific object using findIndex method.    
            objIndex = RemData.findIndex((obj => obj.productId.toString() === Products._id.toString()));
            if (objIndex == -1) return res.status(400).send({ status: false, message: "Product not exist in your cart" })
            let P_Data = RemData[objIndex]
            let Prices = Products.price * P_Data.quantity

            await cartModel.findOneAndUpdate({ userId: UserId }, { $pull: { 'items': P_Data }, $inc: { totalItems: -1, totalPrice: -Prices } }, { multi: true });
            let createData = await cartModel.findOne({ userId: UserId })
            return res.status(200).send({ satus: false, message: "Your cart is update successfully", data: createData })

        }

        if (removeProduct === 1) {
            let RemData = cartData.items
            //Find index of specific object using findIndex method.    
            objIndex = RemData.findIndex((obj => obj.productId.toString() === Products._id.toString()));
            if (objIndex == -1) return res.status(400).send({ status: false, message: "Product not exist in your cart" })
            let P_Data = RemData[objIndex]
            let Prices = Products.price * RemData[objIndex].quantity
            let RemData_q = RemData[objIndex].quantity - 1;

            if (RemData_q == 0) {
                await cartModel.findOneAndUpdate({ userId: UserId }, { $pull: { 'items': P_Data }, $inc: { totalItems: -1, totalPrice: -Prices } }, { multi: true });
                let createData = await cartModel.findOne({ userId: UserId })
                return res.status(200).send({ satus: false, message: "Your cart is update successfully", data: createData })

            }
            if (RemData_q > 0) {
                await cartModel.findOneAndUpdate({ userId: UserId }, { $set: { items: RemData, totalPrice: Prices } }, { multi: true });
                let createData = await cartModel.findOne({ userId: UserId })
                return res.status(200).send({ satus: false, message: "Your cart is update successfully", data: createData })
            }

        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



//===============================> (Cart data get by get api) <===========================================//

const getCartData = async (req, res) => {
    try {
        let UserId = req.params.userId

        let data = await cartModel.findOne({ userId: UserId }).populate({path: "items.productId", model: "Product"})
        if (!data) {
            return res.status(404).send({ status: false, message: "Add product in your cart" })
        }
        return res.status(200).send({ status: true, message: "Your cart summary", data: data })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



//===============================> (cART data delete by delete api) <===========================================//

const deleteCartData = async (req, res) => {
    try {
        let UserId = req.params.userId

        let data = await cartModel.findOne({ userId: UserId })
        if (!data) {
            return res.status(404).send({ status: false, message: "Add product in your cart" })
        }
        // return res.send({data: data.items.length})
        if (data.items.length > 0 && data.totalPrice > 0 && data.totalPrice < 0 && data.totalItems > 0) {
            return res.status(400).send({ status: false, message: "make sure your cart is null" })
        }

        await cartModel.findOneAndDelete({ userId: UserId })

        return res.status(204).send({ status: true, message: "Your cart is Deleted." })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports = { AddtoCart, updateCartData, getCartData, deleteCartData }