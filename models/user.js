import { createHmac, randomBytes } from 'crypto';
import { Schema, model } from 'mongoose';
import { createTokenForUser } from '../services/authentication.js';


const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: "/images/default.jpg",
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    }

}, { timestamps: true });


//for hashing the password whenever we are trying to save a user
userSchema.pre("save", function(next) {
    const user = this;

    if (!user.isModified("password")) return;

    //here we are creating a salt means a string with random characters
    const salt = randomBytes(16).toString();
    // first is hashing algo and second is secret key
    const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");

    this.password = hashedPassword;
    this.salt = salt;

    next();

})

//here we are creating a virtual function to match sign in password and
//signup password
userSchema.static("matchPasswordAndGenerateToken", async function(email, password) {
    const user = await this.findOne({ email });

    if (!user) throw new Error("USer not found");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt).update(password).digest("hex");

    if (hashedPassword !== userProvidedHash) throw new Error("incorrect Passwrod");

    const token = createTokenForUser(user);

    return token;
})


//here we are creating a model means a table
//              here user is name of the model and other is schema for the table
const User = model("user", userSchema);

//here we are exporting a model
export default User;