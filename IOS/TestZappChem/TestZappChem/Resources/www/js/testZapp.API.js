
var apiName = '';

function getDeviceIdInJson() {
    return '{"deviceId":"' + getDeviceId() + '"}';
}

function getDeviceInfoInJson(callback) {
    db.transaction(function(tx) {
        tx.executeSql('SELECT deviceId , timeStamp, OSInfo, deviceSpecsN , deviceSpecsPG FROM tbControlParameters', [],
		function(tx, result) {
		    if (result.rows.length > 0) {
		        var deviceInfoJson = JSON.stringify(result.rows.item(0)).replaceAll('\\', '').replaceAll('"{', '{').replaceAll('}"', '}');
		        callback(deviceInfoJson);
		    }
		});
    });
}

// --------------- Backup API ---------------
var arrjsonTestData =  new Array() ;
var arrjsonTestDataDetails =  new Array();

var jsonTestData = {};

function callBackupDataAPI(){
	if (networkState()) {
		var userId = getUserId();
		db = getDatabase();

		arrjsonTestData = new Array();
		arrjsonTestDataDetails =  new Array();

		db.transaction(function(tx) {
			tx.executeSql('SELECT paperId, testId, complexId, paperStartDateTime, score, mode, paperStatus, paperEndDateTime, finishTime, pauseTime, pausedOn, solvedQuestions, completedPercentage, "tbQuestionPaper" AS tbQuestionPaper FROM tbPaper WHERE userId=?', [userId],
			function(tx, result) {
				if (result.rows.length >0){
					showLoader("Please wait...");
					for (var i = 0; i < result.rows.length; i++) {
						paper = result.rows.item(i);
						paperDetailsJSON(paper);
					}
				}
				else{
					 $().toastmessage('showNoticeToast', 'Please solve the test and try again later.');
				}
			})
		});
	}
}

function paperDetailsJSON(paper) {
	arrjsonTestData.push(paper);
    db.transaction(function(tx) {
        tx.executeSql('SELECT uId, srNo, qno, answerStatus, timeTaken, submittedAnswer FROM tbQuestionPaper WHERE paperId=?'
		, [paper.paperId], function(tx, result) {
 			var jsonTemp = new Array();
		    for (var i = 0; i < result.rows.length; i++) {
				jsonTemp.push(result.rows.item(i));
		    }

			arrjsonTestDataDetails.push(jsonTemp);
			
			var strPaper = JSON.stringify(arrjsonTestData);
			jsonTestData  = JSON.parse(strPaper);
			
		    if (jsonTestData.length == arrjsonTestDataDetails.length) {
		        var jsonStr = '';
		        for (var j = 0; j < arrjsonTestData.length; j++) {
					jsonTestData[j].tbQuestionPaper =  arrjsonTestDataDetails[j];
 		        }

				flashCardDataJSON();
		    }
			
		});
    });
}

function flashCardDataJSON() {
    var userId = getUserId();
    var deviceId = getDeviceId();
    var dataUrl = getDataUrl();
    var password = getPassword();
    getFlashCardDataInJson("SELECT d.* FROM tbDeck d INNER JOIN tbUserDeck ud ON d.deckId = ud.deckId Where ud.UserId =? order by d.deckId", userId, function(decks) {
        getFlashCardDataInJson("SELECT fc.* FROM tbFlashCard fc INNER JOIN tbFCStatus fs ON fc.fcid=fs.fcid Where fs.ownerId = ? order by fc.deckId", userId, function(flashCards) {
            getFlashCardDataInJson("SELECT * from tbUserDeck WHERE userID = ? order by deckId", userId, function(userDecks) {
                getFlashCardDataInJson("SELECT * from tbFCStatus WHERE OwnerId = ? order by fcid", userId, function(fcStatus) {
					
					var finalJSON = {
						Root:{
							deviceId      : deviceId,
							userId        : userId,
							testData      : jsonTestData,
							flashCardData :{
								tbDeck       :decks,
								tbUserDeck   :userDecks,
								tbFlashCard  :flashCards,
								tbFCStatus   :fcStatus
							}
						}
					}
 					//console.log(JSON.stringify(finalJSON));
					backupDataAPI(finalJSON);
					
                 });
            });
        });
    });
}

function getFlashCardDataInJson(query, param, callback) {
    db.transaction(function(tx) {
        tx.executeSql(query, [param],
		function(tx, result) {
		    var flashCardData = new Array();
		    for (var i = 0; i < result.rows.length; i++) {
				flashCardData.push(result.rows.item(i));
		    }
		    callback(flashCardData);
		});
    });
}

