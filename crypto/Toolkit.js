exports.Toolkit = function(){

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