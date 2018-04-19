exports.Block = function(){
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
        var len = (valueBit[0].length + valueBit[0][0].length)*2
        var bitstream = '';
        var byte = [];
        for(var i=0;i<len;i++){
            if (bit[Math.floor(i/64)][Math.floor((i%64) / 8)][i % 8] == 1) {
                bitstream = bitstream + '1';
            }else{
                bitstream = bitstream + '0';                
            }

            if (bitstream.length % 8 == 0){
                byte.push(BinToInt())
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

    function BinToInt(bin){
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