function backupDataAPI(jsonData) {
	var dataUrl = getDataUrl();
	var userId = getUserId();
	var password = getPassword();
	var deviceId = getDeviceId();
	var paramJson = JSON.stringify(jsonData);
	var pmDate = new Date();
	var backUpDate = pmDate.format('M d Y h:m:sA');

	//console.log(paramJson);
	
	$.ajax({
		type: 'POST',
		url: dataUrl + '/backupData',
		data: { 'userId': userId, 'password': password,'deviceId':deviceId, 'backUpDate':backUpDate, 'json': paramJson , 'Version':1  },
		success: function(data, text, xhqr) {
			hideLoader();
			var xmlData = $(data).find("string").text();
			var msgs = xmlData.split(':');

			if (msgs[0] == '0') { // 0:Record save sucesessfully.
			   $().toastmessage('showNoticeToast', 'Backup done successfully.');
			}
			else {
			   $().toastmessage('showNoticeToast', 'Error occurred.<br>Please try again later.');
			}
			
		},
		error: function(xhqr, textStatus, errorThrown) {
			hideLoader();
			toastServerError();
		}
	});
}

// --------------- Backup API ---------------

 
// --------------- backupList API ---------------

function callBackupListAPI(){
	if (networkState()) {
		var userId = getUserId();
		var deviceId = getDeviceId();
		var dataUrl = getDataUrl();
		var password = getPassword();	
		showLoader("Please wait...");
		$.ajax({
			type: 'POST',
			url: dataUrl + '/backupList',
			data: { 'userId': userId, 'password': password, 'deviceId': deviceId, 'Version':1 },
			cache: false,
			success: function(data, text, xhqr) {
				hideLoader();
				var xmlData = $(data).find("string").text();
				try{
					var jsonData = $.parseJSON(xmlData); 
					
					if(jsonData.Root.BackUp != undefined){
						showBackupList(jsonData.Root.BackUp); //UI.js	
					}else {
						//restore data
						prepareDataBeforeSync(jsonData.Root);
					}
					
				}
				catch(e){
					hideLoader();
					var msgs = xmlData.split(':');
					if (msgs[0] == '-7'){
						$().toastmessage('showNoticeToast', 'No backup available.');
					}else{
						 $().toastmessage('showNoticeToast', 'Error occurred.<br>Please try again later.');
					}
				}
			},
			error: function(xhqr, textStatus, errorThrown) {
				hideLoader();
				toastServerError();
			}
		});
	}
}
 
// --------------- backupList API ---------------


// --------------- restoreData API ---------------
 
var arrRestoreSQL = new Array();

function callRestoreAPI(backupListItem){
	if (networkState()) {	
		var listItem = JSON.parse(backupListItem);
	 
		var userId = getUserId();
		var deviceId = getDeviceId();
		var dataUrl = getDataUrl();
		var password = getPassword();		
		
		showLoader( "Please wait...");
	  
		$.ajax({
			type: 'POST',
			url: dataUrl + '/restoreData',
			data: { 'userId': userId, 'password': password, 'deviceId': deviceId, 'backUpDate': listItem.DateTime , 'backupDeviceId': listItem.deviceId, 'Version':1 },
			cache: false,
			success: function(data, text, xhqr) {
				hideLoader();
				var xmlData = $(data).find("string").text();
				try{
					var jsonData = $.parseJSON(xmlData); 
					prepareDataBeforeSync(jsonData.Root); 			
				}catch(e){
					$().toastmessage('showNoticeToast', 'Error occurred.<br>Please try again later.');
				}
			},
			error: function(xhqr, textStatus, errorThrown) {
				hideLoader();
				toastServerError();
			}
		});
	}
}

function prepareDataBeforeSync(backupData){
    arrRestoreSQL = new Array();
    
    if (backupData.testData == null || backupData.testData == undefined ||backupData.testData ==''){
        try{
            showLoader("Please wait...");
            FlashCardDataStmt(backupData.flashCardData);
            sqlProcess(arrRestoreSQL,function(message){
                arrRestoreSQL = new Array();
                //if(message == 'Success'){
                    hideLoader();
                    getRemainingTest();
                //}
            });            
        }catch(ex){
			hideLoader();
		}
    }
	else{
		showLoader("Please wait...");
        try{
            preparePaperData(backupData.testData, function(){
                try{
                    FlashCardDataStmt(backupData.flashCardData);
                }catch(ex){
					hideLoader();
				}
				sqlProcess(arrRestoreSQL,function(message){
					arrRestoreSQL = new Array();
					//if(message == 'Success'){
						hideLoader();
						getRemainingTest();
					//}
				});  
            });
        }catch(ex){
			hideLoader();        
        }        
    }
}
	
