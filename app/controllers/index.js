function scanQRCode(e) {
	
	doScan();
	
	//processQRRequest('mpk|onchain.io|http://192.168.178.29:3000/external_mpk|user|980190962');
	//processQRRequest('sign|345678|sdfsdgdfgdffdsdsfsffssdfsdfsdfsfweewrsfsdsfsdfsdf');
	//processQRRequest('mpk|onchain.io|https://www.onchain.io/signing/324567/');
}

function processQRRequest(data) {
	Ti.API.info('SENDING ' + data);
	
	var params = data.split('|');
	if(params.length < 3) {
		alert("Not a valid Stamp QR Code.");
		return;
	}
	cmd = params[0];
	service = params[1];
	post_back = params[2];
	
	var send_params = {};
	send_params['service'] = 'Stamp';
	send_params['user'] = '980190962';
	
	for(var i = 3; i < params.length; i+=2) {
		if((i + 1) < params.length) {
			send_params[params[i]] = params[i + 1];
		}
	}
	
	if(cmd === 'mpk') {
	Ti.API.info('MPK Reuqest');
		var hd = hdwallet.derive(hashCode(service));
		send_params['mpk'] = hd.toBase58();
		post_data(post_back, send_params);
	}
}


// Generate a master key for a particular
// service provider.	
function doMasterKeyRequest(service_name) {
}

function post_data(url, send_params) {
	var request = Titanium.Network.createHTTPClient();
 
	request.onerror = function(e)
	{
	    Ti.API.info('IN ERROR ' + e.error);
	};
	//request.setTimeout(20000);
	request.onload = function(e)
	{
	    Titanium.API.info(this.responseText);
	    alert(this.responseText);
	};
	request.onsendstream = function(e)
	{
	    //ind.value = e.progress ;
	    Ti.API.info('ONSENDSTREAM - PROGRESS: ' + e.progress);
	};
	request.open("POST", url);
	Ti.API.info(send_params);
	request.send(send_params);
}

function hashCode(str) {
  var hash = 0, i, chr, len;
  if (str.length == 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

	
function doScan() {
	
	var qrreader = require('com.acktie.mobile.android.qr');
		
	qrCodeWindow = Titanium.UI.createWindow({
		navBarHidden: true,
		exitOnClose : false,
		backgroundColor : 'black',
		width : '100%',
		height : '100%',
	});
	
	var qrCodeView = null;
	
	var success = function(data) {
		if (data != undefined && data.data != undefined) {
			Titanium.Media.vibrate();
			alert('data: ' + data.data);
			
			qrCodeView.stop();
			qrCodeWindow.close();	
			processQRRequest(data.data);
		}
	};

	var options = {
		backgroundColor : 'black',
		width : '100%',
		height : '90%',
		top : 0,
		left : 0,
		success : success,
		cancel : cancel
	};
	qrCodeView = qrreader.createQRCodeView(options);

	var closeButton = Titanium.UI.createButton({
		title : "close",
		bottom : 0,
		left : 0
	});
	var lightToggle = Ti.UI.createSwitch({
		value : false,
		bottom : 0,
		right : 0
	});

	closeButton.addEventListener('click', function() {
		qrCodeView.stop();
		qrCodeWindow.close();
	});

	lightToggle.addEventListener('change', function(event) {
		if (event.value) {
			qrCodeView.turnLightOn();
		} else {
			qrCodeView.turnLightOff();
		}
	});

	qrCodeWindow.add(qrCodeView);
	qrCodeWindow.add(closeButton);

	if (Ti.Platform.osname !== 'ipad' && (options.useFrontCamera === undefined || (options.useFrontCamera != undefined && !options.useFrontCamera))) {
		qrCodeWindow.add(lightToggle);
	}

	// NOTE: Do not make the window Modal for android.  It screws stuff up.  Not sure why
	if (Ti.Platform.osname !== 'android') {
		qrCodeWindow.open({modal:true});
	}
	else
	{
		qrCodeWindow.open();
	}
}
function cancel() {
};

// Only used with scanning from photo gallery
function error() {
	alert("error");
};

$.index.open();
