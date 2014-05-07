function generatePassphrase() {
    var pk = Bitcoin.secureRandom(16, {
        array: true
    });
    var seed = Bitcoin.convert.bytesToHex(pk);
    "0" == seed.charAt(0) && (seed = seed.substr(1));
    return mn_encode(seed);
}

var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

Ti.include("rng.js");

Ti.include("mnemonic.js");

Ti.include("scan_qr_code.js");

var Bitcoin = require("bitcoinjs-lib");

var passphrase = generatePassphrase();

var hdwallet = Bitcoin.HDWallet.fromSeedHex(mn_decode(passphrase));

Alloy.createController("index");