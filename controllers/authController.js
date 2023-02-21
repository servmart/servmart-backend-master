const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
const verifyEmailTemplate = require('../utils/verifyEmailTemplate');
const passwordResetTemplate = require('../utils/passwordResetEmailTemplate');
const crypto = require('crypto');
const signToken = id =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: Number(process.env.JWT_EXPIRES_IN)
    })
}

exports.signup = async (req, res) =>{
    try{
        const newUser = await User.create({
            supplierName: req.body.supplierName,
            supplierNumber: req.body.supplierNumber,
            panNumber: req.body.panNumber,
            gstin: req.body.gstin,
            supplierMobileNumber:req.body.supplierMobileNumber,
            supplierEmailId: req.body.supplierEmailId,
            password: req.body.password,
            selectType: req.body.selectType,
        });

        const token = signToken(newUser._id)

        res.status(201).json({
            status:'success',
            token,
            data: {
                user: newUser
            }
        })
        await sendEmail({
            email:req.body.supplierEmailId,
            subject:'Welcome to ServMart. Verify your account',
            message: verifyEmailTemplate({
                supplierName: req.body.supplierName, 
                verificationLink: `https://localhost:4400/accountWelcome/${token}`
            })
        })
    } catch(err) {
        console.log(err)
        res.status(404).json({
            status: 'fail',
            message: 'Something went wrong. Try again....'
        })
    }  
};

exports.login = async (req, res, next) =>{
    const {email, password} = req.body;
    try{
        //CHECK if user email and password exists in DB and are correct.
        const user = await User.findOne({supplierEmailId: email}).select('+password');

        if(!user || !await user.correctPassword(password, user.password)) {
            return next(new AppError('Incorrect Username or Password', 401))
        }

        const token = signToken(user._id);
        res.status(200).json({
            status:'success',
            token,
            userId: user._id,
            supplierName: user.supplierName,
            accountVerified:user.accountVerified,
            contractAccepted: user.contractAccepted,
            isAdmin:user.isAdmin,
            subscriptionPackage:user.subscriptionPackage,
            supplierEmailId:user.supplierEmailId,
            supplierMobileNumber:user.supplierMobileNumber,
            supplierNumber:user.supplierNumber

        })
    } catch(err) {
        res.status(404).json({
            status: 'fail',
            message: 'Something went wrong. Try again....'
        })
    }
}

exports.protect = async (req, res, next) => {
    try{
        let token = '';
        // 1. FETCH Token and check if it's there
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if(!token) {
            return next(new AppError('Unauthorized request. Try logging in...', 401))
        }
        // 2. VERIFY token
        const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // 3. CHECK if user exists
        const loggedInUser = await User.findById(decodedToken.id);
        if(!loggedInUser) return next(new AppError('The user belonging to this token doesnot exist', 401))

        //4. CHECK if password was changed 
        const isPasswordChanged = await loggedInUser.changedPasswordAfter(decodedToken.iat);
        if(isPasswordChanged) {
            return next(new AppError('The user changed the password.Try login again', 401));
        }
        req.user = loggedInUser;

    } catch(err) {
        console.log(err)
        res.status(401).json({
            status: 'fail',
            message: 'User is not authenticated. Try logging back in....'
        })
    }
    // GRANT access to protected route
    next();
}

exports.verifyUserAccount = async (req, res, next) => {
    try{
        if(req.params.token){
            const decodedToken = await promisify(jwt.verify)(req.params.token, process.env.JWT_SECRET);
            const loggedInUser = await User.findById(decodedToken.id);
            loggedInUser.accountVerified = true;
            await loggedInUser.save({ validateBeforeSave: false });
            if(!loggedInUser) return next(new AppError('The user belonging to this token doesnot exist', 401))
            return res.status(200).json({
                status:'success',
                message: 'Account Verified Successfully'
            })
        }
    }catch(err) {
        res.status(401).json({
            status: 'fail',
            message: 'Account is not verified. Try again later....'
        })
    }
    next();
}

exports.forgotPassword =  async (req, res, next) =>{
    try{
        // GET USER based on POSTed email
        const user = await User.findOne({ supplierEmailId : req.body.email});
        if(!user){
            return next(new AppError('There is no user with the email address', 404))
        }

        // GENERATE random reset token
        const resetToken = await user.createPasswordResetToken();
        console.log(resetToken);
        await user.save({ validateBeforeSave: false });

        // SEND token to user email
        try{
            await sendEmail({
                email:req.body.email,
                subject:'Forgot your password?',
                message: passwordResetTemplate({
                    supplierName: user.supplierName, 
                    passwordResetLink: `https://master.dizipkjdzcm43.amplifyapp.com/resetPassword/${resetToken}`
                })
            })

            return res.status(200).json({
                status:'success',
                message: 'Reset Link is sent to the email id!'
            })
        }catch(err) {
            console.log(err)
            user.passwordResetToken = undefined;
            user.passwordResetExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({
                status: 'fail',
                message: 'There was an error sending the email. Kindly try after some time.'
            })
            
        }
    }catch(err) {
        console.log(err)
        res.status(500).json({
            status: 'fail',
            message: 'Some internal error. Kindly try after some time.'
        })
    }
    next();
}

exports.resetPassword =  async (req, res, next) =>{
    try{
        //1. Get USER based on token recieved
        const hashedToken = crypto.createHash('sha256').update(req.body.token).digest('hex');
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpire: {$gt: Date.now()}
        });

        //2. If user is available and token has not expired
        if(!user){
            return next(new AppError('Token is invalid or expired', 400))
        }
        user.password = req.body.password
        user.passwordResetToken = undefined;
        user.passwordResetExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(200).json({
            status:'success',
            message: 'Password is reset successfully!!!'
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            status: 'fail',
            message: 'Some internal error. Kindly try after some time.'
        })
    }
    next();
}

exports.updatePassword = async(req, res, next) => {
    try{
        //1. GET USER ID
        const user = await User.findById(req.user.id).select('+password');
        //2. CHECK CURRENT PASSWORD
        if(!user || !await user.correctPassword(req.body.currentPassword, user.password)) {
            return next(new AppError('Your current password is incorrect.', 401))
        }
        //3. UPDATE PASSWORD
        user.password = req.body.newPassword;
        await user.save({ validateBeforeSave: false });
        //4. upDATE JWT
        const token = signToken(user._id);
        return res.status(200).json({
            status:'success',
            message: 'Password is updated successfully!!!',
            token
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            status: 'fail',
            message: 'Some internal error. Kindly try after some time.'
        })
    }
    next();
}
