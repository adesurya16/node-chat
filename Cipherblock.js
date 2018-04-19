var ecb = require('./Ecb');
exports.Cipherblock(){
    function ECBmodeEncrypt(text,mode,key){
        ecbObj = ecb.Ecb(key);
        var block = '';
        var res = '';
        for(var i=0;i<text.length;i++){
            block += text[i];
            if (((i+1) % 16==0) || (i+1) == text.length){
                var encrypted = ecb.encrypt(toByteArray(block));
                block = '';
                res += toCharArray(encrypted);
            }
        }
        return res;
    }

    function ECBmodeDecrypt(text,mode,key){
        ecbObj = ecb.Ecb(key);
        var block = '';
        var res = '';
        for(var i=0;i<text.length;i++){
            block += text[i];
            if (((i+1) % 16==0) || (i+1) == text.length){
                var encrypted = ecb.decrypt(toByteArray(block));
                block = '';
                res += toCharArray(encrypted);
            }
        }
        return res;
    }

    fucntion toByteArray(str){
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
}