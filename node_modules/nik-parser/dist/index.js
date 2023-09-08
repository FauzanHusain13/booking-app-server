"use strict";
exports.__esModule = true;
exports.nikParser = void 0;
var wilayah_json_1 = require("./wilayah.json");
exports.nikParser = function (nik) { return ({
    isValid: function () {
        var _this = this;
        var isValidLength = function () { return nik.length === 16; };
        var isValidProvinsi = function () { return !!_this.province(); };
        var isValidKabupatenKota = function () { return !!_this.kabupatenKota(); };
        var isValidKecamatan = function () { return !!_this.kecamatan(); };
        return isValidLength()
            && isValidProvinsi()
            && isValidKabupatenKota()
            && isValidKecamatan();
    },
    provinceId: function () { return nik.substring(0, 2); },
    province: function () {
        return wilayah_json_1.provinsi[this.provinceId()];
    },
    kabupatenKotaId: function () { return nik.substring(0, 4); },
    kabupatenKota: function () {
        return wilayah_json_1.kabkot[this.kabupatenKotaId()];
    },
    kecamatanId: function () { return nik.substring(0, 6); },
    kecamatan: function () {
        return wilayah_json_1.kecamatan[this.kecamatanId()].split(' -- ')[0];
    },
    kodepos: function () {
        return wilayah_json_1.kecamatan[this.kecamatanId()].slice(-5);
    },
    kelamin: function () {
        return this.lahir().getDate() < 40 ? 'pria' : 'wanita';
    },
    lahir: function () {
        var year = Number(nik.substring(10, 12));
        var month = Number(nik.substring(8, 10));
        var date = Number(nik.substring(6, 8));
        return new Date(year, month - 1, date);
    },
    uniqcode: function () { return nik.substring(12, 16); }
}); };