function preparePaperData(papers , callback) {
    //check if it is an array
	
    var isArray = $.isArray(papers);
	var userId = getUserId() ;

	// test data delete statements
	obSQL = sqlObject('DELETE FROM tbQuestionPaper WHERE paperId in (select paperId from tbPaper WHERE userId = ?)', [userId]);
	arrRestoreSQL.push(obSQL);

	obSQL = sqlObject('DELETE FROM tbPaper WHERE userId = ?', [userId]);
	arrRestoreSQL.push(obSQL);
	
    if (isArray) {
        for (var i = 0; i < papers.length; i++) {
            var paper = papers[i];
            testDataStmt(paper);   
        }
    }
    else {
       testDataStmt(papers);
     }
	
	callback(true);
}


function testDataStmt(paper) {	
	// test data insert statements
	var testId = paper.testId ;
	
	var paperId = replaceNullUndefined(paper.paperId);
	var testId = paper.testId ;
	var userId = getUserId() ;
	 
	var paperStartDateTime = replaceNullUndefined(paper.paperStartDateTime);
	var paperEndDateTime = replaceNullUndefined(paper.paperEndDateTime);
	var complexId = paper.complexId * 1;
	var score = paper.score * 1;
	var finishTime = replaceNullUndefined(paper.finishTime) *1 ;
	var mode = replaceNullUndefined(paper.mode);
	var paperStatus = replaceNullUndefined(paper.paperStatus);
	var pauseTime = replaceNullUndefined(paper.pauseTime) * 1;
	var pausedOn = replaceNullUndefined(paper.pausedOn) * 1;
	var solvedQuestions = replaceNullUndefined(paper.solvedQuestions)*1;
	var completedPercentage = paper.completedPercentage *1;
	var strFields = "paperId ,testId ,userId ,paperStartDateTime,paperEndDateTime,complexId ,score ,finishTime ,mode ,paperStatus ,pauseTime,pausedOn ,solvedQuestions ,completedPercentage";
	var paperData = [paperId, testId, userId, paperStartDateTime, paperEndDateTime, complexId, score, finishTime, mode, paperStatus, pauseTime, pausedOn, solvedQuestions, completedPercentage];

	var strInsertQueMark = "?,?,?,?,?,?,?,?,?,?,?,?,?,?";

	obSQL = sqlObject('INSERT INTO tbPaper (' + strFields + ')  VALUES (' + strInsertQueMark + ')', paperData);
	arrRestoreSQL.push(obSQL);
	
	for (var i = 0; i < paper.tbQuestionPaper.length; i++) {
		var strFields = "uId,paperId,srNo,qno,answerStatus,timeTaken,submittedAnswer";
		var uId = paper.tbQuestionPaper[i].uId;
		var srNo = paper.tbQuestionPaper[i].srNo;
		var qno = paper.tbQuestionPaper[i].qno;
		var answerStatus = replaceNullUndefined(paper.tbQuestionPaper[i].answerStatus);
		var timeTaken = paper.tbQuestionPaper[i].timeTaken;
		var submittedAnswer = replaceNullUndefined(paper.tbQuestionPaper[i].submittedAnswer);

		var paperData = [uId, paperId, srNo, qno, answerStatus, timeTaken, submittedAnswer];
		var strInsertQueMark = "?,?,?,?,?,?,?";

		obSQL = sqlObject('INSERT INTO tbQuestionPaper (' + strFields + ')  VALUES (' + strInsertQueMark + ')', paperData);
		arrRestoreSQL.push(obSQL);
    }
	// test data insert statements
}

 
function FlashCardDataStmt(flashCardData){
	var userId = getUserId();
	
	var tbDeck = new Array();
	var tbFlashCard = flashCardData.tbFlashCard;
	var tbUserDeck = flashCardData.tbUserDeck;
	var tbFCStatus = flashCardData.tbFCStatus;
	
	var tbTempFlashCards = new Array();
	
	//find user's deck
	for(var i = 0 ; i < flashCardData.tbDeck.length; i++){
		var deck = flashCardData.tbDeck[i];
		if(deck.ownerId == userId){
			tbDeck.push(deck);
		}
	}
	
	//find user's flash cards
	for(var i = 0 ;i < tbFCStatus.length; i++){
		for(var j =0 ; j < tbFlashCard.length; j++){
			if(tbFCStatus[i].fcId == tbFlashCard[j].fcId){
				if(tbFCStatus[i].ownerId == userId){
					for(var k = 0; k < tbDeck.length; k++){
						if(tbFlashCard[j].deckId == tbDeck[k].deckId){
							tbTempFlashCards.push(tbFlashCard[j]);
						}
					}
				}
			}
		}
	}
	
	// flash cards delete statements
	obSQL = sqlObject('delete from tbUserDeck where userId=?', [userId]);
	arrRestoreSQL.push(obSQL);
	obSQL = sqlObject('delete from tbFCStatus where ownerId=?', [userId]);
	arrRestoreSQL.push(obSQL);
	obSQL = sqlObject('delete from tbFlashCard WHERE deckId in (SELECT deckId FROM tbDeck WHERE ownerId =?)', [userId]);
	arrRestoreSQL.push(obSQL);
	obSQL = sqlObject('delete from tbDeck where ownerId=?', [userId]);
	arrRestoreSQL.push(obSQL);
	// flash cards delete statements
	
	// flash cards insert statements
	for(var i = 0 ; i < tbDeck.length; i++){
		obSQL = sqlObject('INSERT INTO tbDeck (deckId, deckName, ownerId) VALUES (?,?,?)', 
		[tbDeck[i].deckId, tbDeck[i].deckName, tbDeck[i].ownerId]);
		arrRestoreSQL.push(obSQL);
	}
	for(var i = 0 ; i < tbTempFlashCards.length; i++){
		obSQL = sqlObject('INSERT INTO tbFlashCard (fcId,deckId, question, cue, answer) VALUES (?,?,?,?,?)', 
		[tbTempFlashCards[i].fcId,tbTempFlashCards[i].deckId, tbTempFlashCards[i].question, tbTempFlashCards[i].cue, tbTempFlashCards[i].answer]);
		arrRestoreSQL.push(obSQL);
	}	
	for(var i = 0 ; i < tbUserDeck.length; i++){
		obSQL = sqlObject('INSERT INTO tbUserDeck (deckId, userId, timeToView, pausedFCIndex) VALUES (?,?,?,?)', 
		[tbUserDeck[i].deckId, tbUserDeck[i].userId, tbUserDeck[i].timeToView, tbUserDeck[i].pausedFCIndex]);
		arrRestoreSQL.push(obSQL);
	}
	for(var i = 0 ; i < tbFCStatus.length; i++){
		obSQL = sqlObject('INSERT INTO tbFCStatus (fcId, ownerId, fcCount, isHidden) VALUES (?,?,?,?)', 
		[tbFCStatus[i].fcId, tbFCStatus[i].ownerId, tbFCStatus[i].fcCount, tbFCStatus[i].isHidden]);
		arrRestoreSQL.push(obSQL);
	}
	
	// flash cards delete statements
 
}

 

 

