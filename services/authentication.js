import jwt from "jsonwebtoken";

const secret = "@br@k@d@br@123";

export function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        fullname: user.fullName,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
    };

    const token = jwt.sign(payload, secret);
    return token;
}

export function validateToken(token) {
    const payload = jwt.verify(token, secret);
    return payload;
}