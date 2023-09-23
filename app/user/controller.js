const fs = require("fs")
const path = require("path")
const { rootPath } = require("../../config")
const { nikParser } = require("nik-parser")

const Field = require("../field/model")
const Sport = require("../sport/model")
const Location = require("../location/model")
const User = require("./model")
const Transaction = require("../transaction/model")
const History = require("../history/model")

module.exports = {
    getAllLocation: async(req, res) => {
        try {
            const location = await Location.find()

            res.status(200).json({ data: location })
        } catch (err) {
            res.status(500).json({ message: "Internal server error" })
        }
    },
    getAllSport: async(req, res) => {
        try {
            const sport = await Sport.find()

            res.status(200).json({ data: sport })
        } catch (err) {
            res.status(500).json({ message: "Internal server error" })
        }
    },

    // edit account
    editProfile: async(req, res) => {
        try {
            const { location = "", sport = "" } = req.body
            const payload = {}

            if(location.length) payload.location = location
            if(sport.length) payload.sport = sport

            let user = await User.findOne({ _id: req.user._id })
            user = await User.findOneAndUpdate({
                _id: req.user._id
            }, {
                ...payload
            }, { new: true, runValidators: true })

            res.status(201).json({ data: {
                location: user.location,
                sport: user.sport
            }})
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

    // API feature for user with professional account
    postField: async(req, res) => {
        try {
            const { nameField, sport, location, desc, open, closed } = req.body

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
                            sport,
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
    deleteField: async(req, res) => {
        try {
            const { fieldId } = req.params
           
            const field = await Field.findOne({
                _id: fieldId,
                owner: req.user._id
            })
            if(!field) {
                res.status(400).json({ message: "Field is not found!" })
            }

            await Field.findOneAndRemove({
                _id: fieldId,
                owner: req.user._id
            })

            let currentImage = `${rootPath}/public/uploads/field/${field.imageField}`;

            if(fs.existsSync(currentImage)){
                fs.unlinkSync(currentImage)
            }

            res.status(201).json({ data: "Delete success!" })
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
    deletePackage: async(req, res) => {
        try {
            const { fieldId, packageId } = req.params

            const field = await Field.findOne({
                _id: fieldId,
                owner: req.user._id
            })
            if(!field){
                return res.status(401).json({ message: "Field not found" })
            }
            
            // cari indeks paket yang akan dihapus berdasarkan packageId
            const packageIndex = field.packages.findIndex(
                (package) => package._id.toString() === packageId
            );
    
            // Jika packageIndex tidak ditemukan, kirim respons 404
            if (packageIndex === -1) {
                return res.status(404).json({ message: "Package not found" });
            }
    
            // Hapus paket dari array packages
            field.packages.splice(packageIndex, 1);
    
            // Simpan perubahan ke basis data
            const updatedField = await field.save();
    
            res.status(200).json({ data: updatedField });
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
    deletePayment: async(req, res) => {
        try {
            const { fieldId, paymentId } = req.params

            const field = await Field.findOne({
                _id: fieldId,
                owner: req.user._id
            })
            if(!field){
                return res.status(404).json({ message: "Field not found" })
            }

            // cari indeks paket yang akan dihapus berdasarkan paymentId
            const paymentIndex = field.payments.findIndex(
                (payment) => payment._id.toString() === paymentId
            );
    
            // Jika paymentIndex tidak ditemukan, kirim respons 404
            if (paymentIndex === -1) {
                return res.status(404).json({ message: "Payment not found" });
            }
    
            // Hapus paket dari array payments
            field.payments.splice(paymentIndex, 1);
    
            // Simpan perubahan ke basis data
            const updatedField = await field.save();
    
            res.status(200).json({ data: updatedField });
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

    // API for regular account
    getField: async(req, res) => {
        try {
            const field = await Field.find({ location: req.user.location, sport: req.user.sport })
                .select("_id nameField imageField sport location owner open closed")
                .populate("sport")
                .populate("location")
                .populate("owner")

            res.status(200).json({ data: field })
        } catch (err) {
            res.status(500).json({ message: "Internal server error" })
        }
    },
    getDetailField: async(req, res) => {
        try {
            const { fieldId } = req.params

            const field = await Field.findOne({ _id: fieldId })
                .populate("sport")
                .populate("location")
                .populate("owner")

            res.status(200).json({ data: field })
        } catch (err) {
            res.status(500).json({ message: "Internal server error" })
        }
    },
    searchField: async(req, res) => {
        try {
            const { nameField } = req.body

            const field = await Field.find({ nameField: { $regex: nameField, $options: 'i' }})

            res.status(201).json({ data: field })
        } catch (err) {
            return res.status(500).json({
                error: 1,
                message: "Internal server error"
            });
        }
    },

    postTransaction: async(req, res) => {
        try {
            const { field, payment: paymentId, when, startTime, endTime } = req.body

            const foundField = await Field.findOne({ _id: field })
            
            // ambil payment didalam array sesuai id yang di input
            const foundPayment = await Field.findOne({
                "payments": {
                    $elemMatch: {
                        _id: paymentId
                    }
                }
            })
            if(!foundPayment) return res.status(401).json({ message: "payment not found!" })
            const res_payment = foundPayment.payments.find((payment) => payment._id.equals(paymentId))

            const foundPricePackages = await Field.findOne({
                "packages": {
                    $elemMatch: {
                        hour: endTime - startTime
                    }
                }
            })
            if(!foundPricePackages) return res.status(401).json({ message: "package not found!" })
            const res_package = foundPricePackages.packages.find((package) => package.hour === (endTime - startTime))
        
            // tambah ke model transaction
            // cek apakah user: req.user._id sudah ada dalam model transaction
            const cekTransaction = await Transaction.findOne({ user: req.user._id })

            // cek apakah ada transaksi yang berkonflik dengan waktu yang diminta
            const conflictingTransaction = await Transaction.findOne({
                startTime: { $lt: endTime },
                endTime: { $gt: startTime },
                field: field, // tambahkan filter berdasarkan lapangan yang sama
            });

            // cek apakah startTime dan endTime memesan di waktu buka atau tutup
            if(startTime < foundField.open) {
                res.status(422).json({ message: "You cannot order at that time" })
            } else if(endTime > foundField.closed) {
                res.status(422).json({ message: "You cannot order at that time" })
            } else {
                if(cekTransaction) {
                    res.status(422).json({ message: "You can only order 1 field" })
                } else {
                    if(conflictingTransaction) {
                        res.status(422).json({ message: "Already booked!" })
                    } else {
                        const transaction = new Transaction({
                            field,
                            package: {
                                hour: endTime - startTime,
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
                            tax: 10000,
                            total: res_package.price + 10000
                        })
                        await transaction.save()
            
                        // hapus dari model transaction setelah 24 jam jika dia memesan today, dan hapus setelah 48 jam jika dia memesan tomorrow
                        if(when === "tomorrow") {
                            setTimeout(async function() {
                                await Transaction.findOneAndRemove({ _id: transaction._id })
                            }, 86400000 * 2)
                        } else {
                            setTimeout(async function() {
                                await Transaction.findOneAndRemove({ _id: transaction._id })
                            }, 86400000)
                        }
            
                        // tambahkan ke model history, agar user dapat melihat lapangan mana saja yang sudah dia gunakan kemarin kemarin
                        const history = new History({
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
                            tax: 10000,
                            total: res_package.price + 10000
                        })
                        await history.save()
            
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
                            tax: 10000,
                            total: res_package.price + 10000
                        })
                    }
                }
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
    getDetailTransaction: async(req, res) => {
        try {
            const transaction = await Transaction.findOne({ user: req.user._id })
                .populate("field")
                .populate("user")

            res.status(200).json({ data: transaction })
        } catch (err) {
            res.status(500).json({ message: "Internal server error" })
        }
    },

    getHistory: async(req, res) => {
        try {
            const history = await History.find({ user: req.user._id })
                .populate("field")

            res.status(200).json({ history })
        } catch (err) {
            res.status(500).json({ message: "Internal server error" })
        }
    }
}