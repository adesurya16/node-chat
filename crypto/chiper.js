var cipher = require('./Cipherblock');
exports.Chiper = function(){
  function encrypt(plaintext,key) {
    ecb = cipher.Cipherblock();
    return ecb.ECBmodeEncrypt(plaintext, key);
  }

  function decrypt(chipertext,key) {
    ecb = cipher.Cipherblock();
    return ecb.ECBodeDecrypt(chipertext, key);
  }
  return {
    encrypt,
    decrypt
  }
}