// --------------- restoreData API ---------------


// --------------- PendingTests API ---------------
 
function getRemainingTest() {
	getAvailableTest(userId, function(availTest) {
		var userId = getUserId();
		var deviceId = getDeviceId();
		var dataUrl = getDataUrl();
		var password = getPassword();
		showLoader("Please wait...");
		$.ajax({
			type: 'POST',
			url: dataUrl + '/getPendingTests',
			data: { 'userId': userId, 'password': password, 'testId': availTest, 'deviceId': deviceId ,'Version':1},
 
			cache: false,
			success: function(data, text, xhqr) {
				var xmlData = $(data).find("string").text();
				try{
					var jsonData = $.parseJSON(xmlData);
					apiName = "getPendingTests";
					xmlData = null;
					saveTestSet(jsonData.Root);
				}catch(e){
					hideLoader();
                    if(xmlData == '-7:No other test found.'){
						$().toastmessage('showNoticeToast', 'Data restored successfully.');
                    }else{
                        $().toastmessage('showNoticeToast', 'Error occurred.<br>Please try again later.');
                    }
               }
			},
			error: function(xhqr, textStatus, errorThrown) {
				hideLoader();
				if (textStatus == 'error' && errorThrown == 'Internal Server Error') {
					$().toastmessage('showNoticeToast', 'Server error occurred.<br>Please try again later.');
				} else {
					toastServerError();						
				}
			}
		});
	});
}

function getAvailableTest(userId, callback) {
    db = getDatabase();
    db.transaction(function(tx) {
        tx.executeSql('select testId from tbUserTests where userId=?', [userId],
		function(tx, result) {
		    var tests = "1";
		    for (var i = 0; i < result.rows.length; i++) {
		        var tempStr = result.rows.item(i).testId;
		        tests += "," + tempStr;
		    }
		    callback(tests);
		});
    });
}

function saveTestSet(jsonData) {
    //importtest.js
	apiName = "getPendingTests";
    fillArraysWithMasterData(function() {
		showLoader( "Retrieving...");
		arrTestSQL = new Array();
		cntTests = jsonData.length;
		if( cntTests == undefined || cntTests == null){
			hideLoader();
			$().toastmessage('showNoticeToast', 'Restore operation failed.<br>Please try again later.');
		}else{
			totalTests = 0;
			for (var i = 0; i < cntTests; i++) {
				(function(i) {
					var test = jsonData[i];
					parseJSON(test.TestSet); //import test .js
				})(i);
			};
		}
    });
}

