var QRSCANNER = function(my) {
    my.scan_qr_code = function(success, cancel) {
        var qrreader = require("com.acktie.mobile.android.qr");
        var options = {
            backgroundColor: "black",
            width: "100%",
            height: "90%",
            top: 0,
            left: 0,
            success: success,
            cancel: cancel
        };
        qrCodeWindow = Titanium.UI.createWindow({
            navBarHidden: true,
            exitOnClose: false,
            backgroundColor: "black",
            width: "100%",
            height: "100%"
        });
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
        qrCodeWindow.open({
            modal: true
        });
    };
    return my;
}(QRSCANNER || {});