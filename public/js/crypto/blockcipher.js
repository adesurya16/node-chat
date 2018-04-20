Toolkit = function(){

    function roundFunction(roundKey,halfblock){
        return transposition(roundKey,subtitution(roundKey,halfblock));
    }

    function subtitution(roundKey,halfblock){
        // matrix 8x8
        var matrix = [];
        var idx = 0;
        for(var i=0;i<8;i++){
            matrix[i] = [];
            for(var j = 0;j<8;j++){
                matrix[i][j] = 0;
                idx = roundKey[(i + 1) % 8][j];
                matrix[i][j] = (matrix[i][j] + halfblock[Math.floor(idx / 8)][idx % 8]) % 2;
                idx = roundKey[(i + 7) % 8][j];
                matrix[i][j] = (matrix[i][j] + halfblock[Math.floor(idx / 8)][idx % 8]) % 2;
                idx = roundKey[i][(j + 1) % 8];
                matrix[i][j] = (matrix[i][j] + halfblock[Math.floor(idx / 8)][idx % 8]) % 2;
                idx = roundKey[i][(j + 7) % 8];
                matrix[i][j] = (matrix[i][j] + halfblock[Math.floor(idx / 8)][idx % 8]) % 2;                                                                
            }
        }

        return matrix;
    }

    function transposition(roundKey,halfblock){
        
        // copy matrix
        var copy = [];
        for(var i = 0;i<8;i++){
            copy[i] = [];
            for(var j;j<8;j++){
                copy[i][j] = halfblock[i][j];
            }
        }

        // shift x
        var shift = [];
        var sum = 0;
        for(var i = 0;i<8;i++){
            shift[i] = 0;
            sum = 0;
            for(var j = 0;j<8;j++){
                sum = (sum + roundKey[i][j])  % 8; 
            }
            shift[i] = sum;
        }

        matrix = []
        for(var i = 0;i<8;i++){
            matrix[i] = [];
            for(var j = 0;j<8;j++){
                matrix[i][j] = copy[i][(j+8-shift[i]) % 8]
            }
        }

        //copy matrix
        for(var i = 0;i<8;i++){
            copy[i] = [];
            for(var j = 0;j<8;j++){
                copy[i][j] = halfblock[i][j];
            }
        }

        // shift y
        for(var i = 0;i<8;i++){
            sum = 0;
            for(var j = 0;j<8;j++){
                sum = (sum + roundKey[i][j]) % 8;
            }
            shift[i] = sum;
        }
        
        for(var i = 0;i<8;i++){
            for(var j = 0;j<8;j++){
                matrix[i][j] = copy[(i + 8 - shift[j]) % 8][j];
            }
        }

        return matrix;
    }

    function roundKey(key){
        
        // to byteArray
        var arr = [];
        for(var i = 0;i < key.length;i++){
            arr[i] = key.charCodeAt(i);
        }

        // count nRound
        var sum = 0;
        for(var i = 0;i < arr.length;i++){
            sum = (sum + arr[i]) % 8;
        }
        var nRound = 8 + sum;

        // build round key
        //init matrix
        matrix = [];
        for(var i = 0;i < nRound;i++){
            matrix[i] = [];
            for(var j = 0;j< 8;j++){
                matrix[i][j] = [];
                for(var k = 0;k < 8;k++){
                    matrix[i][j][k] = 0;
                }
            }
        }
        sum = 0;
        for(var i = 0;i < nRound*8*8;i++){
            sum = (sum + arr[i % arr.length]) % 64;
            matrix[Math.floor(i / 64)][Math.floor((i % 64) / 8)][i % 8] = sum;
        } 
        return matrix;
    }

    function xorFunction(l, r){
        matrix = [];
        for(var i = 0;i < 8;i++){
            matrix[i] = [];
            for(var j = 0;j < 8;j++){
                if (l[i][j] == r[i][j]){
                    matrix[i][j] = 1;
                }else{
                    matrix[i][j] = 0;
                }
            }
        }
        return matrix;
    }

    return {
        roundFunction : roundFunction,
        subtitution : subtitution,
        transposition : transposition,
        roundKey : roundKey,
        xorFunction : xorFunction
    };
}

