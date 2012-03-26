var deviceInfo = function() {
    this.deviceId = null;
    this.OSInfo = null;
    this.deviceSpecsPG = null;
    this.deviceSpecsN = null;
    try {
        if (typeof device === "undefined") {
            this.deviceId = createUUID();
			var dName = UUIDcreatePart(4);
            this.OSInfo = '{"OS":"' + navigator.platform + '","version":"5.1"}';
            this.deviceSpecsPG = '{"deviceName":"Device-' + dName + '","PhoneGap":"No"}';
        } else {
            this.deviceId = device.uuid;
            this.OSInfo = '{"OS":"' + device.platform + '","version":"' + device.version + '"}';
            this.deviceSpecsPG = '{"deviceName":"' + device.name + '","PhoneGap":"' + device.phonegap + '"}';
        }

        this.deviceSpecsN = '{"browserCodeName":"' + navigator.appCodeName + '","browserName":"' + navigator.appName + '","browserVersion":"' + navigator.appVersion + '","platform":"' + navigator.platform + '","user-agent":"' + navigator.userAgent + '","availWidth":"' + screen.availWidth + '","availHeight":"' + screen.availHeight + '","width":"' + screen.width + '","height":"' + screen.height + '","colorDepth":"' + screen.colorDepth + '","pixelDepth":"' + screen.pixelDepth + '"}';
    }
    catch (e) {
        // TODO: 
    }


}

function createUUID() {
    return UUIDcreatePart(4) + '-' +
		UUIDcreatePart(2) + '-' +
		UUIDcreatePart(2) + '-' +
		UUIDcreatePart(2) + '-' +
		UUIDcreatePart(6);
};

function UUIDcreatePart(length) {
    var uuidpart = "";
    for (var i = 0; i < length; i++) {
        var uuidchar = parseInt((Math.random() * 256)).toString(16);
        if (uuidchar.length == 1) {
            uuidchar = "0" + uuidchar;
        }
        uuidpart += uuidchar;
    }
    return uuidpart;
};