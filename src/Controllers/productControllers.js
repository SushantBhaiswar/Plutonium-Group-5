const isValidUserData = require('../DataValidation/dataValidationModules');
const { createProducts, updateProduct,getProduct, testProduct } = require("../DataValidation/dataValidation")
const productModel = require("../Models/productModel");
const mongoose = require('mongoose')
const { uploadFile } = require("../Sdb_connection/aws");
require('dotenv').config();



//===============================> (Product data create by post api) <===========================================//

const createProduct = async (req, res) => {
    try {
        // using destructuring of body data.  
        let data = req.body
        const files = req.files;

        //Input data validation
        let msgUserData = createProducts(data, files)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }
        
        const { title, description, price, currencyId, currencyFormat,
            isFreeShipping, style, availableSizes, installments } = data;

        const isTitleUnique = await productModel.findOne({ title });
        if (isTitleUnique) {
            return res.status(400).send({ status: false, message: `title: ${title} already exist` });
        }

        // Files data to url convert
        let uploadedFileURL = await uploadFile(files[0])

        //Create User data after format 
        const ProductData = {
            title: title, description: description, price: price,
            currencyId: currencyId, currencyFormat: currencyFormat,
            isFreeShipping: isFreeShipping, productImage: uploadedFileURL, style: style,
            availableSizes: availableSizes, installments: installments
        };

        const createProduct = await productModel.create(ProductData);
        return res.status(201).send({ status: true, message: "Product created successfully", data: createProduct })


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



//===============================> (Product data get by get api) <===========================================//

const getProductData = async (req, res) => {
    try {
        let datas = req.query
        // using destructuring of body data.  
        const { priceLessThan,priceGreaterThan, availableSizes} = datas
        let FindData = {}
        let Price = {}
        
        let data = testProduct(datas, FindData)
        let msgUserData = getProduct(data)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }
        // return res.send(data)
        if(availableSizes){
            FindData.availableSizes = data.availableSizes
        }

        if (priceGreaterThan) {
            datas.priceGreaterThan = parseFloat(datas.priceGreaterThan)
            Price.$gt = datas.priceGreaterThan;
            FindData.price = Price
        }

        if (priceLessThan) {
            datas.priceLessThan = parseFloat(datas.priceLessThan)
            Price.$lt = datas.priceLessThan;
            FindData.price = Price
        }
        FindData.isDeleted = false

        let Pdata = await productModel.find(FindData).sort( { "price": -1 } )
        if(Pdata.length == 0) return res.status(404).send({status:"false",message: "Product not found"})
        return res.status(200).send({ status: true, message: "products get successfully", data: Pdata })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



//===============================> (Product data get(by product id) by get api) <=============================//

const getProductById = async (req, res) => {
    try {
        let ProductId = req.params.productId

        if (!ProductId) {
            return res.status(400).send({ status: false, message: "Product Id not preasent" })
        }

        if (mongoose.Types.ObjectId.isValid(ProductId) == false) {
            return res.status(400).send({ status: false, message: "Product Id is not valid" });
        }

        let data = await productModel.findOne({ isDeleted: false, _id: ProductId })
        if (!data) {
            return res.status(404).send({ status: false, message: "Data not found." })
        }

        return res.status(200).send({ status: true, message: "product get successfully", data: data })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



//===============================> (Product data update by put api) <===========================================//

const updateProductById = async (req, res) => {
    try {
        let ProductId = req.params.productId;

        // using destructuring of body data.  
        let data = req.body
        const { title, price } = data;
        const files = req.files;
      //return res.send( data.availableSizes)
        if (!ProductId) {
            return res.status(400).send({ status: false, message: "Product Id not preasent" })
        }

        if (mongoose.Types.ObjectId.isValid(ProductId) == false) {
            return res.status(400).send({ status: false, message: "Product Id is not valid" });
        }

        let product = await productModel.findOne({ isDeleted: false, _id: ProductId })
        if (!product) {
            return res.status(404).send({ status: false, message: "Data not found." })
        }

        //Input data validation
        let FindData = {}
        let pdata = testProduct(data, FindData, product)
        if(price)  pdata.price = parseFloat(price)
       
        let msgUserData = updateProduct(pdata, product, files)
        FindData.availableSizes = pdata.availableSizes;
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        if (title) {
            const isTitleUnique = await productModel.findOne({ title: title, isDeleted: false });
            if (isTitleUnique) {
                return res.status(400).send({ status: false, message: `title: ${title} already exist` });
            }
        }

        // Files data to url convert
        if (files.length > 0) {
            let uploadedFileURL = await uploadFile(files[0])
            FindData.productImage = uploadedFileURL;
        }

       let updateData = await productModel.findOneAndUpdate({ _id: ProductId, isDeleted: false }, FindData, { new: true });
        return res.status(200).send({ status: true, message: "Product update successfully", data: updateData })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



//===============================> (Product data delete by delete api) <===========================================//

const deleteProduct = async (req, res) => {
    try {
        let ProductId = req.params.productId;

        if (!ProductId) {
            return res.status(400).send({ status: false, message: "Product Id not preasent" })
        }

        if (mongoose.Types.ObjectId.isValid(ProductId) == false) {
            return res.status(400).send({ status: false, message: "Product Id is not valid" });
        }

        let data = await productModel.findOne({ isDeleted: false, _id: ProductId })
        if (!data) {
            return res.status(404).send({ status: false, message: "Data not found." })
        }

        await productModel.findOneAndUpdate({ _id: ProductId }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
        return res.status(200).send({ status: true, message: "product deleted successfully" })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports = { createProduct, getProductData, getProductById, updateProductById, deleteProduct }