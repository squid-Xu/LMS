const CryptoJS = require('crypto-js');

module.exports = {
  // 加密
  encrypt(word) {
    const key = this.config.KEY;
    const iv = this.config.IV;
    const srcs = CryptoJS.enc.Utf8.parse(word);
    const encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding,
    });

    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  },
  // 解密
  decrypt(word) {
    const key = this.config.KEY;
    const iv = this.config.IV;

    const base64 = CryptoJS.enc.Base64.parse(word);
    const src = CryptoJS.enc.Base64.stringify(base64);

    const decrypt = CryptoJS.AES.decrypt(src, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding,
    });

    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
  },
};
