const isValidUserData = require('./dataValidationModules');
const mongoose = require('mongoose');
const { find } = require('../Models/UserModel');

//User data validation

const isValideUser = (data, files) => {
    // using destructuring of body data.
    const { fname, lname, email, phone, password, address } = data;

    //Input data validation
    let msgUserData = isValidUserData.isValidRequest(data)
    if (msgUserData) return msgUserData

    let msgFnameData = isValidUserData.isValidName(fname)
    if (msgFnameData) return msgFnameData

    let msgLnameData = isValidUserData.isValidName(lname)
    if (msgLnameData) return msgLnameData

    let msgEmailData = isValidUserData.isValidEmail(email)
    if (msgEmailData) return msgEmailData

    let msgPhoneData = isValidUserData.isValidPhone(phone)
    if (msgPhoneData) return msgPhoneData

    let msgPassData = isValidUserData.isValidpass(password)
    if (msgPassData) return msgPassData

    if (!data.address) return res.status(400).send({ status: false, message: "Address is requird" })
    if (address) {
        data.address = JSON.parse(address)
        let msgAddressData = isValidUserData.isValidAddress(data.address)
        if (msgAddressData) return msgAddressData
    }

    let msgFileData = isValidUserData.isValidFile(files)
    if (msgFileData) return msgFileData
}

//User login data validation.

const isValidLoginData = (data) => {
    // using destructuring of body data.
    const { email, password } = data;

    //Input data validation
    let msgUserData = isValidUserData.isValidRequest(data)
    if (msgUserData) return msgUserData

    let msgEmailData = isValidUserData.isValidEmail(email)
    if (msgEmailData) return msgEmailData

    let msgPassData = isValidUserData.isValidpass(password)
    if (msgPassData) return msgPassData
}


//User profile update.

const isValideUpdateData = (data, Data, files) => {
    // using destructuring of body data.
    if (files) data.profileImage = "yes";
    const { fname, lname, email, phone, password, address } = data;

    //Input data validation
    let msgUserData = isValidUserData.isValidRequest(data)
    if (msgUserData) return msgUserData


    if (fname) {
        let msgFnameData = isValidUserData.isValidName(fname)
        if (msgFnameData) return msgFnameData
    }

    if (lname) {
        let msgLnameData = isValidUserData.isValidName(lname)
        if (msgLnameData) return msgLnameData
    }

    if (email) {
        let msgEmailData = isValidUserData.isValidEmail(email)
        if (msgEmailData) return msgEmailData

        if (Data.email === email) return `email: ${email} already exist`;
    }

    if (phone) {
        let msgPhoneData = isValidUserData.isValidPhone(phone)
        if (msgPhoneData) return msgPhoneData

        if (Data.phone === phone) return `mobile number: ${phone} already exist`;
    }

    if (address) {
        data.address = JSON.parse(address)
        let msgAddressData = isValidUserData.isValidAdd(data.address)
        if (msgAddressData) return msgAddressData
    }

}
//Address test
const testAddress = (address, Address) => {
    if (address.shipping) {
        if (address.shipping.street) {
            Address.address.shipping.street = address.shipping.street
        }

        if (address.shipping.city) {
            Address.address.shipping.city = address.shipping.city
        }

        if (address.shipping.pincode) {
            Address.address.shipping.pincode = address.shipping.pincode
        }
    }
    if (address.billing) {
        if (address.billing.street) {
            Address.address.billing.street = address.billing.street
        }

        if (address.billing.city) {
            Address.address.billing.city = address.billing.city
        }

        if (address.billing.pincode) {
            Address.address.billing.pincode = address.billing.pincode
        }

    }
    return Address

}


//==========================================> (Product api) <==================================================//



//Create product's

