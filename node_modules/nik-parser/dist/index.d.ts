export interface NikDetail {
    isValid: Function;
    provinceId: Function;
    province: Function;
    kabupatenKotaId: Function;
    kabupatenKota: Function;
    kecamatanId: Function;
    kecamatan: Function;
    kodepos: Function;
    kelamin: Function;
    lahir: Function;
    uniqcode: Function;
}
export declare const nikParser: (nik: string) => NikDetail;
