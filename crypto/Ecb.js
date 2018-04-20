var block = require('./Block');
var toolkit = require('./Toolkit');
var feistel = require('./Feistel');

exports.Ecb = function(key){
    var blockObj = block.Block();
    var toolkitObj = toolkit.Toolkit();
    var feistelObj = feistel.Feistel(key);

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