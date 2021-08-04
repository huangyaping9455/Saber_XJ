import CryptoJS from "crypto-js"
// 配置属性
export const config = {
    /*加密*/
    aesEncrypt: function (encrypt) {
        var aesPrivateKey = 'abcdefgabcdefg12'; //密钥
        var key = CryptoJS.enc.Utf8.parse(aesPrivateKey);
        var srcs = CryptoJS.enc.Utf8.parse(JSON.stringify(encrypt));
        var encrypted = CryptoJS.AES.encrypt(srcs, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    },
    /*解密*/
    aesDecrypt: function (decryptString) {
        var aesPrivateKey = 'abcdefgabcdefg12'; //密钥
        var key = CryptoJS.enc.Utf8.parse(aesPrivateKey);
        var decrypt = CryptoJS.AES.decrypt(decryptString, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return CryptoJS.enc.Utf8.stringify(decrypt).toString();
    },
};