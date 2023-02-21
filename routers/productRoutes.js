const express = require('express');
const productController = require('./../controllers/productController');
const authController = require('./../controllers/authController');

const router = express.Router();


//param middleware
router.param('id', (req, res, next, val) => {
    next();
})

router
    .route('/top-5-cheap')
    .get(authController.protect, productController.aliasCheapPhones, productController.getAllProducts);

router
    .route('/')
    .get(authController.protect, productController.getAllProducts)
    .post(productController.createProduct);

router
    .route('/:id')
    .get(productController.getProduct)
    .patch(productController.updateProduct)
    .delete(productController.deleteProduct);

module.exports = router;