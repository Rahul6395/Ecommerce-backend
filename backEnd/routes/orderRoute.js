const express = require('express')
const {authorizedRoles,isAuthenticatedUser} = require("../middleware/authAxis");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const router = express.Router();


router.route("/order/new").post(isAuthenticatedUser,newOrder);
router.route("/order/:id").get(isAuthenticatedUser,getSingleOrder);
router.route("/orders/me").get(isAuthenticatedUser,myOrders);
router.route("/admin/orders").get(isAuthenticatedUser,getAllOrders);
router.route("/admin/order/:id").put(isAuthenticatedUser,updateOrderStatus).delete(isAuthenticatedUser,deleteOrder);


module.exports = router