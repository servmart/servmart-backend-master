const Product = require('./../models/productModel');
const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError');
exports.getAllProducts = async(req, res, next) => {
    try{
        //EXECUTION
        const features = new APIFeatures(Product.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const products = await features.query;
        
        res.status(200).json({
            status:'success',
            results: products.length,
            data: {
                products:  products
            }
        })
    } catch(err){
        next(err);
    }
};

exports.aliasCheapPhones = (req, res, next) =>{
    req.query.limit = '5';
    req.query.sort = 'newPrice'
    next();
};

exports.getProduct = async(req, res, next) => {
    try{
        const product = await Product.findById(req.params.id);
        res.status(200).json({
            status:'success',
            results: product.length,
            data: {
                products:  product
            }
        })
    } catch(err){
        next(new AppError('No Product found with that ID', 404));
    }
};

exports.createProduct = async (req, res, next) =>{
    try{
        const newProduct = await Product.create(req.body);
        res.status(201).json({
            status:'success',
            data: {
                product: newProduct
            }
        })
    } catch(err) {
        next(new AppError('Something went wrong while creating the product', 404));
    }  
};

exports.updateProduct = async(req, res, next) =>{
    try{
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // this option is set to true so that it returns updated new document and sent as response
            runValidators: true // to check the schema before updating

        })
        res.status(200).json({
            status:'success',
            data: {
                product:  updatedProduct
            }
        })
    } catch(err) {
        next(err);
    }
    
};

exports.deleteProduct = async (req, res, next) => {
    try{
        const product = await Product.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status:'success',
            data: null
        })
    } catch(err){
        next(new AppError('Something went wrong while deleting the product', 404));
    }
    
};

// exports.searchProduct = async (req, res) => {
//     try{

//     } catch(err) {
//         res.status(404).json({
//             status: 'fail',
//             message: 'Something went wrong. Try again....'
//         })
//         console.log(err)
//     }
// }