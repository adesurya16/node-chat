var http = require('http');
var ecdh = require('./crypto/ECDH');
var ecdhObj = ecdh.ECDH();
var point = require('./crypto/Point');

http.createServer(function (req, res) {
<<<<<<< HEAD
  var privateKey = ecdhObj.createPrivateKey();
  var publicKey = ecdhObj.createPublicKey();
  res.writeHead(200, { 'Content-Type': 'text/html' });
  // res.write("private key: " + privateKey);
  res.write("public key: x: " + publicKey.x + " y: " + publicKey.y);
  res.end();
=======
	var privateKey = ecdhObj.createPrivateKey();
	var publicKey = ecdhObj.createPublicKey();
    res.writeHead(200, {'Content-Type': 'text/html'});
    // res.write("private key: " + privateKey);
    res.write("public key: x: "+ publicKey.x+" y: "+publicKey.y);
    res.end();
>>>>>>> 5e77bd1ccd408b4ffd9e531b2d2b780633c88276
}).listen(8080);