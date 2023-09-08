const fs = require("fs")
const path = require("path")
const { rootPath } = require("../../config")
const { nikParser } = require("nik-parser")

const Field = require("../field/model")
const User = require("./model")
const Transaction = require("../transaction/model")

module.exports = {
    // update to professional account
    updateToPro: async(req, res) => {
        try {
            const { nik } = req.body
            
            const checkNik = nikParser(nik)

            if(checkNik.isValid() === true) {
                await User.findOneAndUpdate({
                    _id: req.user._id
                }, {
                    professional: true,
                    nik
                }, { new: true, runValidators: true })

                res.status(201).json({
                    data: {
                        professional: true,
                        nik: nik
                    }
                })
            } else {
                res.status(400).json({
                    message: "Nik is'nt valid!"
                })
            }
        } catch (err) {
            if (err.name === "ValidationError") {
                return res.status(422).json({
                  error: 1,
                  message: err.message,
                  fields: err.errors
                });
            } else {
                return res.status(500).json({
                  error: 1,
                  message: "Terjadi kesalahan server."
                });
            }
        }
    },

    // professional feature
    postField: async(req, res) => {
        try {
            const { nameField, nameSport, location, desc, open, closed } = req.body

            if(req.file) {
                let tmp_path = req.file.path;
                let originalExt = req.file.originalname.split(".")[req.file.originalname.split(".").length - 1];
                let filename = req.file.filename + "." + originalExt;
                let target_path = path.resolve(rootPath, `public/uploads/field/${filename}`);

                const src = fs.createReadStream(tmp_path);
                const dest = fs.createWriteStream(target_path);

                src.pipe(dest);

                src.on("end", async() => {
                    try {
                        const field = new Field({
                            nameField,
                            imageField: filename,
                            nameSport,
                            location,
                            desc,
                            owner: req.user._id,
                            open,
                            closed,
                            packages: [],
                            payments: []
                        })

                        await field.save();

                        res.status(201).json({
                            data: field
                        })
                    } catch (err) {
                        if(err && err.name === "ValidationError") {
                            return res.status(422).json({
                                error: 1,
                                message: err.message,
                                fields: err.errors
                            })
                        }
                    }
                })
            } else {
                res.status(400).json("image field is required!")
            }
        } catch (err) {
            if (err.name === "ValidationError") {
                return res.status(422).json({
                  error: 1,
                  message: err.message,
                  fields: err.errors
                });
            } else {
                return res.status(500).json({
                  error: 1,
                  message: "Terjadi kesalahan server."
                });
            }
        }
    },
    postPackage: async(req, res) => {
        try {
            const payload = req.body
            const { fieldId } = req.params

            const field = await Field.findById(fieldId)
            if (!field) {
                return res.status(401).json({ message: "Field not found" })
            }

            field.packages.push(payload)
            const updatedField = await field.save()

            res.status(200).json({ data: updatedField })
        } catch (err) {
            if (err.name === "ValidationError") {
                return res.status(422).json({
                  error: 1,
                  message: err.message,
                  fields: err.errors
                });
            } else {
                return res.status(500).json({
                  error: 1,
                  message: "Terjadi kesalahan server."
                });
            }
        }
    },
    postPayment: async(req, res) => {
        try {
            const payload = req.body
            const { fieldId } = req.params

            const field = await Field.findById(fieldId)
            if (!field) {
                return res.status(401).json({ message: "Field not found" })
            }

            field.payments.push(payload)
            const updatedField = await field.save()

            res.status(200).json({ data: updatedField })
        } catch (err) {
            if (err.name === "ValidationError") {
                return res.status(422).json({
                  error: 1,
                  message: err.message,
                  fields: err.errors
                });
            } else {
                return res.status(500).json({
                  error: 1,
                  message: "Terjadi kesalahan server."
                });
            }
        }
    },

    // user transaction
    transaction: async(req, res) => {
        try {
            const { field, package: packageId, payment: paymentId, when, startTime, endTime } = req.body
            
            // ambil salah satu package dan payment di dalam array, ambil sesuai dengan id
            const foundPackage = await Field.findOne({
                "packages": {
                    $elemMatch: {
                        _id: packageId
                    }
                }
            })
            if(!foundPackage) return res.status(401).json({ message: "package not found!" })

            const foundPayment = await Field.findOne({
                "payments": {
                    $elemMatch: {
                        _id: paymentId
                    }
                }
            })
            if(!foundPayment) return res.status(401).json({ message: "payment not found!" })

            const res_package = foundPackage.packages.find((package) => package._id.equals(packageId))
            const res_payment = foundPayment.payments.find((payment) => payment._id.equals(paymentId))

            // tambah transaction
            const transaction = new Transaction({
                field,
                package: {
                    hour: res_package.hour,
                    price: res_package.price
                },
                payment: {
                    paymentName: res_payment.paymentName,
                    noRek: res_payment.noRek,
                    noTelp: res_payment.noTelp
                },
                when,
                startTime,
                endTime,
                user: req.user._id,
                total: res_package.price + 10000
            })
            await transaction.save()

            // hapus transaction
            if(when === "tomorrow") {
                setTimeout(async function() {
                    await Transaction.findOneAndRemove({ _id: transaction._id })
                }, 86400000 * 2)
            } else {
                setTimeout(async function() {
                    await Transaction.findOneAndRemove({ _id: transaction._id })
                }, 86400000)
            }

            res.status(201).json({ 
                field,
                package: {
                    hour: res_package.hour,
                    price: res_package.price
                },
                payment: {
                    paymentName: res_payment.paymentName,
                    noRek: res_payment.noRek,
                    noTelp: res_payment.noTelp
                },
                when,
                startTime,
                endTime,
                user: req.user._id,
                total: res_package.price + 10000
            })
        } catch (err) {
            if (err.name === "ValidationError") {
                return res.status(422).json({
                  error: 1,
                  message: err.message,
                  fields: err.errors
                });
            } else {
                return res.status(500).json({
                  error: 1,
                  message: "Terjadi kesalahan server."
                });
            }
        }
    }
}