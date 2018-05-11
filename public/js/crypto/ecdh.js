function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

Point = function (_x, _y) {
	x = _x;
	y = _y;
	inf = false;

	return {
		x: x,
		y: y,
		inf: inf
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
		if (p.x == q.x && p.y == q.y) {
		  return doublePoint(p);
		}

		if (p.inf && q.inf) { // point in infinite
			point = Point(0, 0);
			point.inf = true;
			return point;
		}
		else if (p.inf) {
			return q;
		}
		else if(q.inf) {
			return p;
		}

		if (p.x == q.x) {
			point = Point(0, 0);
			point.inf = true;
			return point;
		}

		// if (p.x == 0 && p.y == 0 && q.x == 0 && q.y == 0){
	 //      return Point(0, 0);
	 //    }
	    // if (p.x == 0 && p.y == 0) {
	    //   return q;
	    // }

	    // if (q.x == 0 && q.y == 0) {
	    //   return p;
	    // }

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

	function times(a, p) {
	    if (a == 0) {
	      return Point(0, 0);
	    }
	    else if (a == 1) {
	      return p;
	    }
	    else if (mod(a, 2) == 0) {
	      return times(a / 2, doublePoint(p));
	    }
	    else {
	      return add(times(a - 1, p), p);
	    }
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
		publicKey = times(_privateKey, base);

		// while (i < _privateKey) {
		// 	publicKey = add(publicKey, base);
		// 	i++;
		// }

		// if (publicKey.y == 0) {
		// 	publicKey = add(publicKey, base);
		// }

		return publicKey;
	}

	function createSecretKey(_privateKey, _publicKey) {
		var i = 1;
		secretKey = times(_privateKey, _publicKey);

		// while (i < _privateKey) {
		// 	secretKey = add(secretKey, _publicKey);
		// 	i++;
		// }

		return secretKey;
	}

	return {
		createPublicKey: createPublicKey,
		createPrivateKey: createPrivateKey,
		createSecretKey: createSecretKey,
	}
}