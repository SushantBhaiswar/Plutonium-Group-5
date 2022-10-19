const mongoose = require('mongoose')


/** 
 * @param {string} value: bodyData validation function.
 */

const isValid = (value) => {
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value == "string" && value.trim().length > 0) return true;
};

const isValidBool = (value) => {
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value == "boolean") return true;
};

const isValids = (value) => {
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value == "number") return true;
};

const isValidRequestBody = function (object) {
    return Object.keys(object).length > 0;
};

// All input data validation

/**
 * @param {string} value: bodyData
 */

const isValidRequest = (value) => {
    // if body empty
    if (!isValidRequestBody(value)) {
        return "data is required";
    }
}


/**
 * @param {string} value: nameValue
 */

const isValidName = (value) => {

    if (!isValid(value)) {
        return `Data is required`;
    }

    let regex = /^[a-zA-Z]*$/

    if (!regex.test(value)) {
        return `${value} should be in valid format`;
    }
}

/**
 * @param {string} value: emailValue
 */


const isValidEmail = (value) => {
    if (!isValid(value)) {
        return "email is required and should be a string";
    }
    const regexForEmail = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    if (!regexForEmail.test(value)) {
        return `${value} should be in valid format`;
    }
}


/**
 * @param {string} value: phoneValue
 */


const isValidPhone = (value) => {
    const regexForMobile = /^((0091)|(\+91)|0?)[6789]{1}\d{9}$/;
    if (!regexForMobile.test(value)) {
        return "mobile should be of 10 digits.";
    }

}


/**
 * @param {string} value: files
 */

const isValidFile = (value) => {

    if (value.length == 0) {
        return "No file found";
    }

    const isNonWhiteSpace = /^\S*$/;
    if (!isNonWhiteSpace.test(value[0].originalname)) {
        return "file must not contain Whitespaces.";
    }

    let regex = /^.*\.(jpg|JPG|gif|GIF|png|jpeg)$/
    if (!regex.test(value[0].originalname)) {
        return "Invalid file extension.";
    }

}



/**
 * @param {string} value: passwordValue
 */

const isValidpass = (value) => {
    if (!isValid(value)) {
        return "password is required.";
    }

    const isNonWhiteSpace = /^\S*$/;
    if (!isNonWhiteSpace.test(value)) {
        return "Password must not contain Whitespaces.";
    }

    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    if (!isContainsUppercase.test(value)) {
        return "Password must have at least one Uppercase Character.";
    }

    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    if (!isContainsLowercase.test(value)) {
        return "Password must have at least one Lowercase Character.";
    }

    const isContainsNumber = /^(?=.*[0-9]).*$/;
    if (!isContainsNumber.test(value)) {
        return "Password must contain at least one Digit.";
    }

    const isContainsSymbol =
        /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
    if (!isContainsSymbol.test(value)) {
        return "Password must contain at least one Special Symbol.";
    }

    const isValidLength = /^.{8,15}$/;
    if (!isValidLength.test(value)) {
        return "Password must be 8-15 Characters Long.";
    }
}

/**
 * @param {string} value: addressData
 */

const addressData = (value) => {
    if (!isValidRequestBody(value)) {
        return "shipping and billing address data is required.";
    }

    if (typeof value.street != "string") {
        return "street is  string";
    }

    if (!/^[a-zA-Z0-9,. ]*$/.test(value.street)) {
        return "Invalid street name.";
    }

    if (!isValid(value.city)) {
        return "city is required and should be a string";
    }

    if (!/^[a-zA-Z0-9,. ]*$/.test(value.city)) {
        return "city should be a letter.";
    }
    if (!value.pincode) {
        return "pincode is required and should be a string";
    }

    if (! /^[1-9][0-9]{5}$/.test(value.pincode)) {
        return "invalid pin"
    }
}



/**
 * @param {string} value: addressValue
 */


const isValidAddress = (value) => {

    if (!isValidRequestBody(value)) {
        return "address data is required to create a new user";
    }

    let msgShipping = addressData(value.shipping);
    if (msgShipping) {
        return msgShipping;
    }

    let msgBilling = addressData(value.billing);
    if (msgBilling) {
        return msgBilling;
    }

}

//Update user address

/**
 * @param {string} value: addressData
 */

