# NIK Parser in TypeScript

Parse & Validasi Nomor Induk Kependudukan (NIK) KTP Menggunakan TypeScript.

Kode ini merupakan modifikasi dari https://github.com/bachors/nik_parse.js.

Perbedaan antara `nik-parser` dan `nik_parse.js` adalah:

|                  | nik-parser                               | nik_parse.js  |
|------------------|------------------------------------------|---------------|
| Bahasa           | TypeScript                               | JavaScript    |
| Didesain sebagai | Library                                  | JSON response |
| Fokus            | Esensial data<sup>[[1]](#footnote)</sup> | Lain-lain     |

<a id="footnote" />
<sup>[1]</sup>
<sub>Esensial data yang dimaksud tidak memasukkan informasi seperti zodiak,
usia hingga ke tingkatan hari, dan berapa lama lagi akan berulang tahun.</sub>

## Instalasi

```sh
npm i nik-parser
```

## Penggunaan

```ts
// const { nikParser } = require('nik-parser')

import { nikParser } from 'nik-parser'

const ktp = '3204110609970001'

const nik = nikParser(ktp)

nik.isValid()         // true
nik.provinceId()      // 32
nik.province()        // JAWA BARAT
nik.kabupatenKotaId() // 3204
nik.kabupatenKota()   // KAB. BANDUNG
nik.kecamatanId()     // 320411
nik.kecamatan()       // KATAPANG
nik.kodepos()         // 40921
nik.kelamin()         // pria
nik.lahir()           // 1997-09-05T17:00:00.000Z (Date object)
nik.uniqcode()        // 0001
```

# Catatan
Data yang dihasilkan hanya hasil menterjemahkan tiap digit NIK sehingga data yang dihasilkan adalah
tempat kali pertama NIK dibuat/tempat lahir (bukan tempat domisili pemilik NIK secara uptodate).