// --------------- PendingTests API ---------------

// --------------- More Tests API ---------------
function getTestFromServer() {
//    if (networkState()) {
        var userId = getUserId();

        db.transaction(function(tx) {
            tx.executeSql('SELECT COUNT(t.testId)+1 AS nextTestId FROM tbTest t,tbUserTests u WHERE t.testId = u.testId AND t.testName <>? AND u.userId = ?'
			, ["QoD", userId], function(tx, result) {
			    var nextTestId = result.rows.item(0).nextTestId + 1;

			    if (nextTestId < 5) {
			        importTestData(true, nextTestId, '#pageMyTest');
			    } else {
			        $().toastmessage('showNoticeToast', 'No more test for download.', 3000);
			    }
			});
        })
//    }
}

// --------------- More Tests API ---------------

// --------------- getTest & QoD API ---------------
var examArr = new Array();
var subArr = new Array();
var topicArr = new Array();
var typeArr = new Array();
var testArr = new Array();
var userTest = new Array();
var quesArr = new Array();
var qotdArr = new Array();
var questionBankArr = new Array();
var arrTestSQL = new Array();

var testType = '';
var loadingPage;
var totalTests = 0;
var cntTests = 0;

function fillArraysWithMasterData(callback) {
    examArr = new Array();
    subArr = new Array();
    topicArr = new Array();
    typeArr = new Array();
    testArr = new Array();
    userTest = new Array();
    qotdArr = new Array();
    quesArr = new Array();
	questionBankArr = new Array();
    var db = getDatabase();
    db.transaction(function(tx) {
        tx.executeSql('select examId from tbExam', [], function(tx, result) {
            for (var i = 0; i < result.rows.length; i++) {
                examArr.push(result.rows.item(i).examId);
            }
            tx.executeSql('select subId from tbSubjects', [], function(tx, result) {
                for (var j = 0; j < result.rows.length; j++) {
                    subArr.push(result.rows.item(j).subId);
                }
                tx.executeSql('select topicId from tbTopics', [], function(tx, result) {
                    for (var k = 0; k < result.rows.length; k++) {
                        topicArr.push(result.rows.item(k).topicId);
                    }
                    tx.executeSql('select typeId from tbType', [], function(tx, result) {
                        for (var l = 0; l < result.rows.length; l++) {
                            typeArr.push(result.rows.item(l).typeId);
                        }
                        tx.executeSql('select testId from tbTest', [], function(tx, result) {
                            for (var m = 0; m < result.rows.length; m++) {
                                testArr.push(result.rows.item(m).testId);
                            }
                            tx.executeSql('select userId,testId from tbUserTests', [], function(tx, result) {

                                for (var n = 0; n < result.rows.length; n++) {
                                    var userTestRow = result.rows.item(n);
                                    var test_user = userTestRow.testId + '-' + userTestRow.userId;
                                    userTest.push(test_user);
                                }
								tx.executeSql('SELECT uId FROM tbQuestionBank', [], function(tx, result) {
									for (var p = 0; p < result.rows.length; p++) {
										var qbRow = result.rows.item(p);
										questionBankArr.push(qbRow.uId)
									}
									tx.executeSql('SELECT displayDate FROM tbQOTD', [], function(tx, result) {
										var o = 0;
										for (o = 0; o < result.rows.length; o++) {
											var qodRow = result.rows.item(o);
											//console.log(qodRow.displayDate);
											qotdArr.push(qodRow.displayDate);
										}
										if (o == result.rows.length) {
											callback(true);
										}
									}); 
								 
								});
                                
                            });
                        });
                    });
                });
            });
        });
    });
}

function importTestData(isWebAPI, maxTests, loaderPage) {
    var isFound = false;
    testType = 'test';
    loadingPage = loaderPage;
    var userId = getUserId();
    //console.log("userId = " + userId);
	
    fillArraysWithMasterData(function() {
		arrTestSQL = new Array();
        isFound = testArr.search(maxTests);
        if (isFound){
            var test_user = maxTests + '-' + userId;
            isFound = userTest.search(test_user);

            if (!isFound) {
                if (testName != 'QoD') {
                    userTest.push(test_user);
					getTestAPI( maxTests , true, false); // true to register test at server 
                }
            }
        }
        else {
			if (isWebAPI) {
				getTestAPI( maxTests , false, false);
			} else {
				apiName="";
				hideLoader();
				totalTests = 0;
				if(navigator.onLine){
					getTestAPI( maxTests , false , true);
				}else{
					localTest();
				}
			}
	}
    });
}