const createProducts = (data, files) => {
    // using destructuring of body data.                
    const { title, description, price, currencyId, currencyFormat,
        isFreeShipping, style, availableSizes, installments } = data;

    //Input data validation
    let msgUserData = isValidUserData.isValidRequest(data)
    if (msgUserData) return msgUserData

    let msgTitleData = isValidUserData.isValidTitle(title)
    if (msgTitleData) return msgTitleData

    let msgDesData = isValidUserData.isValidData(description)
    if (msgDesData) return msgDesData

    if (!price) {
        return "price is required"
    } else {

        if (!/^[-\\+]?\s*((\d{1,3}(,\d{3})*)|\d+)(\.\d{2})?$/.test(price)) return "price should only decimal number or number "
        data.price = parseFloat(price)
    }


    if (!currencyId) {
        data.currencyId = "INR"
    } else {
        let msgcurrencyIdData = isValidUserData.isValidCurrencyId(currencyId)
        if (msgcurrencyIdData) return msgcurrencyIdData
    }

    if (!currencyFormat) {
        data.currencyFormat = "₹"
    } else {
        let msgCurrencyFormatData = isValidUserData.isValidCurrencyFormat(currencyFormat)
        if (msgCurrencyFormatData) return msgCurrencyFormatData
    }
    if (isFreeShipping) {
        data.isFreeShipping = JSON.parse(isFreeShipping)
        let msgisFreeShippingData = isValidUserData.isValidFreeShipping(data.isFreeShipping)
        if (msgisFreeShippingData) return msgisFreeShippingData
    }
    let msgFileData = isValidUserData.isValidFile(files)
    if (msgFileData) return msgFileData

    if (style) {
        let msgstyleData = isValidUserData.isValidstyle(style)
        if (msgstyleData) return msgstyleData
    }
    if(!availableSizes) return "places enter product Sizes."
    if (availableSizes.length < 4 && availableSizes.length > 0) {
        let value = ["S", "XS", "M", "X", "L", "XXL", "XL"];
        let inct = value.includes(availableSizes)
        if (!inct) value.push(availableSizes)
        data.availableSizes = value
    }
    if (availableSizes.length > 3) {
        let sizes = availableSizes.split(",")
        let value = ["S", "XS", "M", "X", "L", "XXL", "XL"];
        for (let i = 0; i < sizes.length; i++) {
            let inct = value.includes(sizes[i])
            if (!inct) {
                value.push(sizes[i])
            }
        }
        data.availableSizes = value
        let msgavailableSizesData = isValidUserData.isValidavailableSizes(data.availableSizes)
        if (msgavailableSizesData) return msgavailableSizesData
    }
    if (installments) {
        if (!(/\b([1-9]|[1-9][0-9]|100)\b/gm).test(installments)) return "installments should be number"
        data.installments = parseInt(installments)

    }
}


//Format product data.

const testProduct = (datas, FindData, product) => {

    // using destructuring of body data.  
    const { title, description, isFreeShipping, style, removeSize,
        availableSizes, installments, currencyId, currencyFormat, price } = datas

    if (title) {
        FindData.title = title
    }
    if (description) {
        FindData.description = description
    }
    if (isFreeShipping) {
        FindData.isFreeShipping = JSON.parse(datas.isFreeShipping)
        //FindData.isFreeShipping = datas.isFreeShipping
    }
    if (style) {
        FindData.style = style
    }
    if (price) {
        if (!/^[-\\+]?\s*((\d{1,3}(,\d{3})*)|\d+)(\.\d{2})?$/.test(price)) return "price should only decimal number or number "
        FindData.price = parseFloat(price)
    }
    if (availableSizes) {
        FindData.availableSizes = availableSizes
    }
    if (installments) {
        datas.installments = parseInt(datas.installments)
        FindData.installments = datas.installments
    }
    if (currencyId) {
        FindData.currencyId = datas.currencyId
    }
    if (currencyFormat) {
        FindData.currencyFormat = datas.currencyFormat
    }
    if (removeSize) FindData.removeSize = removeSize
    return FindData
}

const getProduct = (data) => {
    // using destructuring of body data.                
    const { title, description, price, currencyId, currencyFormat,
        isFreeShipping, style, availableSizes, installments } = data;

    //Input data validation
    if (title) {
        let msgTitleData = isValidUserData.isValidData(title)
        if (msgTitleData) return msgTitleData
    }

    if (description) {
        let msgDesData = isValidUserData.isValidData(description)
        if (msgDesData) return msgDesData
    }

    if (price) {
        let msgPriceData = isValidUserData.isValidPrice(price)
        if (msgPriceData) return msgPriceData
    }

    if (currencyId) {
        let msgcurrencyIdData = isValidUserData.isValidCurrencyId(currencyId)
        if (msgcurrencyIdData) return msgcurrencyIdData
    }

    if (currencyFormat) {
        let msgCurrencyFormatData = isValidUserData.isValidCurrencyFormat(currencyFormat)
        if (msgCurrencyFormatData) return msgCurrencyFormatData
    }

    if (isFreeShipping) {
        let msgisFreeShippingData = isValidUserData.isValidFreeShipping(isFreeShipping)
        if (msgisFreeShippingData) return msgisFreeShippingData
    }

    if (style) {
        let msgstyleData = isValidUserData.isValidstyle(style)
        if (msgstyleData) return msgstyleData
    }

    if (availableSizes) {
        if (availableSizes.length < 4 && availableSizes.length > 0) {
            let sizes = [availableSizes];
            let msgavailableSizesData = isValidUserData.isValidavailableSizes(sizes)
            if (msgavailableSizesData) return msgavailableSizesData
            data.availableSizes = sizes
        }
        if (availableSizes.length > 3) {
            let sizes = availableSizes.split(",")
            let msgavailableSizesData = isValidUserData.isValidavailableSizes(sizes)
            if (msgavailableSizesData) return msgavailableSizesData
            data.availableSizes = sizes
        }
    }

    if (installments) {
        let msginstallmentsData = isValidUserData.isValidinstallments(installments)
        if (msginstallmentsData) return msginstallmentsData
    }
}


