var http = require('http');
var ecdh = require('./ECDH');
var ecdhObj = ecdh.ECDH();
http.createServer(function (req, res) {

	var privateKey = ecdhObj.createPrivateKey();
	var publicKey = ecdhObj.createPublicKey();
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("private key: " + privateKey);
    res.write("public key: x: "+ publicKey.x+" y: "+publicKey.y);
    res.end();
}).listen(8080);