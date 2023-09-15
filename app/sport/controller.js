const Sport = require("./model")

module.exports = {
    index: async(req, res) => {
        try {
            const sport = await Sport.find()

            res.render("admin/sport", {
                sport,
                title: "Sport"
            })
        } catch (err) {
            throw err
        }
    },
    viewCreate: async(req, res) => {
        try {
            res.render("admin/sport/add", {
                title: "Add sport"
            })
        } catch (err) {
            throw err
        }
    }
}