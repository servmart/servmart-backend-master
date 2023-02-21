const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    supplierName: {
        type:String,
        required: [true, 'Supplier Name is a required field'],
        unique: true,
        trim:true// removes white spaces
    },
    supplierNumber: {
        type:Number,
        required: [true, 'Supplier Number is a required field'],
        unique: true
    },
    panNumber:{
        type:String,
        unique: true,
        required:[true, 'Pan Number is a required field']
    },
    gstin: {
        type:Number,
        unique: true,
        required: [true, 'GST number is a required field']
    },
    supplierMobileNumber: {
        type:Number,
        unique: true,
        required: [true, 'Mobile number is a required field']
    },
    supplierEmailId: {
        type:String,
        required: [true, 'EmailId is a required field'],
        unique: true
    },    
    password: {
        type:String,
        required: [true, 'Password is a required field'],
        minlength: 8,
        select:false

    },
    isAdmin: {
        type:Boolean,
        default:false
    },
    contractAccepted:{
        type:Boolean,
        default: false
    },
    subscriptionPackage:{
        type:Number,
        default:250
    },
    paymentProcessed:{
        type:Boolean,
        deafult:false
    },
    createdAt: {
        type:Date,
        default:Date.now(),
        select:false
    },
    passwordChangedAt: {
        type:Date
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpire: {
        type: String
    },
    accountVerified: {
        type:Boolean,
        default:false
    },
    productList: {
        type:Object,
        productId: String
    }
})


//TO ENCRYPT PASSWORD, 12 - cost value of CPU intensive task for encrytion on clicking save button but before
// saving to database middleware.

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    // IF password is modified
    this.password = await bcrypt.hash(this.password, 12)
    next();
})

userSchema.pre('save', async function(next) {
    if(!this.isModified('password') || this.isNew) return next();
    // IF password is modified
    this.passwordChangedAt = Date.now() - 1000;
    next();
})


//INSTANCE METHOD - AVAILABLE on all the documents in a certain collection.
userSchema.methods.correctPassword = async function(userEnteredPassword, userPasswordDB) {
    return await bcrypt.compare(userEnteredPassword,userPasswordDB)
}

// INSTANCE METHOD for verifying the changed password after JWT token created
userSchema.methods.changedPasswordAfter = async function(JWTTImestamp) {
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTImestamp < changedTimeStamp
    }

    //False means password was not changed
    return false;
}

userSchema.methods.createPasswordResetToken = async function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    // console.log({resetToken}, this.passwordResetToken);
    this.passwordResetExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;