function localTest(){
	apiName="";
	hideLoader();
	totalTests = 0;
	parseJSON(testSample.Root);			
}

var tempPass = "!@#$%^&*()";

function getTestAPI(maxTests , onlyRegister , isAnonymous){
	if (networkState()) {
		var deviceId = getDeviceId();
		var dataUrl = getDataUrl();
		var password = (isAnonymous) ? tempPass  : getPassword();
		var userId = (isAnonymous) ? 0 : getUserId();
		$.ajax({
			type: 'POST', 
			url: dataUrl + '/getTest', 
			data: { 'userId': userId, 'password': password, 'deviceId': deviceId, 'testId': maxTests,'Version':1 },
			cache: false,
			beforeSend: function() { //Show spinner
				showLoader( "Retrieving...");
				$(loadingPage).find('#btnGetMoreTests').css("display", "none");
			},
			success: function(data, text, xhqr) {
				var xmlData = $(data).find("string").text();
				try{
					apiName = "getTest" ;
					totalTests = 0;
					if(onlyRegister){
						// true to register test at locally 
						registerTest(maxTests , userId);
					}else{
						var testJSONData = $.parseJSON(xmlData);
						parseJSON(testJSONData.Root);
					}		
				}catch(e){
					hideLoader();
					if(isAnonymous){
						$().toastmessage('showNoticeToast', 'Problem occurs in importing Test from server.<br>Trying to save local test data.');
						localTest();
					}else{
						$().toastmessage('showNoticeToast', 'Problem occurs in importing Test.');
						activateScreen();
					}
				}
			},
			error: function(xhqr, textStatus, errorThrown) {
				hideLoader();
				if(isAnonymous){
					$().toastmessage('showNoticeToast', 'Problem occurs in importing Test from server.<br>Trying to save local test data.');
					localTest();
				}else{
					toastServerError();
					activateScreen();
				}
			}
		});
	}
}

function registerTest(maxTests , userId){
	arrTestSQL = new Array();
	obSQL = sqlObject('INSERT INTO tbUserTests (userId, testId) VALUES (?, ?)', [userId, maxTests]);
	arrTestSQL.push( obSQL);
	
	sqlProcess(arrTestSQL, function(message){
		arrTestSQL = new Array();
		var db = getDatabase();
		db.transaction(function(tx) {
			 tx.executeSql('SELECT testId, testName, timeLimit FROM tbTest WHERE testId=?', [maxTests], function(tx, result) {
				
				var obTest = result.rows.item(0);
				activateScreen(obTest);
			 },
			 function(){
				hideLoader();
				$().toastmessage('showNoticeToast', 'Problem occurs in importing Test.');
				activateScreen();	
			 });
		});
	});	
				
 
}

function importQOTD(pageToNavigate) {
	if (networkState()) {
		testType = 'QoD';
		
		loadingPage = pageToNavigate;
		fillArraysWithMasterData(function() {
			var dt = new Date();
			var toDate = dt.format('Y-z-d');
			var fromDate = toDate;

			var dtCompare = toDate.replaceAll('/', '-');
			var isFound = qotdArr.search(dtCompare);
			//console.log('QoD Found?' + isFound);
			if (isFound) {
				showQoDPage();
			}
			else {
				var userId = getUserId();
				var deviceId = getDeviceId();
				var dataUrl = getDataUrl();
				var password = getPassword();
				
				if(loadingPage != undefined){
					showLoader( "Retrieving...");
				}

				$.ajax({
					type: 'POST',
					url: dataUrl + '/getQOD',  
					data: { 'userId': userId, 'password': password, 'deviceId': deviceId, 'fromDate': fromDate, 'toDate': toDate ,'Version':1},
					cache: false,
				   
					success: function(data, text, xhqr) {
						var xmlData = $(data).find("string").text();
									
						try{
							apiName =  "getQOD" ;
							totalTests = 0;
							arrTestSQL = new Array();
							var testJSONData = $.parseJSON(xmlData);
							parseJSON(testJSONData.Root);
						}catch(e){
							hideLoader();
							showQoDPage();
						}
					},
					error: function(xhqr, textStatus, errorThrown) {
						hideLoader();
						if(loadingPage != undefined){
							toastServerError();
						}
						showQoDPage();
					}
				});
			}
		});

	}	
}

