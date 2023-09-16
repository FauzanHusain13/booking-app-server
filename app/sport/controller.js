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
    },
    actionCreate: async(req, res) => {
        try {
            const { nameSport } = req.body

            const data = await Sport({ nameSport })
            await data.save()

            res.redirect("/sport")
        } catch (err) {
            res.redirect("/sport")
            throw err
        }
    },
    viewEdit: async(req, res) => {
        try {
            const { id } = req.params

            const sport = await Sport.findOne({ _id: id })
            res.render("admin/sport/edit", {
                title: "Edit sport",
                sport
            })
        } catch (err) {
            throw err
        }
    },
    actionEdit: async(req, res) => {
        try {
            const { id } = req.params
            const { nameSport } = req.body

            await Sport.findOneAndUpdate({
                _id: id
            }, { nameSport })

            res.redirect("/sport")
        } catch (err) {
            res.redirect("/sport")
            throw err
        }
    }
}