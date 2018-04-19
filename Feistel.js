exports.Feistel = function(roundKey){

    var roundkey = roundKey;
    
    function encrypt(block){

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
            nextLeft = copymatrix(nextLeft,xorFunction(currentLeft,roundFunction(roundkey[i],currentRight)));
        }
        var res = [];
        res[0] = nextLeft;
        res[1] = nextRight;
        return res;
    }
    
    function decrypt(block){
        var nextLeft = [];
        for(var i=0;i<8;i++){
            nextleft[i] = [];
            for(var j=0;j<8;j++){
                nextleft[i][j] = block[1][i][j];
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
        res[1] = nextRight;
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
            for(var j;j<8;j++){
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
        for(var i;i<8;i++){
            copy[i] = [];
            for(var j;j<8;j++){
                copy[i][j] = halfblock[i][j];
            }
        }

        // shift x
        var shift = [];
        var sum = 0;
        for(var i;i<8;i++){
            shift[i] = 0;
            sum = 0;
            for(var j;j<8;j++){
                sum = (sum + roundKey[i][j])  % 8; 
            }
            shift[i] = sum;
        }

        matrix = []
        for(var i;i<8;i++){
            matrix[i] = [];
            for(var j;j<8;j++){
                matrix[i][j] = copy[i][(j+8-shift[i]) % 8]
            }
        }

        //copy matrix
        for(var i;i<8;i++){
            copy[i] = [];
            for(var j;j<8;j++){
                copy[i][j] = halfblock[i][j];
            }
        }

        // shift y
        for(var i;i<8;i++){
            sum = 0;
            for(var j;j<8;j++){
                sum = (sum + roundKey[i][j]) % 8;
            }
            shift[i] = sum;
        }
        
        for(var i;i<8;i++){
            for(var j;j<8;j++){
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