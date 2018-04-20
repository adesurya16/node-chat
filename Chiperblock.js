var ecb = require('./Ecb');
exports.Chiperblock = function(){
    function ECBmodeEncrypt(text,key){
        ecbObj = ecb.Ecb(key);
        var block = '';
        var res = '';
        for(var i=0;i<text.length;i++){
            block += text[i];
            if (((i+1) % 16==0) || (i+1) == text.length){
                // console.log(toByteArray(block));
                // console.log(block);
                var encrypted = ecbObj.encrypt(toByteArray(block));
                // console.log(encrypted);
                block = '';
                res += toCharArray(encrypted);
                // console.log(res);
            }
        }
        return res;
    }

    function ECBmodeDecrypt(text,key){
        ecbObj = ecb.Ecb(key);
        var block = '';
        var res = '';
        for(var i=0;i<text.length;i++){
            block += text[i];
            if (((i+1) % 16==0) || (i+1) == text.length){
                var decrypted = ecbObj.decrypt(toByteArray(block));
                block = '';
                res += toCharArray(decrypted);
            }
        }
        return res;
    }

    function toByteArray(str){
        var res = [];
        for(var i=0;i<str.length;i++){
            res[i] = str.charCodeAt(i);
        }
        return res;
    }

    function toCharArray(byte){
        var str = '';
        for(var i=0;i<byte.length;i++){
            str += String.fromCharCode(byte[i]);            
        }
        return str;
    }
    return {
        ECBmodeEncrypt : ECBmodeEncrypt,
        ECBmodeDecrypt : ECBmodeDecrypt
    };
}