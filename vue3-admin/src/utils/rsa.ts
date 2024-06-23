import CryptoJS from "crypto-js"

const key = CryptoJS.enc.Utf8.parse("sdghj7df7h23jhy9yh94")
const iv = CryptoJS.enc.Utf8.parse("gysd7sdg87g2487crhhu")

export function encrypt(word: string) {
  const srcs = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  })
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
}
