// Not in use - as token creation has not been added
const jwt = require('jsonwebtoken');
const constants = require('./../constants');

const verifyToken = async (req, res, next) => {
    let token = req.body.token ? req.body.token : "";

    if (!token) {
        return res.status(403).send({ message: "Token required for Authentication" })
    }

    try {
        const decode = jwt.verify(token, constants.secretekey);
        req.user = decode;
        return next()
    } catch (err) {
        res.status(500).send({ message: "Invalid Token"})
    }
    // return next()
}

module.exports = verifyToken;