exports.Chiper = function(){
  function encrypt(plaintext,key) {
    return plaintext+"-"+key;
  }

  function decrypt(chipertext,key) {
    return chipertext.replace("-"+key,"");
  }
  return {
    encrypt,
    decrypt
  }
}