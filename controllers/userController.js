const User = require('./../models/userModel');
const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError');
exports.getAllUsers = async (req, res, next) =>{
    try{
        //EXECUTION
        const features = new APIFeatures(User.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const users = await features.query;
        
        res.status(200).json({
            status:'success',
            results: users.length,
            data: {
                users:  users
            }
        })
    } catch(err){
        next(err);
    }
};

exports.createUser = async (req, res) =>{
    res.status(500).json({
        status:'error',
        message:"This route is not yet defined"
    })
};

exports.getUser = async(req, res, next) => {
    console.log('fetch user details')
    try{
        const userData = await User.findById(req.params.id);
        res.status(200).json({
            status:'success',
            // productListCount: userData.productList.length,
            data: {
                user:  userData
            }
        })
    } catch(err){
        next(new AppError('No User found with that ID', 404));
    }
};

exports.updateUser = async (req, res) =>{
    try{
        if(req.params.id){
            const currentUser = await User.findById(req.params.id);
            if(!currentUser) return next(new AppError('The user belonging to this id doesnot exist', 401))

            if(req.body.contractAccepted){
                currentUser.contractAccepted = true;
            }
            else if(req.body.subscriptionPackage){
                currentUser.subscriptionPackage = req.body.subscriptionPackage;
            }
            else if(req.body.paymentProcessed){
                currentUser.paymentProcessed = true;
            }
            else if(req.body.accountVerified){
                currentUser.accountVerified = true;
            }
            else if(req.body.addProductToUserAccount){
                currentUser.productList = req.body.addProductToUserAccount;
            }
            await currentUser.save({ validateBeforeSave: false });
            return res.status(200).json({
                status:'success',
                message: 'Account updated Successfully'
            })
        }
    }catch(err) {
        console.log(err)
        return res.status(401).json({
            status: 'fail',
            message: 'Account is not verified. Try again later....'
        })
    }
    next();
};

exports.deleteUser = (req, res) =>{
    res.status(500).json({
        status:'error',
        message:"This route is not yet defined"
    })
};