function parseJSON(testJSONData) {
    (function(testJSONData) {
		totalTests++;
        var examId, exam, subId, subject, testId, testName, topicId, topicName, typeId, typeName , timeLimit;
		timeLimit = 3600;
        //isTestCompleted = false;
       
        $.each(testJSONData, function(key, item) {
            if (key == 'exam') {
                $.each(item, function(key, item) {
                    if (key == '@id') { examId = item * 1; }
                    if (key == '#text') { exam = item; }
                });

                var isFound = examArr.search(examId);
                if (!isFound) {
                    examArr.push(examId);
                    					
					obSQL = sqlObject('INSERT INTO tbExam (examId , examName) VALUES (?, ?)', [examId, exam]);
					arrTestSQL.push(obSQL);
					 
                }
            }
            if (key == 'subj') {
                $.each(item, function(key, item) {
                    if (key == '@id') { subId = item * 1; }
                    if (key == '#text') { subject = item; }

                });

                isFound = subArr.search(subId);
                if (!isFound) {
                    subArr.push(subId);
                    
					obSQL = sqlObject('INSERT INTO tbSubjects (subId , subjectName,examId) VALUES (?,?,?)', [subId, subject,examId]);
					arrTestSQL.push(obSQL);
                }
            }
            if (key == 'test') {
                $.each(item, function(key, item) {
                    if (key == '@id') { testId = item * 1; }
                    if (key == '#text') { testName = item; }
                });

                isFound = testArr.search(testId);
                if (!isFound) {
                    testArr.push(testId);
                    var isTrackable = (testName == 'QoD') ? 0 : 1;
					
					obSQL = sqlObject('INSERT INTO tbTest (testId, testName, timeLimit, isTrackable, isConfigurable) VALUES (?,?,?,?,?)', [testId, testName, timeLimit , isTrackable, 0]);
					
					arrTestSQL.push(obSQL);
                }
                var userId = getUserId();
                var test_user = testId + '-' + userId;
                isFound = userTest.search(test_user);

                if (!isFound) {
                    if (testName != 'QoD') {
                        userTest.push(test_user);
                        obSQL = sqlObject('INSERT INTO tbUserTests (userId, testId) VALUES (?, ?)', [userId, testId]);
						arrTestSQL.push(obSQL);
                    }
                }
            }
            if (key == 'Record') {
                var isArray = $.isArray(item);
                if (isArray) {
                    for (var i = 0; i < item.length; i++) {
                        getJsonRecord(item[i], subId);
                    }
                } else {
                    getJsonRecord(item, subId);
                }
            }
        });
		
		if(apiName == "getPendingTests"){
			if (totalTests == cntTests){
				processTestData();
			}
		}
		else{
			processTestData(testId, testName, timeLimit);
		}
		
    })(testJSONData);
}

function getJsonRecord(rec, subId) {
    $.each(rec, function(key, item) {
        if (key == 'topic') {
            var topics = item;
            topicId = 0;
            topicName = '';
            $.each(topics, function(key, item) {
                if (key == '@id') { topicId = item * 1; }
                if (key == '#text') { topicName = item; }
            });
            isFound = topicArr.search(topicId);
            if (!isFound) {
                topicArr.push(topicId);
				obSQL = sqlObject('INSERT INTO tbTopics (topicId,topicName,subId) VALUES (?,?,?)', [topicId, topicName, subId]);
				arrTestSQL.push(obSQL);
            }
        }
        if (key == 'type') {
            var types = item;
            typeId = 0;
            typeName = '';
            $.each(types, function(key, item) {
                if (key == '@id') { typeId = item * 1; }
                if (key == '#text') { typeName = item; }
            });
            isFound = typeArr.search(typeId);
            if (!isFound) {
                typeArr.push(typeId);
				obSQL = sqlObject('INSERT INTO tbType (typeId, typeName) VALUES (?,?)', [typeId, typeName]);
				arrTestSQL.push(obSQL);
            }
        }
        if (key == 'Question') {
            var isArray = $.isArray(item);
            if (isArray) {
                for (var i = 0; i < item.length; i++) {
                    addJsonQuestions(item[i], typeName);
                }
            } else {
                addJsonQuestions(item, typeName);
            }
        }
    });
}

