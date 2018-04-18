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

ECDH = function () {
	var a = 91, b = 49, m = 105943, base, privateKey, publicKey, secretKey;


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
	}

	function mod(x, n) {
		return (x % n + n) % n;
	}

	function modInverse(a, _m) {
		a = mod(a, _m);
		for (i = 1; i < m; i++) {
			if (mod((a * i), _m) == 1) {
				return i;
			}
		}
	}

	function add(p, q) {
		if (p.x == q.x && p.y == q.y) {
			return doublePoint(p);
		}

		gradien = mod((p.y - q.y) * modInverse(p.x - q.x, m), m);
		r = Point(0, 0);
		r.x = mod(Math.pow(gradien, 2) - p.x - q.x, m);
		r.y = mod(gradien * (p.x - r.x) - p.y, m);
		// console.log(r.x);
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
		selectBase();
		privateKey = getRandomInt(1, m);
		return privateKey;
	}

	function createPublicKey() {
		i = 1;
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
	}
}