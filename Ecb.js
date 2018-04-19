var block = require('./Block');
var toolkit = require('/Toolkit');
var feistel = require('/Feistel');

exports.Ecb(key){
    var feistelObj = feistel(key);
    blockObj = block.Block();
    toolkitObj = toolkit.Toolkit();

    function encrypt(blockByte){
        
        var len = blockByte.length;
        if (len>16){
            return false;
        }
        
        var blockBit = blockObj.modeByte(blockByte);
        var encrypt = feistelObj.encrypt(blockBit);
        var chiperByte = blockObj.modeByte(encrypt);
        return chiperByte;
    }

    function decrypt(chiperByte){
        var chiperBit = blockObj.modeByte(chiperByte);
        var decrypt = feistelObj.decrypt(chiperBit);
        var blockByte = blockObj.modeByte(decrypt);
        return blockByte;
    }

}