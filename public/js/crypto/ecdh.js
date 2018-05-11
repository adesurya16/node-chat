function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

Point = function (_x, _y) {
	x = _x;
	y = _y;

	return {
		x: x,
		y: y
	};
}

ECDH = function (_a = 91, _b = 79, __m = 911, private_key) {
	var a = parseInt(_a), b = parseInt(_b), m = parseInt(__m), publicKey, secretKey;

	function selectBase() {
		base = Point(0, 0);
		found = false;
		x = 0;
		y = 0;

		while (!found && x < m) {
			y = Math.pow(x, 3) + a * x + b;

			if (Number.isInteger(Math.sqrt(y))) {
				found = true;
			}

			x++;
		}

		base.x = x;
		base.y = y;

		return base;
	}

	function mod(x, n) {
		return (x % n + n) % n;
	}

	function modInverse(a, _m) {
		a = mod(a, _m);
		for (i = 1; i < _m; i++) {
			if (mod((a * i), _m) == 1) {
				return i;
			}
		}
	}

	function add(p, q) {
		// if (p.x == q.x && p.y == q.y) {
		//   return doublePoint(p);
		// }

		if (p.x == q.x) { // point in infinite
			return Point(0, 0);
		}

		gradien = mod((p.y - q.y) * modInverse(p.x - q.x, m), m);
		r = Point(0, 0);
		r.x = mod(Math.pow(gradien, 2) - p.x - q.x, m);
		r.y = mod(gradien * (p.x - r.x) - p.y, m);

		return r;
	}

	function minus(p, q) {
		newQ = Point(0, 0);
		newQ.x = q.x;
		newQ.y = mod((q.y * -1), m);

		r = add(p, newQ);

		return r;
	}

	function doublePoint(p) {
		gradien = mod(((3 * p.x * p.x + a) * modInverse(2 * p.y, m)), m);
		r = Point(0, 0);
		r.x = mod((Math.pow(gradien, 2) - 2 * p.x), m);
		r.y = mod((gradien * (p.x - r.x) - p.y), m);

		return r;
	}

	function createPrivateKey() {
		if(private_key){
			return parseInt(private_key);
		} else {
			privateKey = getRandomInt(1, m);
			return privateKey;
		}
	}

	function createPublicKey(_privateKey) {
		var i = 1;
		base = selectBase();
		publicKey = base;

		while (i < _privateKey) {
			publicKey = add(publicKey, base);
			i++;
		}

		if (publicKey.y == 0) {
			publicKey = add(publicKey, base);
		}

		return publicKey;
	}

	function createSecretKey(_privateKey, _publicKey) {
		var i = 1;
		secretKey = _publicKey;

		while (i < _privateKey) {
			secretKey = add(secretKey, _publicKey);
			i++;
		}

		if (secretKey.y == 0) {
			secretKey = add(secretKey, _publicKey);
		}

		return secretKey;
	}

	return {
		createPublicKey: createPublicKey,
		createPrivateKey: createPrivateKey,
		createSecretKey: createSecretKey,
	}
}