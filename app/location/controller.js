const Location = require("./model")

module.exports = {
    index: async(req, res) => {
        try {
            const location = await Location.find()

            res.render("admin/location", {
                location,
            })
        } catch (err) {
            throw err
        }
    },
    viewCreate: async(req, res) => {
        try {
            res.render("admin/location/add", {
                title: "Add location"
            })
        } catch (err) {
            throw err
        }
    },
    actionCreate: async(req, res) => {
        try {
            const { province, city } = req.body

            const data = await Location({ province, city })
            await data.save()

            res.redirect("/")
        } catch (err) {
            throw err
        }
    },
    actionDelete: async(req, res) => {
        try {
            const { id } = req.params;

            await Location.findOneAndRemove({
                _id: id,
            });

            res.redirect("/");
        } catch (err) {
            res.redirect("/");
            throw err
        }
    }
}