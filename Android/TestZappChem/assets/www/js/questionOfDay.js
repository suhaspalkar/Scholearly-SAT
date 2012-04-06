
var stI, stII, ce, correctAns;
var btnName, btnCol1, btnCol2, btnOne, btnTwo, ansStatusForDialog;
var randQuest, totalAttempt;
var questionArray = new Array(1);
var isAnsViewed = false;
var attemptStatus = "";
var attemptCount = 0;
var currentQuest;
var currQuestDate;
var dateArr;
var currentUser = getUserId();
var givenAnswer;
var isTypeB = false;

// page creation //
$('#pageQuestionOfDayList').live('pagebeforeshow', function(event, ui) {
    $("#showRational").addClass("hide");
    $("#showRational").removeClass("show");
	HideDialogQOTD();
	HideDialogHelpQOTD();
	$("#hideQuickNavQotd").hide();
    isAnsViewed = false;
	$("#QOTDHelpText").html("<div>QOTD is a daily energizer to remind you of your test prep by delivering a new question every day; just tap on the date of the unanswered question (<img src='images/icon_questions.png' class='btnIcon'>) to get started.<br/><br/> " +
"For attempted questions, <img src='images/quicknavimgs/icon_correct.png' class='btnIcon'> shows that the question was answered correctly and the number in brackets displays attempts to pick the correct answer. The  <img src='images/icon_incorrect.png' class='btnIcon'> indicates that you chose to display the correct answer.<br/><br/> " +
"The answered questions (<img src='images/icon_questions_gray.png' class='btnIcon'>) can be reattempted, but results are only tracked for the first attempt.</div>");
});

$('#pageQuestionOfDayList').live('pagehide', function(event, ui) {
	
	$("#hideQuickNavQotdList").hide();
	HideDialogHelpQOTDList();
});

function fillArraysWithQodData(callback) { // To check wheather current date is already exist in database
    dateArr = new Array();
    db.transaction(function(tx) {
        tx.executeSql('SELECT qotdDate FROM tbQOTD', [], function(tx, result) {
            var n = 0;
            for (n = 0; n < result.rows.length; n++) {
                var qodRow = result.rows.item(n);
                dateArr.push(qodRow.qotdDate);
            }
            if (n == result.rows.length) {
                callback(true);
            }
        });
    });
}

function showQOTDDateList(qodUId) { // To add current date record in database
    fillArraysWithQodData(function() {
        var date = new Date();
        var dtForm = date.getDate() + "" + (date.getMonth() + 1) + "" + date.getFullYear(); 
        var isDateAvailable = false;
        var currentDate = date.toLocaleDateString();

        var questID;
        var ansStatus;
        var attempt;

		var dtDisplayForm = date.format('Y-z-d');
		
        db.transaction(function(tx) {
            currentUser = getUserId();
            if (qodUId == "" || qodUId == null || qodUId == "undefined") {
                generateQodList();
            } else {

                var isFound = dateArr.search(dtForm);
                if (!isFound) {
                    dateArr.push(dtForm);
                    tx.executeSql('INSERT INTO tbQOTD(qotdId, qotdDate, displayDate, uId) VALUES (?,?,?,?)', [dateArr.length, dtForm, dtDisplayForm, qodUId], function(tx, result) {

                        tx.executeSql('SELECT MAX(qotdId) as qotdId FROM tbQOTD', [], function(tx, result) {

                            var row = result.rows.item(0);
                            var qotdID = row.qotdId;

                            tx.executeSql('INSERT INTO tbQOTDUserData(qotdId, userId, userAns, status, attempt) VALUES (?,?,?,?,?)', [qotdID, currentUser, "", "U", 0], function(tx, result) {
                                generateQodList();
                            });
                        });
                    });
                } else {
                    generateQodList();
                }
            }
        });
    });
}


function generateQodList() { //To generate list of date
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM tbQOTD ORDER BY displayDate DESC", [], function(tx, result) { 	/*DATE(displayDate)*/

            $('#divQOTDList').html("<hr class=hrStyle>");
            currentUser = getUserId();
            if (result.rows.length > 0) {
                for (var i = 0; i < result.rows.length; i++) {
                    var row = result.rows.item(i);
                    showDeckList(tx, row, currentUser, row.displayDate);
                }
            } else {
                blankList();
            }
        });
    });
}

