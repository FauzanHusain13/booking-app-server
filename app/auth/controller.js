const User = require("../user/model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { jwtKey } = require("../../config")

module.exports = {
    register: async(req, res) => {
        try {
            const { username, email, password } = req.body;

            const newUser = new User({
                username,
                email,
                password,
            })

            const savedUser = await newUser.save()
            res.status(201).json({ data: savedUser })
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal Server Error" })
        }
    },
    login: async(req, res) => {
        const { email, password } = req.body

        User.findOne({ email }).then((user) => {
            if(user) {
                const checkPassword = bcrypt.compareSync(password, user.password)
  
                if (checkPassword) {
                    const token = jwt.sign({
                        user: {
                            id: user._id,
                            username: user.username,
                            email: user.email,
                            professional: user.professional
                        }
                    }, jwtKey)
  
                    res.status(200).json({
                        data: { token }
                    })
                } else {
                    res.status(403).json({
                        message: "password yang anda masukkan salah!"
                    })  
                }
            } else {
                res.status(403).json({
                    message: "email yang anda masukkan belum terdaftar!"
                })
            }
        }).catch((err) => {
            res.status(500).json({
                message: err.message || `Internal server error`
            })
        })
    }
}