//Update product

const updateProduct = (pdata, product, files) => {
    // using destructuring of body data.
    if (files) pdata.productImage = "yes";
    const { title, description, price, currencyId, currencyFormat,
        isFreeShipping, style, availableSizes, installments, removeSize } = pdata;

    //Input data validation
    let msgUserData = isValidUserData.isValidRequest(pdata)
    if (msgUserData) return msgUserData

    if (title) {
        let msgTitleData = isValidUserData.isValidData(title)
        if (msgTitleData) return msgTitleData
    }

    if (description) {
        let msgDesData = isValidUserData.isValidData(description)
        if (msgDesData) return msgDesData
    }

    if (price) {
        let msgPriceData = isValidUserData.isValidPrice(price)
        if (msgPriceData) return msgPriceData
    }

    if (currencyId) {
        let msgcurrencyIdData = isValidUserData.isValidCurrencyId(currencyId)
        if (msgcurrencyIdData) return msgcurrencyIdData
    }

    if (currencyFormat) {
        let msgCurrencyFormatData = isValidUserData.isValidCurrencyFormat(currencyFormat)
        if (msgCurrencyFormatData) return msgCurrencyFormatData
    }

    if (isFreeShipping) {
        let msgisFreeShippingData = isValidUserData.isValidFreeShipping(isFreeShipping)
        if (msgisFreeShippingData) return msgisFreeShippingData
    }

    if (files.length > 0) {
        let msgFileData = isValidUserData.isValidFile(files)
        if (msgFileData) return msgFileData
    }

    if (style) {
        let msgstyleData = isValidUserData.isValidstyle(style)
        if (msgstyleData) return msgstyleData
    }

    // return 
    if (availableSizes) {
        if (availableSizes.length < 4 && availableSizes.length > 0) {
            let value = product.availableSizes
            let inct = value.includes(availableSizes)
            if (!inct) value.push(availableSizes)
            pdata.availableSizes = value
        }
        if (availableSizes.length > 3) {
            let sizes = availableSizes.split(",")
            let value = product.availableSizes
            for (let i = 0; i < sizes.length; i++) {
                let inct = value.includes(sizes[i])
                if (!inct) {
                    value.push(sizes[i])
                }
            }
            pdata.availableSizes = value
            let msgavailableSizesData = isValidUserData.isValidavailableSizes(pdata.availableSizes)
            if (msgavailableSizesData) return msgavailableSizesData
        }
    }

    if (removeSize) {
        if (removeSize.length < 4 && removeSize.length > 0) {
            let value = product.availableSizes
            let inct = value.includes(removeSize)
            if (inct) value = value.filter(element => element !== removeSize);
            pdata.availableSizes = value
        }
        if (removeSize.length > 3) {
            let sizes = removeSize.split(",")
            let value = product.availableSizes
            for (let i = 0; i < sizes.length; i++) {
                let inct = value.includes(sizes[i])
                if (inct) {
                    value = value.filter(element => element !== sizes[i]);
                }
            }
            pdata.availableSizes = value
            let msgavailableSizesData = isValidUserData.isValidavailableSizes(pdata.availableSizes)
            if (msgavailableSizesData) return msgavailableSizesData
        }
    }

    if (installments) {
        let msginstallmentsData = isValidUserData.isValidinstallments(installments)
        if (msginstallmentsData) return msginstallmentsData
    }
}


//Create new cart.

const isValidCart = (data, UserId, CartId) => {
    // using destructuring of body data.  
    const { userId, productId, cartId, quantity } = data;

    if (userId) {
        if (UserId != userId) return "Params and from user Id not match"
        if (mongoose.Types.ObjectId.isValid(userId) == false) return "User Id is not valid";
    }

    if (!productId) return "Product Id not preasent"
    if (mongoose.Types.ObjectId.isValid(productId) == false) return "Product Id is not valid"

    if (cartId) {
        if (CartId._id != cartId) return "Invalid cart id."
    }

    if (quantity) {
        let regex = /\b([1-9]|[1-1][0-9]|20)\b/gm
        if (!regex.test(quantity)) return "please enter valid quantity like 1 to 20."
    } else {
        data.quantity = 1;
    }


}


// Test cart items

const testCartItems = (CartItems, Products) => {
    let count = 0;
    for (let i = 0; i < CartItems.length; i++) {
        let data = CartItems[i].productId
        let pId = Products._id
        if (data.toString() === pId.toString()) {
            count++
        }
    }
    if (count > 0) {
        return false;
    } else {
        return true;
    }

}



module.exports = {
    isValideUser, isValidLoginData, isValideUpdateData, testAddress,
    createProducts, testProduct, updateProduct, isValidCart, getProduct,
    testCartItems
}