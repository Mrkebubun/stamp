function Controller() {
    function scanQRCode() {
        doScan();
    }
    function processQRRequest(data) {
        Ti.API.info("SENDING " + data);
        var params = data.split("|");
        if (3 > params.length) {
            alert("Not a valid Stamp QR Code.");
            return;
        }
        cmd = params[0];
        service = params[1];
        post_back = params[2];
        var send_params = {};
        send_params["service"] = "Stamp";
        send_params["user"] = "980190962";
        for (var i = 3; params.length > i; i += 2) params.length > i + 1 && (send_params[params[i]] = params[i + 1]);
        if ("mpk" === cmd) {
            Ti.API.info("MPK Reuqest");
            var hd = hdwallet.derive(hashCode(service));
            send_params["mpk"] = hd.toBase58();
            post_data(post_back, send_params);
        }
    }
    function post_data(url, send_params) {
        var request = Titanium.Network.createHTTPClient();
        request.onerror = function(e) {
            Ti.API.info("IN ERROR " + e.error);
        };
        request.onload = function() {
            Titanium.API.info(this.responseText);
            alert(this.responseText);
        };
        request.onsendstream = function(e) {
            Ti.API.info("ONSENDSTREAM - PROGRESS: " + e.progress);
        };
        request.open("POST", url);
        Ti.API.info(send_params);
        request.send(send_params);
    }
    function hashCode(str) {
        var i, chr, len, hash = 0;
        if (0 == str.length) return hash;
        for (i = 0, len = str.length; len > i; i++) {
            chr = str.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0;
        }
        return hash;
    }
    function doScan() {
        var qrreader = require("com.acktie.mobile.android.qr");
        qrCodeWindow = Titanium.UI.createWindow({
            navBarHidden: true,
            exitOnClose: false,
            backgroundColor: "black",
            width: "100%",
            height: "100%"
        });
        var qrCodeView = null;
        var success = function(data) {
            if (void 0 != data && void 0 != data.data) {
                Titanium.Media.vibrate();
                alert("data: " + data.data);
                qrCodeView.stop();
                qrCodeWindow.close();
                processQRRequest(data.data);
            }
        };
        var options = {
            backgroundColor: "black",
            width: "100%",
            height: "90%",
            top: 0,
            left: 0,
            success: success,
            cancel: cancel
        };
        qrCodeView = qrreader.createQRCodeView(options);
        var closeButton = Titanium.UI.createButton({
            title: "close",
            bottom: 0,
            left: 0
        });
        var lightToggle = Ti.UI.createSwitch({
            value: false,
            bottom: 0,
            right: 0
        });
        closeButton.addEventListener("click", function() {
            qrCodeView.stop();
            qrCodeWindow.close();
        });
        lightToggle.addEventListener("change", function(event) {
            event.value ? qrCodeView.turnLightOn() : qrCodeView.turnLightOff();
        });
        qrCodeWindow.add(qrCodeView);
        qrCodeWindow.add(closeButton);
        true && (void 0 === options.useFrontCamera || void 0 != options.useFrontCamera && !options.useFrontCamera) && qrCodeWindow.add(lightToggle);
        qrCodeWindow.open();
    }
    function cancel() {}
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.stampButton = Ti.UI.createButton({
        textAlign: "center",
        borderRadius: "25px",
        boxShadow: "2px 2px 4px rgba(0,0,0,0.4)",
        background: "linear-gradient(top,  #e51d16 0%,#b21203 100%)",
        id: "stampButton",
        title: "Stamp !",
        top: "10",
        width: "50%",
        height: "20%"
    });
    $.__views.index.add($.__views.stampButton);
    scanQRCode ? $.__views.stampButton.addEventListener("click", scanQRCode) : __defers["$.__views.stampButton!click!scanQRCode"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    __defers["$.__views.stampButton!click!scanQRCode"] && $.__views.stampButton.addEventListener("click", scanQRCode);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;