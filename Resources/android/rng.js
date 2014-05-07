function RC4(seed) {
    this.s = new Array(256);
    this.i = 0;
    this.j = 0;
    for (var i = 0; 256 > i; i++) this.s[i] = i;
    seed && this.mix(seed);
}

function RNG(seed) {
    if (null == seed) seed = (Math.random() + Date.now()).toString(); else if ("function" == typeof seed) {
        this.uniform = seed;
        this.nextByte = function() {
            return ~~(256 * this.uniform());
        };
        seed = null;
    } else "[object String]" !== Object.prototype.toString.call(seed) && (seed = JSON.stringify(seed));
    this._normal = null;
    this._state = seed ? new RC4(seed) : null;
}

RC4.getStringBytes = function(string) {
    var output = [];
    for (var i = 0; string.length > i; i++) {
        var c = string.charCodeAt(i);
        var bytes = [];
        do {
            bytes.push(255 & c);
            c >>= 8;
        } while (c > 0);
        output = output.concat(bytes.reverse());
    }
    return output;
};

RC4.prototype._swap = function(i, j) {
    var tmp = this.s[i];
    this.s[i] = this.s[j];
    this.s[j] = tmp;
};

RC4.prototype.mix = function(seed) {
    var input = RC4.getStringBytes(seed);
    var j = 0;
    for (var i = 0; this.s.length > i; i++) {
        j += this.s[i] + input[i % input.length];
        j %= 256;
        this._swap(i, j);
    }
};

RC4.prototype.next = function() {
    this.i = (this.i + 1) % 256;
    this.j = (this.j + this.s[this.i]) % 256;
    this._swap(this.i, this.j);
    return this.s[(this.s[this.i] + this.s[this.j]) % 256];
};

RNG.prototype.nextByte = function() {
    return this._state.next();
};

RNG.prototype.uniform = function() {
    var BYTES = 7;
    var output = 0;
    for (var i = 0; BYTES > i; i++) {
        output *= 256;
        output += this.nextByte();
    }
    return output / (Math.pow(2, 8 * BYTES) - 1);
};

RNG.prototype.random = function(n, m) {
    if (null == n) return this.uniform();
    if (null == m) {
        m = n;
        n = 0;
    }
    return n + Math.floor(this.uniform() * (m - n));
};

RNG.prototype.normal = function() {
    if (null !== this._normal) {
        var n = this._normal;
        this._normal = null;
        return n;
    }
    var x = this.uniform() || Math.pow(2, -53);
    var y = this.uniform();
    this._normal = Math.sqrt(-2 * Math.log(x)) * Math.sin(2 * Math.PI * y);
    return Math.sqrt(-2 * Math.log(x)) * Math.cos(2 * Math.PI * y);
};

RNG.prototype.exponential = function() {
    return -Math.log(this.uniform() || Math.pow(2, -53));
};

RNG.prototype.poisson = function(mean) {
    var L = Math.exp(-(mean || 1));
    var k = 0, p = 1;
    do {
        k++;
        p *= this.uniform();
    } while (p > L);
    return k - 1;
};

RNG.prototype.gamma = function(a) {
    var d = (1 > a ? 1 + a : a) - 1 / 3;
    var c = 1 / Math.sqrt(9 * d);
    do {
        do {
            var x = this.normal();
            var v = Math.pow(c * x + 1, 3);
        } while (0 >= v);
        var u = this.uniform();
        var x2 = Math.pow(x, 2);
    } while (u >= 1 - .0331 * x2 * x2 && Math.log(u) >= .5 * x2 + d * (1 - v + Math.log(v)));
    return 1 > a ? d * v * Math.exp(this.exponential() / -a) : d * v;
};

RNG.roller = function(expr, rng) {
    var parts = expr.split(/(\d+)?d(\d+)([+-]\d+)?/).slice(1);
    var dice = parseFloat(parts[0]) || 1;
    var sides = parseFloat(parts[1]);
    var mod = parseFloat(parts[2]) || 0;
    rng = rng || new RNG();
    return function() {
        var total = dice + mod;
        for (var i = 0; dice > i; i++) total += rng.random(sides);
        return total;
    };
};

RNG.$ = new RNG();