function addJsonQuestions(objQuestion, typeName) {
    var examId = 0, subId = 0, testId = 0, topicId = 0, typeId = 0, uId = 0, refNo, question = '', statementI = '', statementII = '', complexId = 0, choiceA = '', choiceB = '', choiceC = '', choiceD = '', choiceE = '', correctAnswer = '', explanation = '', allottedTime = 0;
    if (objQuestion != undefined || objQuestion != null) {
        $.each(objQuestion, function(key, item) {
            if (key == '@uid') { uId = item * 1; }
            if (key == '@complexid') { complexId = item * 1; }
            if (key == '@typeid') { typeId = item * 1; }
            if (key == '@topicid') { topicId = item * 1; }
            if (key == '@testid') { testId = item * 1; }
            if (key == '@subid') { subId = item * 1; }
            if (key == '@examid') { examId = item * 1; }

            if (key == 'ques') { question = item; }
            if (key == 'ref') { refNo = item; }
            if (key == 'st1') { statementI = item; }
            if (key == 'st2') { statementII = item; }
            if (key == 'chA') { choiceA = item; }
            if (key == 'chB') { choiceB = item; }
            if (key == 'chC') { choiceC = item; }
            if (key == 'chD') { choiceD = item; }
            if (key == 'chE') { choiceE = item; }
            if (key == 'ans') { correctAnswer = item; }
            if (key == 'expl') { explanation = item; }
        });


        isFound = questionBankArr.search(uId);
        if (!isFound) {
            questionBankArr.push(uId);
			if (testType == 'QoD') {
				quesArr.push(uId);
			}
			
			obSQL = sqlObject("INSERT INTO tbQuestionBank (uId, topicId, complexId, typeId, refNo, question, statementI, statementII, choiceA, choiceB, choiceC, choiceD, choiceE, correctAnswer, explanation, allottedTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)" , [uId, topicId, complexId, typeId, refNo, question, statementI, statementII, choiceA, choiceB, choiceC, choiceD, choiceE, correctAnswer, explanation, allottedTime] );

			arrTestSQL.push( obSQL);
			 
			obSQL =  sqlObject("INSERT INTO tbTestQuestions (testId,uId) VALUES(?,?)" , [testId, uId] );

			arrTestSQL.push( obSQL);
			 
        }
    }
	
}

function processTestData(testId, testName, timeLimit){
	hideLoader();
	if(arrTestSQL.length>0){
		
		sqlProcess(arrTestSQL, function(message){
			arrTestSQL = new Array();
			if(oneTimeInitialization){
				startupPage = "#pageWelcome";
				document.location.hash = startupPage;
				//setTimeout(function() {
						changeMobilePage(startupPage);
			//},2000);
				
				setWaterMark($(startupPage));
				oneTimeInitialization = false;
			}
			
			if (testType == 'QoD') {
				 if(loadingPage != undefined){
					var qodUId = quesArr[quesArr.length - 1];
					showQOTDDateList(qodUId);
					changeMobilePage('#pageQuestionOfDayList');
				 }
			} else {
				if (loadingPage == '#pageMyTest') {
					var test = {
						testId : testId,
						testName: testName,
						timeLimit: timeLimit
					};
					
					if(oneTimeInitialization){
						activateScreen();
					}else{
						activateScreen(test);
					}
				}
				else{
					 
					activateScreen();
				}
			}
			
			if(apiName == "getPendingTests"){
				$().toastmessage('showNoticeToast', 'Data restored successfully.');
			}
		});
	}else{
		activateScreen();
	}
		
}

function showQoDPage(){
	if(loadingPage != undefined){
    	showQOTDDateList('');
    	changeMobilePage(loadingPage);
    }
}

function activateScreen(test) {
	hideLoader();
	$(loadingPage).find('#btnGetMoreTests').css("display", "inline");
    if (loadingPage == '#pageMyTest') {
		appendTestItem(test); 
    }
}

// --------------- getTest & QoD API ---------------

// --------------- feedback API ---------------

function sendFeedbackAPI(feedback){
	if (networkState()) {
		var userId = getUserId();
		var deviceId = getDeviceId();
		var dataUrl = getDataUrl();
		var password = getPassword();
		
		var appInfo = {
			version:  app_version ,
			releaseNo:app_release_no
		};
		
		var appInfoJson = JSON.stringify(appInfo);
		
		showLoader( "Sending feedback...");
		$.ajax({
			type: 'POST',
			url: dataUrl + '/setFeedback',
			data: { 'userId': userId, 'password': password, 'json': feedback, 'deviceId': deviceId ,'AppInfo':appInfoJson, 'Version':1},
			success: function(data, text, xhqr) {
				var xmlData = $(data).find("string").text();
				hideLoader();
				if(xmlData == '-1:condition.'){
					//No other test found
				}else{
					var ThankYouText = "Thanks and your feedback is really appreciated. - The TestZapp team";
					showAppToast('showWarningToast', ThankYouText, 3000);
				}
			},
			error: function(xhqr, textStatus, errorThrown) {
				hideLoader();
				if (textStatus == 'error' && errorThrown == 'Internal Server Error') {
					showAppToast('showNoticeToast', 'Server error occurred.<br>Please try again later.', 2000);
				} else {
					toastServerError();						
				}
			}
		});
	}
}

// --------------- feedback API ---------------