function blankList() { // Calls if no question is available
    var htmlCode = '';
    htmlCode += "<div align=center> <table width=100%><tr>";
    htmlCode += "<td width=15% valign=middle align=center rowspan=2>&nbsp;</td> ";

    htmlCode += "<td valign=bottom width=70% align=left id='dateList' class='showDateList'>No Question Available.</td> ";
    htmlCode += "<td width=10% valign=middle align=right rowspan=2>&nbsp;</td><td width=5% align=left rowspan=2><div id='attemptCount' valign=middle style='color:black'>&nbsp;</div></td> ";

    htmlCode += " </tr><tr><td><div class='hide'></div></td></table></div>";
    htmlCode += "<hr class=hrStyle>";

    $('#divQOTDList').append(htmlCode);
}

function showDeckList(tx, row, currentUser, dispDate) { // To display qotd dates list

    tx.executeSql("SELECT * FROM tbQOTDUserData WHERE qotdId=? AND userId=?", [row.qotdId, currentUser], function(tx, result1) {
        var count = result1.rows.length;

        if (count == 0) {
            ansStatus = "U";
            attempt = 0;
            tx.executeSql('INSERT INTO tbQOTDUserData(qotdId, userId, userAns, status, attempt) VALUES (?,?,?,?,?)', [row.qotdId, currentUser, "", "U", 0]);
        } else {
            var currRow = result1.rows.item(0);
            ansStatus = currRow.status;
            attempt = currRow.attempt;
        }
        var dt = parseDate("" + dispDate);
        var html = displayListPage(dt, ansStatus, attempt, row.qotdDate, row.qotdId);
        $('#divQOTDList').append(html);
    });
    return true;
}

function displayListPage(objDate, ansStatus, attempt, qdDate, qodID) { // Calls to show date list in showDeckList() function

    var htmlCode = '';
    var imageSrc;
    var tdClass;
    var qImage;
    var qStatusImage;
    var blankDiv;
    var cur_date = objDate.format('M d, Y (D)');
    if (ansStatus == 'W') {
        imageSrc = "images/icon_incorrect.png";
        tdClass = "showDateList";
        qImage = "show";
        blankDiv = "hide";
        qStatusImage = "images/icon_questions_gray.png";
    } else if (ansStatus == 'C') {
        imageSrc = "images/quicknavimgs/icon_correct.png";
        tdClass = "showDateList";
        qImage = "show";
        blankDiv = "hide";
        qStatusImage = "images/icon_questions_gray.png";
    } else if (ansStatus == 'U') {
        imageSrc = "";
        tdClass = "showDateList-skipped";
        qImage = "hide";
        blankDiv = "show"
        qStatusImage = "images/icon_questions.png";
    }

    if (ansStatus == 'U' || ansStatus == 'W') {
        attemptStatus = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    } else if (ansStatus == 'C') {
        if (attempt > 1) {
            attemptStatus = "(" + attempt + ")";
        }
        else {
            attemptStatus = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        }
    }
    //<a >
    htmlCode += "<div align=center> <table width=100%><tr id=" + qdDate + " onclick=showQOTD('" + qdDate + "','" + qodID + "')>";
    htmlCode += "<td width=15% valign=middle align=center > <img src='" + qStatusImage + "' class='listIcon'></td> ";

    htmlCode += "<td valign=middle width=75% align=left id='dateList' class='" + tdClass + "'>" + cur_date + "</td> ";
    htmlCode += "<td width=3% valign=middle align=right ><img src='" + imageSrc + "' class='btnIcon " + qImage + "'><div class='" + blankDiv + "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></td><td width=7% align=left valign=middle><div id='attemptCount' valign=middle style='color:black'> <b>" + attemptStatus + "</b></div></td>";

    htmlCode += " </tr></table></div>";
    htmlCode += "<hr class=hrStyle>";

    return htmlCode;
}

function showQOTD(dt, currQodID) { // to pass slected date from list to show question for that day.

    attemptCount = 0;
    currQuestDate = dt;
    currentUser = getUserId();
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM tbQOTD tq, tbQOTDUserData tu WHERE tq.qotdDate=? And tu.qotdId=? And userId=?", [dt, currQodID, currentUser], function(tx, result) {
            var row = result.rows.item(0);

            totalAttempt = row.attempt;
            generateQOTD(row.uId, currQodID, row.userAns);
        });
    });
}
var qotdIdForCurrUser;

