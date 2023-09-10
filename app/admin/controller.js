const Admin = require("./model")

const bcrypt = require("bcryptjs")

module.exports = {
    viewSignIn: async(req, res) => {
        try {
            if(req.session.admin === null || req.session.admin === undefined) {
                res.render("admin/admin/index", {
                    title: "Sign in"
                })
            } else {
                res.redirect("/location")
            }
        } catch (err) {
            res.redirect("/")
        }
    },
    actionSignin: async(req, res) => {
        try {
            const { email, password } = req.body;
            const check = await Admin.findOne({ email });

            if (check) {
                const checkPassword = await bcrypt.compare(password, check.password)
                if(checkPassword) {
                    req.session.admin = {
                        id: check._id,
                        email: check.email,
                    }
                    res.redirect("/location");
                } else {
                    res.redirect("/");
                }
                
            } else {
                res.redirect("/");
            }
        } catch (err) {
            res.redirect("/");
        }
    }
}