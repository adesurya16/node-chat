var http = require('http');
var ecdh = require('./crypto/ECDH');
var ecdhObj = ecdh.ECDH();
var point = require('./crypto/Point');

http.createServer(function (req, res) {

  var privateKey = ecdhObj.createPrivateKey();
  var publicKey = ecdhObj.createPublicKey(privateKey);
  var s1 = ecdhObj.createSecretKey(373, point.Point(93, 19));

  var s2 = ecdhObj.createSecretKey(74, point.Point(104, 843));
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write("private key: " + privateKey);
  res.write("public key: " + publicKey.x + ", " + publicKey.y);
  res.write("s1: "+s1.x+" "+s1.y+" s2: "+s2.x+" "+s2.y);
  res.end();
}).listen(8080);