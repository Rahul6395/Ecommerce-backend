const express = require('express')
const { getAllProducts,createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReviews } = require('../controllers/productController');
const { isAuthenticatedUser,authorizedRoles } = require('../middleware/authAxis');
const router = express.Router()

router.route('/products').get(isAuthenticatedUser,getAllProducts);
router.route('/admin/product/new').post(isAuthenticatedUser,authorizedRoles('admin'),createProduct);
router.route('/admin/product/:id')
.put(isAuthenticatedUser,authorizedRoles('admin'),updateProduct)
.delete(isAuthenticatedUser,authorizedRoles('admin'),deleteProduct)

router.route('/review').put(isAuthenticatedUser,createProductReview)
router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser,deleteReviews);

router.route("/product/:id").get(getProductDetails)


module.exports = router