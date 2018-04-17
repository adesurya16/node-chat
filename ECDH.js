var point = require('./Point');
var prime = require('find-prime');
var random = require('random-int');

exports.ECDH = function() {
	var a, b, m, base, privateKey, publicKey, secretKey;

	function generateMod() {
		m = prime(10, function(error, prime) {
			return prime[0];
		});
	}

	function generateEquation() {
		a = random(1, 100);
		b = random(1, 100);

		while (4 * Math.pow(a, 3) + 27 * Math.pow(b, 2) == 0) {
			a = random(1, 100);
			b = random(1, 100);
		}
	}

	function selectBase() {
		generateEquation();
		generateMod();
		base = point.Point(0, 0);
		found = false;
		x = 0;
		y = 0;

		while(!found && x < m) {
			y = Math.pow(x, 3) + a * x + b;

			if (Number.isInteger(Math.sqrt(y))) {
				found = true;
			}

			x ++;
		}

		base.x = x;
		base.y = y;
	}

	function mod(x, n) {
		return (x % n + n) % n;
	}

	function modInverse(a, _m) {
		a = mod(a, _m);
		for(i = 1; i < m; i++) {
			if (mod((a*i), _m) == 1) {
				return i;
			}
		}
	}

	function add(p, q) {
		if (p.x == q.x && p.y == q.y) {
			return doublePoint(p);
		}

		gradien = mod((p.y - q.y) * modInverse(p.x - q.x, m), m);
		r  = point.Point(0, 0);
		r.x = mod(Math.pow(gradien, 2) - p.x - q.x, m);
		r.y = mod(gradien * (p.x - r.x) - p.y, m);
		// console.log(r.x);
		return r;
	}

	function minus(p, q) {
		newQ = point.Point(0, 0);
		newQ.x = q.x;
		newQ.y = mod((q.y * -1), m);

		r = add(p, newQ);

		return r;
	}

	function doublePoint(p) {
		gradien = mod(((3 * p.x * p.x + a) * modInverse(2 * p.y, m)), m);
		r  = point.Point(0,0);
		r.x = mod((Math.pow(gradien, 2) - 2 * p.x),m);
		r.y = mod((gradien * (p.x - r.x) - p.y), m);
		// console.log(r.x);
		return r;
	}

	function createPrivateKey() {
		selectBase();
		privateKey = random(1, m);
		return privateKey;
	}

	function createPublicKey() {
		i = 1;
		base = point.Point(0, 1);
		publicKey = base;
		while (i < privateKey) {
			publicKey = add(publicKey, base);
			i++;
		}

		return publicKey;
	}

	function createSecretKey(publicKey) {
		i = 1;
		secretKey = publicKey;

		while (i < privateKey) {
			secretKey = add(secretKey, publicKey);
			i++;
		}

		return secretKey;
	}

	return {
		createPublicKey: createPublicKey,
		createPrivateKey: createPrivateKey,
		createSecretKey: createSecretKey,
		modInverse : modInverse
	}
}
