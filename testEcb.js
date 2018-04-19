var http = require('http');
var chiperblock = require('./Chiperblock');
var cp = chiperblock.Chiperblock();

http.createServer(function (req, res) {
  var PlainText = 'ade surya ramadhani';
  var key = 'kriptografi';
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write("PlainText : " + PlainText + " , Key : " + key);
  res.write("ChiperText (hasil encrypt) : " + cp.ECBmodeEncrypt(PlainText,key));
  res.write("PlainText (hasil decrypt) : " + cp.ECBmodeDecrypt(PlainText,key));
  res.end();
}).listen(8000);