const mongoose = require("mongoose");
const { createHmac, randomBytes } = require('crypto');
const { createToken } = require("../utility/authentication");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
    },
    profileImage: {
        type: String,
        default: '/images/avatar.png'
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    }
}, { timestamps: true });

userSchema.statics.matchPassGeneToken = async function (email, password) {
    const user = await this.findOne({ email });
    
    if (!user) {
        throw new Error('User not found');
    }
    
    const userProvidedHash = createHmac('sha256', user.salt)
        .update(password)
        .digest('hex');

    if (user.password !== userProvidedHash) {
        throw new Error('Incorrect password');
    }

    const token = createToken(user);
    return token;
};


userSchema.pre('save', function(next) {
    const user = this;

    if (!user.isModified("password")) {
        return next();
    }

    const salt = randomBytes(16).toString('hex');
    const hashedPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");
    user.salt = salt;
    user.password = hashedPassword;
    
    next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