function generateQOTD(questID, currQodID, givenAns) { // to generate question page

    currentQuest = questID;
    qotdIdForCurrUser = currQodID;

    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM tbQuestionBank qb , tbType tp WHERE qb.typeId=tp.typeId AND qb.uId =?', [questID], function(tx, result) {

            currentQuestion = result.rows.item(0);
            var htmlSource = "";
            var opts = ""
            $("#divSelectedAnswer1").html("Choose answer: ");
            var answer = givenAns;

            if (currentQuestion.typeName == "A" || currentQuestion.typeName == "C") {
                htmlSource += "<div style='text-align:left'>" + currentQuestion.question + "</div><br>";
                if (currentQuestion.choiceA != "") {
                    try {
                        opts = "<table width='100%' class='alpha60'  border ='0' cellspacing='0' cellpadding='0'> " +
							"<tr onclick='checkAnswerA()'> <td id='tdA1' width='10%' valign='middle'> <center><div id = 'btnA'  class = 'circle-button' > A  </div> </center></td>" +
							"	 <td id='tdA2' align='left' width='90%' class='questionAnswerColor tdTextBorder'> " +
									currentQuestion.choiceA
							+ " </td>  </tr>" +
							"<tr style= 'background-color:lightgray' class='alpha60' onclick='checkAnswerB()'>" +
							"	<td id='tdB1' width='10%' valign='middle'> <center> <div id = 'btnB' class = 'circle-button' > B  </div> </center></td>" +
							"	<td id='tdB2' align='left' width='90%' class='questionAnswerColor tdTextBorder'> " +
								    currentQuestion.choiceB
							+ "</td>" +
							"</tr> <tr onclick='checkAnswerC()'>" +
							"	<td id='tdC1' width='10%' valign='middle'> <center> <div id = 'btnC' class = 'circle-button' > C  </div> </center></td>" +
							"	<td id='tdC2' align='left' width='90%' class='questionAnswerColor tdTextBorder'>" +
								   currentQuestion.choiceC
							+ "</td>" +
							"</tr> <tr style= 'background-color:lightgray'  class='alpha60' onclick='checkAnswerD()'>" +
							"	<td id='tdD1' width='10%' valign='middle'> <center> <div id = 'btnD' class = 'circle-button' > D  </div> </center></td>" +
							"	<td id='tdD2' align='left' width='90%' class='questionAnswerColor tdTextBorder'> " +
								   currentQuestion.choiceD
							+ "</td>" +
							"</tr> <tr onclick='checkAnswerE()'> " +
							"	<td id='tdE1' width='10%' valign='middle'> <center><div id = 'btnE' class = 'circle-button' > E  </div> </center></td>" +
							"	<td id='tdE2' align='left' width='90%' class='questionAnswerColor tdTextBorder'> " +
								   currentQuestion.choiceE
							+ "</td> " +
							"</tr> </table>   ";
                    } catch (e) {

                    }
                } else {
                    opts = "<table width='100%'  class='alpha60'  border ='0' cellspacing='0' cellpadding='0'> " +
							"<tr> <td valign='middle'> <center> <div id = 'btnChA' class = 'circle-button' onclick='javascript:checkAnswerA();'> A  </div> </center> </td>" +
							"	  <td valign='middle'> <center> <div id = 'btnChB' class = 'circle-button' onclick='javascript:checkAnswerB();'> B  </div> </center> </td>" +
							"	  <td valign='middle'> <center> <div id = 'btnChC' class = 'circle-button' onclick='javascript:checkAnswerC();'> C  </div> </center> </td>" +
							"	  <td valign='middle'> <center> <div id = 'btnChD' class = 'circle-button' onclick='javascript:checkAnswerD();'> D  </div> </center> </td>" +

							"	  <td valign='middle'> <center> <div id = 'btnChE' class = 'circle-button' onclick='javascript:checkAnswerE();'> E  </div> </center> </td>" +
							"</tr> </table> <br> ";
                }
            }

            if (currentQuestion.typeName == "B") {

                htmlSource += "<table width='100%' cellspacing='0' cellpadding='0'>";
                htmlSource += "  <tr>";
                htmlSource += "	<th align=center width=47%>Statement I</th>";
                htmlSource += "	<td width=5%>&nbsp;</td>";
                htmlSource += "	<th align=center width=48%>Statement II</th>";
                htmlSource += "  </tr>";
                htmlSource += "  <tr>";
                htmlSource += "	<td  align=center style='border-style:groove;border:solid 1px;'>" + currentQuestion.statementI + "</td>";
                htmlSource += "	<td style='color:#F00' align='center'>because</td>";
                htmlSource += "	<td align=center style='border-style:groove;border:solid 1px;'>" + currentQuestion.statementII + "</td>";
                htmlSource += "  </tr>";
                htmlSource += "</table><br>";

                opts = "<table width='100%' border ='0' cellspacing='0' cellpadding='0'>" +
						"<tr class='alpha60'> <td align='center'> <div id = 'btnIT' class = 'circle-button'  onclick='javascript:ansFirstTrue();'>T</div> </td>" +
						"<td align='center'>(I)</td><td align='center'><div id = 'btnIF' class = 'circle-button' onclick='javascript:ansFirstFalse();'>F</div> </td> </tr>" +
						"<tr><th colspan='2'>&nbsp;</th></tr>" +
						"<tr class='alpha60'><td align='center'><div id = 'btnIIT' class = 'circle-button' onclick='javascript:ansSecondTrue();'>T</div> </td>" +
						"<td align='center'>(II)</td><td align='center'><div id = 'btnIIF' class = 'circle-button' onclick='javascript:ansSecondFalse();'> F  </div> </td> </tr>" +
						"<tr><th colspan='2'>&nbsp;</th></tr>" +
						"<tr class='alpha60'><td align='center'><div id = 'btnCE' class = 'circle-button' onclick='javascript:ansExplanation();'>CE</div> </td> " +
						"<td align='center'>CE</td><td align='center'><div id = 'btnNA' class = 'circle-button' onclick='javascript:ansNoExplanation();'>  &nbsp;&nbsp;&nbsp;&nbsp;</div></td></tr><tr><th colspan='2'>&nbsp;</th></tr> </table>";

            }

            correctAns = currentQuestion.correctAnswer;
            stI = stII = ce = '';

			if (currentQuestion.uId == 29) { // correcting data issue
				htmlSource = htmlSource.replace(/<img /,"<imgXX class='xxx' ");
				htmlSource = htmlSource.replace(/<img [^>]*>/g,"");
				htmlSource = htmlSource.replace(/<imgXX /,"<img ");			
			}
			
            var wid
            if (currentQuestion.typeName == "B") {
                wid = $('div').width() * 0.40;
            }
            else {
                wid = $('div').width();
            }

            $('#divQuestionPart1').html(htmlSource);
            adjustImage(htmlSource, '#divQuestionPart1', 'QOD', wid);

            $('#divQuestionPartA').html(htmlSource);
            adjustImage(htmlSource, '#divQuestionPartA', 'QOD', wid);

            $('#divOptions1').html(opts);
            adjustImage(opts, '#divOptions1', 'QOD');


            var explanation = "<table align='center' width='100%' align='left'>" +
							  "<tr><td style='color:#090'>Correct Answer:  " + '(' + correctAns + ')' + " </td></tr>" +
							  "<tr><td><hr><hr></td></tr>" +
							  "<tr><td>" + currentQuestion.explanation + "</td></tr>" +
							  "<tr><td></td></tr>" +
							  "</table>";

            $("#showRational").html(explanation);
            var imgWidth = $("#showRational").find("img").width();

            if (imgWidth > 200) {
                $("#showRational").find("img").addClass("imgExplan");
            }

            if (currentQuestion.typeName == "A") {

                showElements('#divQuestionPart1', '#divQuestionPartA');
            } else {

                showElements('#divQuestionPartA', '#divQuestionPart1');
            }

            /*if (answer != '') {
                if (currentQuestion.typeName == "B") {
                    highlightSubmitted(2, answer);
                }
                else {
                    if (currentQuestion.choiceA != "") {
                        highlightSubmitted(0, answer);
                    }
                    else {
                        highlightSubmitted(1, answer);
                    }
                }
            }*/

        });
    });

    changeMobilePage('#pageQOD');
}


