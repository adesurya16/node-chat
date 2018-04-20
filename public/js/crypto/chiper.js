function encrypt(plaintext, key) {
  return Chiperblock.ECBmodeEncrypt(PlainText,key);
}

function decrypt(chipertext, key) {
  return Chiperblock.ECBmodeDecrypt(PlainText,key);
}
