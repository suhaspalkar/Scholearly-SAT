function setTimerState(timerState) {
    window.localStorage.setItem("TimerState", timerState)
}

function getTimerState() {
    return window.localStorage.getItem("TimerState");
}

//--------- Session Set Paper Id -----------
function setSessionPaperId(id) {
    window.sessionStorage.setItem("PaperId", id)
}

function getSessionPaperId() {
    return window.sessionStorage.getItem("PaperId");
}

//--------- Session Set Test Name -----------
function setSessionTestName(id) {
    window.sessionStorage.setItem("TestName", id)
}

function getSessionTestName() {
    return window.sessionStorage.getItem("TestName");
}

// Reference No. block~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function setQuestionReferenceNo(referenceNo) {
    window.localStorage.setItem("ReferenceNo", referenceNo);
}

function getQuestionReferenceNo() {
    return window.localStorage.getItem("ReferenceNo");
}

function setPaperMode(mode) {
    window.localStorage.setItem("PaperMode", mode);
}

function getPaperMode() {
    return window.localStorage.getItem("PaperMode");
}

function setSelectedAnswerText(text) {
    window.localStorage.setItem("SelectedAnswerText", text);
}

function getSelectedAnswerText() {
    return window.localStorage.getItem("SelectedAnswerText");
}

function setSelectedAnswerValue(value) {
    window.localStorage.setItem("SelectedAnswerValue", value);
}

function getSelectedAnswerValue() {
    return window.localStorage.getItem("SelectedAnswerValue");
}

function setTempPaperStatus(status) {
    window.localStorage.setItem("TempPaperStatus", status);
}

function getTempPaperStatus() {
    return window.localStorage.getItem("TempPaperStatus");
}

function setRemainingTime(time) {
    window.localStorage.setItem("RemainingTime", time);
}

function getRemainingTime() {
    return window.localStorage.getItem("RemainingTime") * 1;
}

function setActualTime(time) {
    window.localStorage.setItem("ActualTime", time);
}

function getActualTime() {
    return window.localStorage.getItem("ActualTime") * 1;
}

function setPausedQuestionNo(questionNo) {
    window.localStorage.setItem("PausedQuestionNo", questionNo);
}

function getPausedQuestionNo() {
    return window.localStorage.getItem("PausedQuestionNo");
}

function setCurrentQuestion(currentQuestionNo) {
    window.localStorage.setItem("CurrentQuestionNo", currentQuestionNo);
}

function getCurrentQuestion() {
    return window.localStorage.getItem("CurrentQuestionNo") * 1;
}

function setCurrentQuestionTimer(currentQuestionTimer) {
    window.localStorage.setItem("CurrentQuestionTimer", currentQuestionTimer);
}

function getCurrentQuestionTimer() {
    return window.localStorage.getItem("CurrentQuestionTimer");
}

function setTotalQuestions(totalQuestion) {
    window.localStorage.setItem("TotalQuestions", totalQuestion);
}

function getTotalQuestions() {
    return window.localStorage.getItem("TotalQuestions");
}

function setSolvedQuestions(solvedQuestions) {
    window.localStorage.setItem("SolvedQuestions", solvedQuestions);
}

function getSolvedQuestions() {
    return window.localStorage.getItem("SolvedQuestions");
}


function setHtmlCode(htmCode) {
    window.localStorage.setItem("HtmlCode", htmCode);
}

function getHtmlCode() {
    return window.localStorage.getItem("HtmlCode");
}

function setActiveScreen(activeScreen) {
    window.localStorage.setItem("ActiveScreen", activeScreen);
}

function getActiveScreen() {
    return window.localStorage.getItem("ActiveScreen");
}

function setWasAnswerGiven(value) {
    window.localStorage.setItem("WasAnswerGiven", value);
}

function getWasAnswerGiven() {
    return window.localStorage.getItem("WasAnswerGiven") * 1;
}

function setCurrentQuestionUid(value) {
    window.localStorage.setItem("CurrentQuestionUid", value);
}

function getCurrentQuestionUid() {
    return window.localStorage.getItem("CurrentQuestionUid") * 1;
}

/*
function setUserId(userId){
window.localStorage.setItem("LoggedUser",userId);
}
*/

function getUserId() {
    var user = window.localStorage.getItem("LoggedUser");

    if (user == undefined) {
        user = anonymous;
    }
    return user * 1;
}


function setControlParameters() {
    db.transaction(function(tx) {
        tx.executeSql('select deviceId, dataUrl, userLoginUrl, currentLoginId, deviceSpecsPG from tbControlParameters', [], function(tx, result) {
            var device_info = result.rows.item(0);
            window.localStorage.setItem("DeviceId", device_info.deviceId);
            window.localStorage.setItem("DataUrl", device_info.dataUrl);
            window.localStorage.setItem("UserLoginUrl", device_info.userLoginUrl);
            window.localStorage.setItem("LoggedUser", device_info.currentLoginId);
			
			var dvInfo = JSON.parse(device_info.deviceSpecsPG);
			window.localStorage.setItem("DeviceName", dvInfo.deviceName);

            tx.executeSql('SELECT userPassword, userEmail FROM tbUser Where userId=?', [device_info.currentLoginId], function(tx, result) {
                if (result.rows.length == 0) {
					window.localStorage.setItem("LoggedUser", anonymous); 
                    window.localStorage.setItem("pas", tempPass); //anonymous user email - anonymous@anonymous.com
					window.localStorage.setItem("RegisterTo", "anonymous");
                }
                else {
                    var pass = result.rows.item(0);
                    window.localStorage.setItem("pas", pass.userPassword);
					window.localStorage.setItem("RegisterTo", pass.userEmail);
					
                }
            });

        });
    });

}

function getPassword() {
	var pass = window.localStorage.getItem("pas");
	if(pass == null || pass == undefined || pass == ''  ){
		return tempPass;  // anonymous user
	}else{
		return pass;
	}
}


function getDeviceName() {
    return window.localStorage.getItem("DeviceName");
}

function getRegisterTo() {
    return window.localStorage.getItem("RegisterTo");
}

function getDataUrl() {
    return window.localStorage.getItem("DataUrl");
}

function getUserLoginUrl() {
    return window.localStorage.getItem("UserLoginUrl");
}

function getDeviceId() {
    return window.localStorage.getItem("DeviceId");
}

function setLastPage(page) {
    window.localStorage.setItem("LastVisitedPage", page);
}

function getLastPage() {
    return window.localStorage.getItem("LastVisitedPage");
}