$('.scaledDnQOD').live('tap', function(event, ui) {

    var imgData = $(this).attr('src');
    imgData = "<img class='fullImage' src='" + imgData + "' />";
    $("#theImageQOD").html(imgData);
    $(this).css("border", "3px dotted blue");
    $(".fullImage").css("border", "3px dotted red");
    $(".fullImage").css("background-size", "contain");
	
	var availH = $(window).innerHeight();
	var oriH = $('#dialogForZoomedImageInQOD').height();
	
	if(oriH > availH  || oriH==0) 
	{
		$(".fullImage").css("height",$(window).innerHeight() * 0.80 );
	}
		
    ShowZoomedImage(true, "dialogForZoomedImageInQOD", "darkLayerForZoomedImageInQOD");
    touchslider.createSlidePanel('#fullImageQOD', 200, 15);

});

$('#btnCloseForZoomedImageInQOD').live('tap', function(event, ui) {
    event.preventDefault();
    ShowZoomedImage(false, "dialogForZoomedImageInQOD", "darkLayerForZoomedImageInQOD");
});

$('#darkLayerForZoomedImageInQOD').live('tap', function(event, ui) {
    event.preventDefault();
    ShowZoomedImage(false, "dialogForZoomedImageInQOD", "darkLayerForZoomedImageInQOD");
});

