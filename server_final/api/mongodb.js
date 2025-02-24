const mongoose = require("mongoose");
const createConnection = async () => {
    return await mongoose.connect("mongodb://localhost:27017/carechaindb")
}

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    idNumber: { type: String, required: true },
    password: { type: String, required: true },
    birthDate: { type: Date, required: true },
    userType: { type: Number, default: 2 },   //Admin = 0 , doctor =1 ,patient =2  
    passwordHistory: { type: [String], default: [] },
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
    active: {type:Boolean,default: true},
    failedAttempts: { type: Number, default: 0 }, // מספר ניסיונות כושלים
});

const User = mongoose.model("User", userSchema);

const findOne = async (params) => {
    return User.findOne(params)
}

const findById = async (id, params) => {
    return User.findById(id, params);
}

module.exports = { createConnection, findOne, findById,User }