Feistel = function(rk){

    var roundkey = roundKey(rk);
    
    function encrypt(block){
        // console.log(block);
        var nextLeft = [];
        for(var i=0;i<8;i++){
            nextLeft[i] = [];
            for(var j=0;j<8;j++){
                nextLeft[i][j] = block[1][i][j];
            }
        }

        var nextRight = [];
        for(var i=0;i<8;i++){
            nextRight[i] = [];
            for(var j=0;j<8;j++){
                nextRight[i][j] = block[0][i][j];
            }
        }

        // init key
        var key = [];
        for(var i=0;i<8;i++){
            key[i] = [];
            for(var j=0;j<8;j++){
                key[i][j] = 0;
            }
        }
        
        //init currentRight
        var currentRight = [];
        for(var i=0;i<8;i++){
            currentRight[i] = [];
            for(var j=0;j<8;j++){
                currentRight[i][j] = 0;                    
            }
        }

        //init currentLeft
        var currentLeft = [];
        for(var i=0;i<8;i++){
            currentLeft[i] = [];
            for(var j=0;j<8;j++){
                currentLeft[i][j] = 0;                                    
            }
        }

        for(var i = 0;i<roundkey.length;i++){
            // key = copymatrix(key,roundkey[i]);
            currentRight = copymatrix(currentRight,nextLeft);
            currentLeft = copymatrix(currentLeft,nextRight);

            nextRight = copymatrix(nextRight,currentRight);
            // console.log(roundkey[i]);
            // console.log("------------------");
            // console.log(currentRight);
            // console.log(roundFunction(roundkey[i],currentRight));
            nextLeft = copymatrix(nextLeft,xorFunction(currentLeft,roundFunction(roundkey[i],currentRight)));
        }
        // console.log("##############");
        var res = [];
        res[0] = nextLeft;
        res[1] = nextRight;
        // console.log(res[0]);
        // console.log("=----------------");
        // console.log(res[1]);        
        // console.log("=----------------");
        return res;
    }
    
    function decrypt(block){
        var nextLeft = [];
        for(var i=0;i<8;i++){
            nextLeft[i] = [];
            for(var j=0;j<8;j++){
                nextLeft[i][j] = block[1][i][j];
            }
        }
        var nextRight = [];
        for(var i=0;i<8;i++){
            nextRight[i] = [];
            for(var j=0;j<8;j++){
                nextRight[i][j] = block[0][i][j];
            }
        }

        // init key
        var key = [];
        for(var i=0;i<8;i++){
            key[i] = [];
            for(var j=0;j<8;j++){
                key[i][j] = 0;
            }
        }
        
        //init currentRight
        var currentRight = [];
        for(var i=0;i<8;i++){
            currentRight[i] = [];
            for(var j=0;j<8;j++){
                currentRight[i][j] = 0;                    
            }
        }

        //init currentLeft
        var currentLeft = [];
        for(var i=0;i<8;i++){
            currentLeft[i] = [];
            for(var j=0;j<8;j++){
                currentLeft[i][j] = 0;                                    
            }
        }

        for(var i = roundkey.length-1;i>=0;i--){
            // console.log(roundkey)
            // key = copymatrix(key,roundkey[i]);
            currentRight = copymatrix(currentRight,nextLeft);
            currentLeft = copymatrix(currentLeft,nextRight);

            nextRight = copymatrix(nextRight,currentRight);
            currentLeft = copymatrix(nextLeft,xorFunction(currentLeft,roundFunction(roundkey[i],currentRight)));
        }
        var res = [];
        res[0] = nextLeft;
        // console.log(res[0]);
        // console.log("-----------------------");
        res[1] = nextRight;
        // console.log(res[1]);
        // console.log("-----------------------");                
        return res;
    }

    function roundFunction(roundKey,halfblock){
        return transposition(roundKey,subtitution(roundKey,halfblock));
    }

    function subtitution(roundKey,halfblock){
        // matrix 8x8
        var matrix = [];
        var idx = 0;
        for(var i=0;i<8;i++){
            matrix[i] = [];
            for(var j=0;j<8;j++){
                matrix[i][j] = 0;
                idx = roundKey[(i + 1) % 8][j];
                matrix[i][j] = (matrix[i][j] + halfblock[Math.floor(idx / 8)][idx % 8]) % 2;
                idx = roundKey[(i + 7) % 8][j];
                matrix[i][j] = (matrix[i][j] + halfblock[Math.floor(idx / 8)][idx % 8]) % 2;
                idx = roundKey[i][(j + 1) % 8];
                matrix[i][j] = (matrix[i][j] + halfblock[Math.floor(idx / 8)][idx % 8]) % 2;
                idx = roundKey[i][(j + 7) % 8];
                matrix[i][j] = (matrix[i][j] + halfblock[Math.floor(idx / 8)][idx % 8]) % 2;
                // console.log(matrix[i][j]);                                                                
            }
        }
        // console.log(matrix);
        return matrix;
    }

    function transposition(roundKey,halfblock){
        
        // copy matrix
        var copy = [];
        for(var i=0;i<8;i++){
            copy[i] = [];
            for(var j=0;j<8;j++){
                copy[i][j] = halfblock[i][j];
            }
        }

        // shift x
        var shift = [];
        var sum = 0;
        for(var i=0;i<8;i++){
            shift[i] = 0;
            sum = 0;
            for(var j=0;j<8;j++){
                sum = (sum + roundKey[i][j])  % 8; 
            }
            shift[i] = sum;
        }

        matrix = []
        for(var i=0;i<8;i++){
            matrix[i] = [];
            for(var j=0;j<8;j++){
                matrix[i][j] = copy[i][(j+8-shift[i]) % 8]
            }
        }

        //copy matrix
        for(var i=0;i<8;i++){
            copy[i] = [];
            for(var j=0;j<8;j++){
                copy[i][j] = halfblock[i][j];
            }
        }

        // shift y
        for(var i=0;i<8;i++){
            sum = 0;
            for(var j=0;j<8;j++){
                sum = (sum + roundKey[i][j]) % 8;
            }
            shift[i] = sum;
        }
        
        for(var i=0;i<8;i++){
            for(var j=0;j<8;j++){
                matrix[i][j] = copy[(i + 8 - shift[j]) % 8][j];
            }
        }
        // console.log(matrix);
        return matrix;
    }

    function roundKey(key){
        
        // to byteArray
        var arr = [];
        for(var i = 0;i < key.length;i++){
            arr[i] = key.charCodeAt(i);
        }

        // count nRound
        var sum = 0;
        for(var i = 0;i < arr.length;i++){
            sum = (sum + arr[i]) % 8;
        }
        var nRound = 8 + sum;

        // build round key
        //init matrix
        matrix = [];
        for(var i = 0;i < nRound;i++){
            matrix[i] = [];
            for(var j = 0;j< 8;j++){
                matrix[i][j] = [];
                for(var k = 0;k < 8;k++){
                    matrix[i][j][k] = 0;
                }
            }
        }
        sum = 0;
        for(var i = 0;i < nRound*8*8;i++){
            sum = (sum + arr[i % arr.length]) % 64;
            matrix[Math.floor(i / 64)][Math.floor((i % 64) / 8)][i % 8]= sum;
        } 
        return matrix;
    }

    function xorFunction(left, right){
        matrix = [];
        for(var i = 0;i < 8;i++){
            matrix[i] = [];
            for(var j = 0;j < 8;j++){
                if (left[i][j] == right[i][j]){
                    matrix[i][j] = 1;
                }else{
                    matrix[i][j] = 0;
                }
            }
        }
        return matrix;
    }

    

    function copymatrix(c1,c2){
        for(var i = 0;i < 8;i++){
            for(var j = 0;j < 8;j++){
                c1[i][j] = c2[i][j];
            }
        }
        return c1;
    }

    return {
        encrypt : encrypt,
        decrypt : decrypt,
        roundkey : roundkey
    };
}