// function called while tapped on option buttons of type A/C questions
function checkAnswerA() {
    setOriginClassToBtn();
    changeBtnColor('#btnA', '#tdA1', '#tdA2');
    selectedAnswer('A');
}

function checkAnswerB() {
    setOriginClassToBtn();
    changeBtnColor('#btnB', '#tdB1', '#tdB2');
    selectedAnswer('B');
}

function checkAnswerC() {
    setOriginClassToBtn();
    changeBtnColor('#btnC', '#tdC1', '#tdC2');
    selectedAnswer('C');
}

function checkAnswerD() {
    setOriginClassToBtn();
    changeBtnColor('#btnD', '#tdD1', '#tdD2');
    selectedAnswer('D');
}

function checkAnswerE() {
    setOriginClassToBtn();
    changeBtnColor('#btnE', '#tdE1', '#tdE2');
    selectedAnswer('E');
}

function selectedAnswer(selectedOption) { // to update current question status for A/C type question

    var status;
    var answer = "Choose answer: " + selectedOption;
    $("#divSelectedAnswer1").html(answer);

    if (selectedOption == correctAns) {
        status = 'C'
        $("#qotdDialogText").html("Correct Answer.");
        showElements('#divTapForAnswer', '#showRational');

    } else {
        status = 'W'
        $("#qotdDialogText").html("Wrong Answer.");
        showElements('#showRational', '#divTapForAnswer');
    }

    attemptCount++;

    getAnsStatus(status);
    ShowDialogQOTD(true);

    if (totalAttempt == 0) {
        updateQOTDTable(selectedOption, status, attemptCount, qotdIdForCurrUser);
    }
}

function getAnsStatus(status) {
    ansStatusForDialog = status;
}

// function called while tap on option for B type questions
function ansFirstTrue() {
    stI = 'T';
    changeBtnColorForTypeB('#btnIF', '#btnIT')
    correctAnswerForTypeB();
}

function ansFirstFalse() {
    stI = 'F';
    changeBtnColorForTypeB('#btnIT', '#btnIF')
    correctAnswerForTypeB();

}

function ansSecondTrue() {
    stII = 'T';
    changeBtnColorForTypeB('#btnIIF', '#btnIIT')
    correctAnswerForTypeB();
}

function ansSecondFalse() {
    stII = 'F';
    changeBtnColorForTypeB('#btnIIT', '#btnIIF')
    correctAnswerForTypeB();
}

function ansExplanation() {
    ce = 'CE';
    changeBtnColorForTypeB('#btnNA', '#btnCE')
    correctAnswerForTypeB();

}

function ansNoExplanation() {
    ce = 'NA';
    changeBtnColorForTypeB('#btnCE', '#btnNA')
    correctAnswerForTypeB();
}

function correctAnswerForTypeB() { // to update current question status for B type question
    var ans = stI + "," + stII + "," + ce;

    s1 = (stI == '') ? '?' : stI;
    s2 = (stII == '') ? '?' : stII;
    s3 = (ce == '') ? '?' : ce;

    var answer = "Choose answer: " + s1 + "," + s2 + "," + s3;
    $("#divSelectedAnswer1").html(answer);

    if (stI != '' && stII != '' && ce != '') {

        var usersAns = (ans == correctAns.replace('&#8218;', ',')) ? 'C' : 'W';
        if (usersAns == 'C') {

            $("#qotdDialogText").html("Correct Answer.");
            showElements('#divTapForAnswer', '#showRational');

        } else {

            $("#qotdDialogText").html("Wrong Answer.");
            showElements('#showRational', '#divTapForAnswer');
            stI = '';
            stII = '';
            ce = '';
        }

        attemptCount++;

        getAnsStatus(usersAns);
        ShowDialogQOTD(true);

        if (totalAttempt == 0) {
            updateQOTDTable(ans, usersAns, attemptCount, qotdIdForCurrUser);
        }
    }
}

