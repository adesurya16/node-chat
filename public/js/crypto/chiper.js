function encrypt(plaintext, key) {
  return plaintext + "-" + key;
}

function decrypt(chipertext, key) {
  return chipertext.replace("-" + key,"");
}
