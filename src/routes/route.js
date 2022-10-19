const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userControllers')
const productController = require('../Controllers/productControllers')
const cartController = require('../Controllers/cartControllers')
const orderController = require('../Controllers/OrderController')
const Auth = require('../middlewares/auth')


//--------------------------> (This is test api ) <-------------------------------------//

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})


//================================>   ( All user api)   <==========================================//

//When user create call this api.

router.post("/register", userController.userCreate)

//When user login call this api.

router.post("/login", userController.userLogin)

//When get api call.

router.get("/user/:userId/profile", Auth.authentication, Auth.authorization ,userController.getUserData)

//When user update call this api.

router.put("/user/:userId/profile" , Auth.authentication, Auth.authorization, userController.updateUserData)



//================================>   ( All PRODUCT api)   <==========================================//

//When PRODUCT create call this api.

router.post("/products" ,  productController.createProduct)

//When user login call this api.

router.get("/products", productController.getProductData)

//When get api call.

router.get("/products/:productId" ,productController.getProductById)

//When user update call this api.

router.put("/products/:productId" ,  productController.updateProductById)

//When user update call this api.

router.delete("/products/:productId" ,  productController.deleteProduct)


//================================>   ( All Cart api)   <==========================================//

//When PRODUCT create call this api.

router.post("/users/:userId/cart" , Auth.authentication, Auth.authorization, cartController.AddtoCart)

//When user login call this api.

router.get("/users/:userId/cart",Auth.authentication, Auth.authorization, cartController.getCartData)

//When user update call this api.

router.put("/users/:userId/cart" , Auth.authentication, Auth.authorization, cartController.updateCartData)

//When user update call this api.

router.delete("/users/:userId/cart" , Auth.authentication, Auth.authorization, cartController.deleteCartData)


//================================>   ( All order api)   <==========================================//

//When order create call this api.

router.post("/users/:userId/orders" , Auth.authentication, Auth.authorization, orderController.createOrder)

//When user order update call this api.

router.put("/users/:userId/orders",Auth.authentication, Auth.authorization, orderController.updateOrder)

//When user order get call this api.

router.get("/users/:userId/orders",Auth.authentication, Auth.authorization, orderController.getAllOrder)



//IS invalid api call

router.all("/**",  (req, res) => {
    return res.status(400).send({ status: false, msg: "Invalid api." })
});



module.exports = router;