function updateQOTDTable(givenAns, ansStatus, attemptCount, qotdIdForCurrUser) { // to update table tbQOTD
    currentUser = getUserId();
    db.transaction(function(tx) {
        tx.executeSql("UPDATE tbQOTDUserData SET userAns= '" + givenAns + "', status = '" + ansStatus + "', attempt = '" + attemptCount + "' WHERE qotdId = " + qotdIdForCurrUser + " And userId = " + currentUser);
    });
}

function ShowDialogQOTD(modal) { // toast/msgbox to show selected answer's status(right/wrong)
    $("#overlayQOTD").show();
    $("#dialogQOTD").fadeIn(300);

    if (modal) {
        $("#overlayQOTD").unbind("click");
    } else {
        $("#overlayQOTD").click(function(e) {
            HideDialogQOTD();
        });
    }
}

function HideDialogQOTD() { // to hide toast / msgbox
    $("#dialogQOTD").fadeOut(300);
    $("#overlayQOTD").hide();
}

$("#divTapForAnswer").live('tap', function(event, ui) { // tap to view answer
    event.preventDefault();
    showElements('#divTapForAnswer', '#showRational');
    isAnsViewed = true;
});

$("#closeDialogQOTD").live('tap', function(event, ui) { // closing toast/ msgbox
    event.preventDefault();
    HideDialogQOTD();
    setOriginClassToBtn();

    if (ansStatusForDialog == 'C' || isAnsViewed == true) {
        changeMobilePage('#pageQuestionOfDayList');
    }
    showQOTDDateList(currentQuest);
});

function showElements(elem1, elem2) { // to hide and show the elements passed as parameters in respective order.

    $(elem1).addClass("hide");
    $(elem1).removeClass("show");

    $(elem2).addClass("show");
    $(elem2).removeClass("hide");
}

function setOriginClassToBtn() { // set original properties to option buttons

    $('#btnA, #btnB, #btnC, #btnD, #btnE').removeClass("circle-buttonVisited");

    $('#tdA1, #tdB1, #tdC1, #tdD1, #tdE1').removeClass("firstColumn-visited");

    $('#tdA2, #tdB2, #tdC2, #tdD2, #tdE2').removeClass("questionAnswerColor-visited");

    $('#btnIT, #btnIF, #btnIIT, #btnIIF, #btnCE, #btnNA').removeClass("circle-buttonVisited");
}

// quick Nav for QOTD
function toggleScreenEffectForQotd(layer) {
    $(layer).css('display', $(layer).css('display') == 'none' ? 'block' : 'none');
}

$("#quickNavForQotd").live('tap', function(event, ui) {
    event.preventDefault();
    ShowDialogHelpQOTD(true);
});

$("#hideQuickNavQotd").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavQotd").toggle("fast");
    ShowDialogHelpQOTD(true);

});

$("#darkLayerQd").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavQotd").hide();
    HideDialogHelpQOTD();
});

function ShowDialogHelpQOTD(modal) { // to show toast/msgbox 
    $("#darkLayerQd").show();
    $("#dialogQOTDHelp").fadeIn(300);

    if (modal) {
        $("#darkLayerQd").unbind("click");
    }
}

function HideDialogHelpQOTD() { // to hide toast / msgbox
    $("#dialogQOTDHelp").fadeOut(300);
    $("#darkLayerQd").hide();
}

$("#btnCloseQOTDHelp").live('tap', function(event, ui) {
    event.preventDefault();
    HideDialogHelpQOTD();
});

// quick Nav for QOTD Date List
$("#quickNavForQotdList").live('tap', function(event, ui) {
   event.preventDefault();
    ShowDialogHelpQOTDList(true);
});

$("#hideQuickNavQotdList").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavQotdList").toggle("fast");
    ShowDialogHelpQOTDList(true);
});

$("#darkLayerMenuQotd").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavQotdList").hide();
    HideDialogHelpQOTDList();
});

function ShowDialogHelpQOTDList(modal) { // to show toast/msgbox 
    $("#darkLayerMenuQotd").show();
    $("#dialogQOTDListHelp").fadeIn(300);

    if (modal) {
        $("#darkLayerMenuQotd").unbind("click");
    }
}

function HideDialogHelpQOTDList() { // to hide toast / msgbox
    $("#dialogQOTDListHelp").fadeOut(300);
    $("#darkLayerMenuQotd").hide();
}

$("#btnCloseQOTDListHelp").live('tap', function(event, ui) {
    event.preventDefault();
    HideDialogHelpQOTDList();
});
