// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};
Ti.include('rng.js');
Ti.include('mnemonic.js');
Ti.include('scan_qr_code.js');
var Bitcoin = require('bitcoinjs-lib');

function generatePassphrase() {
    
    var pk = Bitcoin.secureRandom(16, {array: true});
    var seed = Bitcoin.convert.bytesToHex(pk);
    //nb! electrum doesn't handle trailing zeros very well
    // and we want to stay compatible.
    if (seed.charAt(0) == '0') seed = seed.substr(1);
    
    return mn_encode(seed);
}

var passphrase = generatePassphrase();
var hdwallet = Bitcoin.HDWallet.fromSeedHex(mn_decode(passphrase)); 