const addressDatas = (value) => {
    if (!isValidRequestBody(value)) {
        return "shipping and billing address data is required.";
    }

    if (value.street) {
        if (typeof value.street != "string") {
            return "street is  string";
        }

        if (!/^[a-zA-Z0-9,. ]*$/.test(value.street)) {
            return "Invalid street name.";
        }
    }

    if (value.city) {
        if (!isValid(value.city)) {
            return "city is required and should be a string";
        }

        if (!/^[a-zA-Z0-9,. ]*$/.test(value.city)) {
            return "city should be a letter.";
        }
    }

    if (value.pincode) {
        if (!value.pincode) {
            return "pincode is required and should be a string";
        }
        if (! /^[1-9][0-9]{5}$/.test(value.pincode)) {
            return "invalid pin"
        }
    }

}



/**
 * @param {string} value: addressValue
 */


const isValidAdd = (value) => {

    if (!isValidRequestBody(value)) {
        return "address data is required to create a new user";
    }

    if (value.shipping) {
        let msgShipping = addressDatas(value.shipping);
        if (msgShipping) {
            return msgShipping;
        }
    }

    if (value.billing) {
        let msgBilling = addressDatas(value.billing);
        if (msgBilling) {
            return msgBilling;
        }
    }


}

// product input data validation.


/**
 * @param {string} value: nameValue
 */

const isValidData = (value) => {

    if (!isValid(value)) {
        return `Data  is required`;
    }

    let regex = /^[a-zA-Z0-9,. ]*$/

    if (!regex.test(value)) {
        return `${value} should be in valid format`;
    }
}
const isValidTitle = (value) => {

    if (!isValid(value)) {
        return `Title  is required`;
    }

    let regex = /^[a-zA-Z0-9,. ]*$/

    if (!regex.test(value)) {
        return `${value} should be in valid format`;
    }
}



/**
 * @param {string} value: Valid Rating
 */

const isValidPrice = (value) => {
    if (!isValids(value)) {
        return "Price is required and should be a number";
    }

    // if(0 < value){
    //     return "Price must be geter than 0"
    // }
}

/**
 * @param {string} value: Valid Currency Id
 */

const isValidCurrencyId = (value) => {
    if (!isValid(value)) {
        return `Currency Id  is required.`;
    }
    const currencyId = ["INR"];

    if (!currencyId.includes(value)) {
        return "Invalid currency Id."
    }
}


/**
 * @param {string} value: Valid Currency Format
 */

const isValidCurrencyFormat = (value) => {
    if (!isValid(value)) {
        return `Currency Format is required.`;
    }

    const currencyFormat = ["₹", "$", "€", "£"];

    if (!currencyFormat.includes(value)) {
        return "Invalid currency Format."
    }
}


/**
 * @param {string} value:  Valid Free Shipping
 */

const isValidFreeShipping = (value) => {
    if (!isValidBool(value)) {
        return `Invalid input data.`;
    }
}


/**
 * @param {string} value: Valid Currency Id
 */

const isValidstyle = (value) => {
    if (!isValid(value)) {
        return `Data is required`;
    }

    let regex = /^[a-zA-Z ]*$/

    if (!regex.test(value)) {
        return `${value} should be in valid format`;
    }
}



/**
 * @param {string} value: Valid Currency Id
 */


const isValidavailableSizes = (value) => { //["S", "XS","M","X", "L","XXL", "XL"]
    if (!value) {
        return "please enter any value"
    }
    if (!Array.isArray(value)) {
        return "please enter array type of data"
    }
    if (value.length > 0) {
        let arr = ["S", "XS", "M", "X", "L", "XXL", "XL"];
        for (let i = 0; i < value.length; i++) {
            let inc = arr.includes(value[i])
            if (inc === false) {
                return `${value[i]} ...is invalid Sizes.`
            }
        }
        // if (str) {
        //     return `${str} ...is invalid Sizes.`
        // }
    }
}


/**
 * @param {string} value: Valid installments
 */

const isValidinstallments = (value) => {
    if (!isValids(value)) {
        return "Installments should be a number";
    }
}



const isValidStatus = (value)=>{
    if (!isValid(value)) {
        return `Data is required`;
    }

    let arr = ["pending", "completed", "cancled"]
    let inc = arr.includes(value)
    if(!inc){
        return `${value} ...is invalide status.`
    }
}






module.exports = {
    isValidRequest, isValidName, isValidEmail, isValidFile, isValidPhone, isValidpass, isValidAddress, isValidAdd,
    isValidData, isValidPrice, isValidCurrencyId, isValidCurrencyFormat, isValidFreeShipping, isValidstyle, isValidavailableSizes,
    isValidinstallments, isValidStatus,isValidTitle
}