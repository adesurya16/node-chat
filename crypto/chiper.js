var cipher = require('./Chiperblock');
exports.Chiper = function(){
  function encrypt(plaintext,key) {
    ecb = cipher.Chiperblock();
    // console.log(ecb.ECBmodeEncrypt(plaintext, key));
    return ecb.ECBmodeEncrypt(plaintext, key);
  }
  
  function decrypt(chipertext,key) {
    ecb = cipher.Chiperblock();
    // console.log(ecb.ECBmodeDecrypt(chipertext, key));
    return ecb.ECBmodeDecrypt(chipertext, key);
  }
  return {
    encrypt,
    decrypt
  }
}
