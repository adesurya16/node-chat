var http = require('http');
var chiperblock = require('./Chiperblock');
var cp = chiperblock.Chiperblock();

http.createServer(function (req, res) {
  var PlainText = 'ade surya ramadhani';
  var key = 'kriptografi';
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write("PlainText : " + PlainText + " , Key : " + key + "</br>");
  console.log("PlainText : " + PlainText + " , Key : " + key );
  // res.write("ChiperText (hasil encrypt) : " + cp.ECBmodeEncrypt(PlainText,key) + "</br>");
  var cipher = cp.ECBmodeEncrypt(PlainText,key);
  console.log("ChiperText (hasil encrypt) : " + cipher);
  // res.write("PlainText (hasil decrypt) : " + cp.ECBmodeDecrypt(PlainText,key) + "</br>");
  var plain = cp.ECBmodeDecrypt(cipher,key)
  console.log("PlainText (hasil decrypt) : " + plain);
  res.end();
}).listen(8000);