Block = function(){
    // var valueByteArray = valueByte;
    
    function modeByte(valueByte){
        // byte == char
        // assert
        if (valueByte.length > 16){
            console.log("WRONG SIZE...!!!");
            return false;
        }else{
            var len = valueByte.length;
            var bitstream = "";
            for(var i=0;i<len;i++){
                bitstream += intToBin(valueByte[i]);    
            }
            
            // add padding
            for(var i=0;i<((8-(bitstream.length % 8)) % 8);i++){
                bitstream = '0' + bitstream;
            }
            
            // assert
            if (bitstream.length % 8 != 0){
                return false;
            }

            // matrix 3d returned
            bit = [];
            for(var i = 0;i < 2;i++){
                bit[i] = [];
                for(var j = 0;j < 8;j++){
                    bit[i][j] = [];
                    for(var k = 0;k < 8;k++){
                        bit[i][j][k] = 0;
                    }
                }
            }

            for(var i = 0;i<bitstream.length;i++){
                if (bitstream[i] == '0'){
                    bit[Math.floor(i/64)][Math.floor((i%64) / 8)][i % 8] = 0;                    
                }else{
                    bit[Math.floor(i/64)][Math.floor((i%64) / 8)][i % 8] = 1;                                        
                }
            }

            return bit;
        }
    }

    function modeBit(valueBit){
        //value bit matrix

        var len = (valueBit[0].length * valueBit[0][0].length)*2
        // console.log("valuebit : ");
        // console.log(valueBit);
        var bitstream = '';
        var byte = [];
        for(var i=0;i<len;i++){
            if (valueBit[Math.floor(i/64)][Math.floor((i%64) / 8)][i % 8] == 1) {
                bitstream = bitstream + '1';
            }else{
                bitstream = bitstream + '0';                
            }

            if (bitstream.length % 8 == 0){
                // console.log("bitstream " + bitstream);
                byte.push(binToInt(bitstream));
                bitstream = '';
            }
        }
        return byte;
    }

    function intToBin(num){
        var res = '';
        for(var i = 0;i < 8 ;i++){
            if (num==0){
                res = '0' + res;
            }else{
                if(num % 2==0){
                    res = "0" + res;
                }else{
                    res = "1" + res;
                }
                num = Math.floor(num/2);
            }
        }
        return res;
    }

    function binToInt(bin){
        var res = 0;
        var pangkat = 1;
        for(var i = 7;i >=0;i--){
            if (bin[i] == '1'){
                res += pangkat;
            }
            pangkat = pangkat * 2;
        }
        return res;
    }

    return {
        modeByte : modeByte,
        modeBit : modeBit
    };
}

Ecb = function(key){
    var blockObj = Block();
    var feistelObj = Feistel(key);

    function encrypt(blockByte){
        
        var len = blockByte.length;
        if (len>16){
            console.log("kaboom, length is not valid");
            return false;
        }
        
        var blockBit = blockObj.modeByte(blockByte);
        // console.log("block :");
        // console.log(blockBit);
        var encrypt = feistelObj.encrypt(blockBit);
        // console.log("enc");
        // console.log("encrypt :");        
        // console.log(encrypt);
        var chiperByte = blockObj.modeBit(encrypt);
        // console.log("byte cipher :");
        // console.log(chiperByte);
        // console.log("chiperbyte");
        // console.log(chiperByte);
        return chiperByte;
    }

    function decrypt(chiperByte){
        var chiperBit = blockObj.modeByte(chiperByte);
        var decrypt = feistelObj.decrypt(chiperBit);
        var blockByte = blockObj.modeBit(decrypt);
        return blockByte;
    }

    return {
        encrypt : encrypt,
        decrypt : decrypt
    };
}

Chiperblock = function(){
    function ECBmodeEncrypt(text,key){
        ecbObj = Ecb(key);
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
                // console.log("res :");
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