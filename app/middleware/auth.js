const jwt = require("jsonwebtoken")
const User = require("../user/model")
const { jwtKey } = require("../../config")

module.exports = {
    isLoginAdmin: (req, res, next) => {
        if(req.session.admin === null || req.session.admin === undefined) {
            res.redirect("/");
        } else {
            next();
        }
    },
    isLoginUser: async(req, res, next) => {
        try {
            const token = req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : null;
            const data = jwt.verify(token, jwtKey)

            const user = await User.findOne({ _id: data.user.id })

            if(!user) {
                throw new Error()
            }

            req.user = user;
            req.token = token;

            next()
        } catch (err) {
            res.status(401).json({
                error: 'Not authorized to access this'
            })
        }
    },
    isProUser: async(req, res, next) => {
        try {
            const token = req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : null;
            const data = jwt.verify(token, jwtKey)

            const user = await User.findOne({ _id: data.user.id })
            if(!user) {
                throw new Error()
            } else if(user.professional === true) {
                req.user = user;
                req.token = token;
                next()
            } else {
                res.status(401).json({
                    error: 'This account is not professional!'
                }) 
            }
        } catch (err) {
            res.status(401).json({
                error: 'Not authorized to access this'
            })
        }
    }
}