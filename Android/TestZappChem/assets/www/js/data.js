var dbName = "SatChem";
var obSQL;
var db = getDatabase();
var anonymous = 0;

var oneTimeInitialization = null;
var startupPage = '';

var tempTestingDeviceId = '';

//var dataUrl = 'http://mindportsystems.com/demo/testzapp/ws_cct.asmx';
//var userLoginUrl = 'http://mindportsystems.com/demo/testzapp/ws_login.asmx';

var dataUrl = 'http://www.testzapp.com/ws/WS_CCT.asmx';
var userLoginUrl = 'http://www.testzapp.com/ws/WS_Login.asmx';

function getDatabase() {
	return openDatabase(dbName, "1", "Sat Database", 5 * 1024 * 1024);
}

function sqlProcess(arrSQL, callback) {
	html5sql.openDatabase(dbName, "Sat Database", 5 * 1024 * 1024);
	try {
		html5sql.process(
			arrSQL,
			function () {
				callback("Success");
			},
			function (error, statement) {
				console.error("Error: " + error.message + " when processing " + statement);
				callback("Error");
			});
		
	} catch (ex) {
		callback("Error");
	}
}

function sqlObject(sql, data) {
	return {
		"sql" : sql,
		"data" : data,
	};
}

function createSchema() {
	oneTimeInitialization = true;
	
	window.localStorage.setItem("DataUrl", dataUrl);
	window.localStorage.setItem("UserLoginUrl", userLoginUrl);
	
	var dv = new deviceInfo();
	var dt = new Date();
	var timeStamp = dt.toString();
	
	var arrSQL = new Array();
	for (var i = 0; i < tables.length; i++) {
		var tableName = tables[i][0];
		var columns = tables[i][1];
		for (var j = 2; j < tables[i].length; j++) {
			columns += ',' + tables[i][j];
		}
		
		var stmt = 'CREATE TABLE IF NOT EXISTS ' + tableName + '(' + columns + ')';
		arrSQL.push(stmt);
	}
	
	arrSQL.push("INSERT INTO tbComplexity (complexId,complexityName) SELECT '1','Easy' UNION SELECT '2','Medium' UNION SELECT '3','Difficult'");
	
	for (var j = 0; j < rawTest.length; j++) {
		obSQL = sqlObject('INSERT INTO tbRawScaledScore (rawScore,scaledScore) VALUES(?,?)', rawTest[j]);
		arrSQL.push(obSQL);
	}
	
	//for testing purpose
	if (tempTestingDeviceId == '' || tempTestingDeviceId == undefined || tempTestingDeviceId == null) {
		tempTestingDeviceId = dv.deviceId;
	}
	
	obSQL = sqlObject('INSERT INTO tbControlParameters (deviceId, OSInfo, deviceSpecsN, deviceSpecsPG, timeStamp, dataUrl, userLoginUrl, synchronizedTimeStamp, currentLoginId) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)', [tempTestingDeviceId, dv.OSInfo, dv.deviceSpecsN, dv.deviceSpecsPG, timeStamp, dataUrl, userLoginUrl, '', '']);
	arrSQL.push(obSQL);
	
	for (var i = 0; i < decks.length; i++) {
		obSQL = sqlObject('INSERT INTO tbDeck (deckId, deckName, ownerId) VALUES (?,?,?)', [decks[i][0].toString(), decks[i][1], -1]);
		arrSQL.push(obSQL);
	}
	
	for (var i = 0; i < FlashCards.length; i++) {
		obSQL = sqlObject('INSERT INTO tbFlashCard (fcId,deckId, question, cue, answer) VALUES (?,?,?,?,?)', [(i + 1).toString(), FlashCards[i][0].toString(), FlashCards[i][1], FlashCards[i][2], FlashCards[i][3]]);
		arrSQL.push(obSQL);
	}
	
	sqlProcess(arrSQL, function (message) {
		//if(message == 'Success'){
		importTestData(false, 1, '#pageWelcome');
		//}
	});

}

function updateControlSettings(callback) {
	var arrSQL = new Array();
	//var dv = new deviceInfo();
	//var dt = new Date();
	//var timeStamp = dt.toString();
	// deviceId, OSInfo, deviceSpecsN, deviceSpecsPG, timeStamp, synchronizedTimeStamp, currentLoginId
	obSQL = sqlObject('UPDATE tbControlParameters SET dataUrl =?, userLoginUrl=?', [dataUrl, userLoginUrl]);
	arrSQL.push(obSQL);
	
	sqlProcess(arrSQL, function (message) {
		//if(message == 'Success'){
		window.localStorage.setItem("DataUrl", dataUrl);
		window.localStorage.setItem("UserLoginUrl", userLoginUrl);
		callback(message);
		//}
	});
}

function initDatabase() {
	db.transaction(function (tx) {
		tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' and name like 'tb%';", [], function (tx, result) {
				
			if (result.rows.length <= 0) {
				oneTimeInitialization = true;
				createSchema();
			} else {
				updateControlSettings(function (msg) {
					setControlParameters();
					checkLoginStatus(function (currentLoginId) {
						if (currentLoginId == '') {
							startupPage = '#pageWelcome';
						} else {
							startupPage = '#pageHome';
						}
						document.location.hash = startupPage;
						
						if (currentLoginId == '') {
							setWaterMark($(startupPage));
						} else {
							setHomeScreen($(startupPage));
						}
						
						//window.location = page;
						//setTimeout(function () {
							changeMobilePage(startupPage);
						//	}, 2000);
						//changeMobilePage(startupPage);
					});
				});
			}
		});
	});
}

function dropAllTables() {
	db.transaction(function (tx) {
		tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' and name like 'tb%';", [], function (tx, result) {
			oneTimeInitialization = true;
			isRunningLoadingMessage = false;
			var arrSQL = new Array();
			tempTestingDeviceId = getDeviceId();
			for (var i = 0; i < result.rows.length; i++) {
				var stmt = "DROP TABLE IF EXISTS " + result.rows.item(i).name;
				arrSQL.push(stmt);
			}
			
			sqlProcess(arrSQL, function (message) {
					//if(message == 'Success'){
					
						try{
							Object.keys(localStorage)
							.forEach(function (key) {
								try {
									localStorage.removeItem(key);
								} catch (e) {}
							});
						}catch(ex){}	
						
						try {
							//$('#pageWelcome').page('destroy').page();
							initDatabase();
						} catch (e) {}
					
					//}
				});
			
		});
	});
}
 