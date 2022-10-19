const { isValideUser, isValidLoginData, isValideUpdateData, testAddress } = require('../DataValidation/dataValidation');
const isValidUserData = require('../DataValidation/dataValidationModules');
const userModel = require("../Models/UserModel");
const { uploadFile } = require("../Sdb_connection/aws");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
require('dotenv').config();


//===============================> (User data create by post api) <===========================================//

const userCreate = async (req, res) => {
    try {
        // using destructuring of body data.
        let data = req.body
        const files = req.files;

        //Input data validation
        let msgUserData = isValideUser(data, files)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }
        // using destructuring of body data.
        const { fname, lname, email, phone, password, address } = data;

        const isEmailUnique = await userModel.findOne({ email });
        if (isEmailUnique) {
            return res.status(400).send({ status: false, message: `email: ${email} already exist` });
        }

        const isPhoneUnique = await userModel.findOne({ phone });
        if (isPhoneUnique) {
            return res.status(400).send({ status: false, message: `mobile number: ${phone} already exist` });
        }
        // Files data to url convert
        let uploadedFileURL = await uploadFile(files[0])

        //password bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password, salt);

        //Create User data after format =>fname, lname, email,profileImage, phone, password, address
        const UserData = {
            fname: fname, lname: lname, email: email,
            profileImage: uploadedFileURL, phone: phone,
            password: hashpassword, address: address,
        };

        const createUser = await userModel.create(UserData);
        return res.status(201).send({ status: true, message: "User created successfully", data: createUser })


    } catch (error) {
        return res.status(500).send({ status: 500, message: error.message })
    }
}



//===============================> (User data login by post api) <===========================================//

const userLogin = async (req, res) => {
    try {
        // using destructuring of body data.
        const data = req.body
        const { email, password } = data;

        //Input data validation
        let msgUserData = isValidLoginData(data)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        const isEmailUnique = await userModel.findOne({ email });
        if (!isEmailUnique) {
            return res.status(400).send({ status: false, message: "invalid login credentials" });
        }

        //Input data verify
        let Password = await bcrypt.compare(password, isEmailUnique.password)
        if (!Password) {
            return res.status(400).send({ status: false, message: "invalid login credentials" });
        }

        // creating JWT
        const token = jwt.sign({ userId: isEmailUnique._id }, process.env.secretKey, { expiresIn: "1h" });

        //Format of data.
        let Data = {
            userId: isEmailUnique._id,
            token: token
        }
        return res.status(200).send({ status: true, message: "login successfully", data: Data });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


//===============================> (User data Get by get api) <===========================================//

const getUserData = async (req, res) => {
    try {
        //Data come from 
        let UserId = req.user
        let data = await userModel.findById(UserId)

        return res.status(200).send({ status: true, message: "User profile details", data: data });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



//===============================> (User data Update by put api) <===========================================//

const updateUserData = async (req, res) => {
    try {
        let userId = req.params.userId;
        let Data = await userModel.findById(userId).select({ address: 1, _id: 0 })

        // using destructuring of body data.
        let data = req.body
        const { fname, lname, email, phone, password, address } = data;
        const files = req.files;

        //Input data validation
        let msgUserData = isValideUpdateData(data, Data, files)
        if (msgUserData) {
            return res.status(400).send({ status: false, message: msgUserData })
        }

        //address format change
        if (address) {
            const { address } = data;
            let add = testAddress(address, Data)
            data.address = add.address
        }


        if (password) {
            let msgPassData = isValidUserData.isValidpass(password)
            if (msgPassData) {
                return res.status(400).send({ status: false, message: msgPassData })
            }
            //password bcrypt
            const salt = await bcrypt.genSalt(10);
            const hashpassword = await bcrypt.hash(password, salt);
            if (Data.password === hashpassword) {
                return res.status(400).send({ status: false, message: `This password already exist!!.. please enter another one` });
            }
        }

        if (files.length > 0) {
            let msgFileData = isValidUserData.isValidFile(files)
            if (msgFileData) {
                return res.status(400).send({ status: false, message: msgFileData })
            }
            // Files data to url convert
            let uploadedFileURL = await uploadFile(files[0])
            data.profileImage = uploadedFileURL;
        }

        let update = await userModel.findOneAndUpdate({ _id: userId }, data, { new: true })
        return res.status(200).send({ status: true, message: "User profile updated", data: update });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports = { userCreate, userLogin, updateUserData, getUserData }