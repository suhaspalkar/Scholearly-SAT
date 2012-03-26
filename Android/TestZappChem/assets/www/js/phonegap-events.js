function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

// PhoneGap is loaded and it is now safe to make calls PhoneGap methods
//
function onDeviceReady() {
    document.addEventListener("offline", onOffline, false);
    document.addEventListener("online", onOnline, false);
    document.addEventListener("pause", onPause, false);
    document.addEventListener("backbutton", onBack, false);
    initDatabase();
}

//Handle the offline event
//
function onOffline() {
	navigator.onLine = false;
}
// Handle the online event
//
function onOnline() {
	navigator.onLine = true;
}

//Handle the pause event
//
function onPause() {
	//importQOTD();
}

//Handle the pause event
//
function onBack() {
	try{
		if(isHomeScreen)
		{
			//device.exitApp();
			
			//To exit the application:
			navigator.app.exitApp();

				//To use the back button:
			navigator.app.backHistory();
		}else{
			navigator.app.backHistory();
			
			//goBack(pageName);
		}
	}catch(exception){}
}

function check_network() {
    var networkState = navigator.network.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';

    confirm('Connection type:\n ' + states[networkState]);
}