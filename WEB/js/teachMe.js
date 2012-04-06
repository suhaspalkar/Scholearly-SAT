
var arrayOfDeck, arrayOfUserDeck;
var deckLength;
var cardData;
var index;
var cardNumber, deckId, que, cue, ans, deckName, groupName, dkId;
var isDeleted = false, isUser = false, isEdit = false;
var deckList, cardList, noOfCard, userDeck;
var lengthOfDelCardArray, per;
var deckTime = 0 * 1;
var deckTimer = 0, userId = 0;
var arrayIndex = 0;
var isLast = false;
var isSetTimeDone = false;
var isResetCalled = false;
var undCardCountToReset;
var defDeckOwnerId;
var FCTimer;
// page creation

//Home
$("#pageHome").live("pagebeforehide", function(event, ui) {
    userId = getUserId();
    //defDeckNo();
    defaultUserCards();

});
/*$("#pageHome").live("pagecreate", function (event, ui) {
	
});*/

//Deck List
$("#pageDeckOfFlashCard").live("pageshow", function(event, ui) {

    $("#listofdeck").html('');
    $("#deckofuser").html('');

    createDeck();

});

//Flash Card
$('#pageFlashCard').live('pagebeforehide', function(event, ui) {
    FCTimer.pause();
    if (!isSetTimeDone) {

        db.transaction(function(txt) {
            var id = getDeckId();
            txt.executeSql('UPDATE tbUserDeck SET timeToView=? WHERE deckId=? And userId = ?', [deckTimer, id, userId]);
        });
    }
	HideDialogAddCard();
});
$('#pageDeckOfFlashCard').live('pagebeforehide', function(event, ui) {
   HideDialogNewDeck();
   HideDialogInitialCard();
});

//Get logged user 
/*function getUserId(){
	
userId = getUserId();
return userId;
}
*/
//Create list of decks
function createDeck() {

    $("#listofdeck").html("<hr class=hrStyle>");
    db.transaction(function(txt) {
        txt.executeSql('SELECT * from tbUserDeck udk, tbDeck dk where udk.deckId = dk.deckId AND udk.userId=?', [userId], function(txt, result) {
            for (var i = 0; i < result.rows.length; i++) {
                var deckRow = result.rows.item(i);
                deckName = deckRow.deckName;
                deckId = deckRow.deckId;
                deckOwnerId = deckRow.userId;
                defDeckOwnerId = deckRow.ownerId;
                var time = deckRow.timeToView;
                //alert(deckId + "" + deckName + "" + time);
                generateDecks(deckId, deckName, time, defDeckOwnerId, i);
            }
        });
    });
}

// Generate decks
function generateDecks(deckId, deckName, time, defDeckOwnerId, tempDivId) {

    db.transaction(function(txt) {
        txt.executeSql('SELECT count(*) AS fcCount from tbFlashCard WHERE deckId=?', [deckId], function(txt, result) {

            var data = result.rows.item(0);
            var totalCardDk = data.fcCount * 1;
            //	var totalDefDeck =getDefDeckNo();
            var setDeckImage = '';

            txt.executeSql('SELECT count(*) AS undCount from tbFCStatus fs, tbFlashCard fc where fs.fcid = fc.fcid and  fs.isHidden=? AND fc.deckId =? AND fs.ownerId=?', [1, deckId, userId], function(txt, result) {

                var data = result.rows.item(0);
                var understoodCards = data.undCount * 1;

                per = Math.round((understoodCards / totalCardDk) * 100);
                if (isNaN(per)) {
                    per = 0;
                }
                if (defDeckOwnerId >= 0) {
                    setDeckImage = 'images/icons/icon_customflashcards.png';
                } else {
                    setDeckImage = 'images/icons/icon_flashcards.png';
                }
                var remainingCards = totalCardDk - understoodCards;

                deckList = "<div align=center class='statusBox'><table width=100% border='0'>" +
							"<tr><td width=15% valign=center align=center rowspan=2>" +
								"<div id=" + deckId + " onclick='FCDeckSummary(" + tempDivId + "," + time + "," + defDeckOwnerId + ")'><img src=" + setDeckImage + " alt='' class='listIcon'></div></td>" +
								"<td><div id='d" + tempDivId + "' style='display:none;'>" + deckId + "</div><div style='cursor:pointer;' id=" + tempDivId + " onclick='openDeck(" + tempDivId + "," + time + "," + defDeckOwnerId + ")'> " +
											"<table width=100%><tr><td>" + deckName + " </td>" +
											"<td align='right'><div id='understoodPer'>" + remainingCards + "  <font color='#909191'>(  " + totalCardDk + " )</font></div></td>" +
											"</tr><tr><td colspan=2><div class='meter-wrap tapTest' style='cursor:pointer;'>" +
											"<div id='callProgressScreen1' class='meter-value' style='width:" + per + "%;' >" +
											"</div></div></td></tr></table></div></td><td rowspan=2 width=5%></td></tr>" +

							"</table></div>" +
							"<hr class=hrStyle>";

                $("#listofdeck").append(deckList);
            });
        });
    });
}

// Display deck summary
function FCDeckSummary(tempDeckId, time, defDeckOwnerId) {
   
    var deckId = $("#d" + tempDeckId).html();

    var totalCard = 0, correctCard = 0, dkName;
    dkId = deckId;

    var flashCardSummaryHtml = '';
    setIndividualCard(dkId);

    flashCardSummaryHtml = "<div width='90%' id='flashCardStatus' > </div>" +
		"<table width='90%' class='statusBox' border='0' >" +
            "<tr><td align='left' colspan='3' class='hedingprogress'>Statistics</td></tr>" +
            "<tr><td colspan='2' align='left'>&nbsp;&nbsp;Total Time</td><td align='right'>" + formatTimeFC(time) + "&nbsp;&nbsp;</td></tr>" +
            "<tr><td colspan='2' align='left'>&nbsp;&nbsp;Total Cards</td><td align='right'><span id='totalCard'></span>&nbsp;&nbsp;</td></tr>" +
            "<tr><td colspan='2' align='left'>&nbsp;&nbsp;Correct Cards</td><td align='right'><span id='correctCard'></span>&nbsp;&nbsp;</td></tr>" +
            "<tr><td align='left' colspan='3' class='hedingprogress'>Individual Cards</td></tr>" +
            "<tr><td colspan='3' align='left'><span id='individualCards'></span></td></tr>" +
        "</table>";

    $("#FlashCardDeckSummary").html(flashCardSummaryHtml);


    db.transaction(function(txt) {

        txt.executeSql('SELECT deckName as deckName from tbDeck dk, tbUserDeck udk where dk.deckId = udk.deckId AND udk.userId=? AND dk.deckId=?', [userId, deckId], function(txt, result) {
            //	var totalDefDeck =getDefDeckNo();
            var data = result.rows.item(0);
            dkName = data.deckName;

            txt.executeSql('SELECT count(*) AS fcCount from tbFlashCard WHERE deckId=?', [deckId], function(txt, result) {

                var data = result.rows.item(0);
                totalCard = data.fcCount;
                $("#totalCard").html(totalCard);

                txt.executeSql('SELECT count(*) AS undCount from tbFCStatus fs, tbFlashCard fc where fs.fcid = fc.fcid and  fs.isHidden=? AND fc.deckId =? AND fs.ownerId=?', [1, deckId, userId], function(txt, result) {
                    var data = result.rows.item(0);
                    correctCard = data.undCount;
                    $("#correctCard").html(correctCard);

                    var tempHtml = '';
                    var per = Math.round((correctCard / totalCard) * 100);
                    if (isNaN(per)) {
                        per = 0;
                    }
                    var remainingCards = totalCard - correctCard;
                    if (defDeckOwnerId >= 0) {
                        setDeckImage = 'images/icons/icon_customflashcards.png';
                    } else {
                        setDeckImage = 'images/icons/icon_flashcards.png';
                    }
                    tempHtml = "<div align=center class='statusBox'> <table width=100% border='0' onclick='openDeck(" + tempDeckId + "," + time + "," + defDeckOwnerId + ")'><tr><td width=15% valign=center align=center rowspan=2>";
                    tempHtml += "<div ><img src=" + setDeckImage + " style='height:30px; width:30px;' alt=''></div></td>" +
								"<td width=40%><div > " + dkName + " </div></td><td align='right'><div id='understoodPer'>" + remainingCards + " ( " + totalCard + " )</div></td></tr>";

                    tempHtml += "<tr><td colspan=2><div class='meter-wrap tapTest' style='cursor:default;'>" +
								"<div id='callProgressScreen1' class='meter-value' style='width:" + per + "%;' >" +

								"</div>" +
								"</div></td><td rowspan=2 width=5%></td></tr></table></div>";

                    tempHtml += "<table width='90%'><tr><td align='right' colspan='3'><a id='resetDeckSummary' class='link'>RESET DECK</a></td></tr></table>";

                    $("#flashCardStatus").html(tempHtml);
                });
            });
        });
    });

    changeMobilePage('#pageFCDeckSummary');
}

//Set time format
function formatTimeFC(seconds) {

    var hours = parseInt(seconds / (60 * 60));
    var minutes = parseInt((seconds % (60 * 60)) / 60);
    var seconds = parseInt(seconds - ((hours * 60 * 60) + (minutes * 60)));

    if (hours < 10) {
        hours = "0" + hours;
    }

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    var return_var = minutes + 'm ' + seconds + 's';

    return return_var;
}

/*var t;
function updateFCTimer(value) {

    if (getTimerState() == "running") {
        var newValue = value + 1;
        deckTimer = newValue;
        t = setTimeout("updateFCTimer(" + newValue + ")", 1000);
    }else{
		if(isResetCalled)
		{
			deckTimer=0;
			alert("arere");
			isResetCalled = false;
		}
		//alert(deckTimer);
	}
}*/

//method used to calculate the question time (time a user views a question)
function updateFCTimer(time) {
	deckTimer = 0;
	deckTimer = time;
	FCTimer = $.timer(function() {
			deckTimer++;  
	});
	
	FCTimer.set({ time : 1000, autostart : true });
}


//For open Deck
function openDeck(tempDeckId, time, defDeckOwnerId) {

    var deckId = $("#d" + tempDeckId).html();
    
    getTotalCard(deckId);
    setDeckId(deckId);
    calculateFCViewingTime(time);
    // var totalDefDeck = getDefDeckNo();

    db.transaction(function(txt) {

        txt.executeSql('SELECT pausedFCIndex from tbUserDeck WHERE deckId=? AND userId=?', [deckId, userId], function(txt, result) {

            var row = result.rows.item(0);
            index = row.pausedFCIndex;

            //isUser = (deckId > totalDefDeck);  
            isUser = (defDeckOwnerId >= 0);
            if (isUser) {
                db.transaction(function(txt) {
                    txt.executeSql('SELECT * from tbFlashCard WHERE deckId=?', [deckId], function(txt, result) {

                        var row = result.rows.length;
                        if (row > 0) {
                            setDeck(deckId);
                            changeMobilePage('#pageFlashCard');
                            document.getElementById("block").className = "block";
                        } else {
                            db.transaction(function(txt) {
                                txt.executeSql('SELECT deckName as deckName from tbDeck dk, tbUserDeck udk where dk.deckId = udk.deckId AND udk.userId=? AND dk.deckId=?', [userId, deckId], function(txt, result) {
                                    var data = result.rows.item(0);
                                    deck = data.deckName;
                                    document.getElementById("txtgroupName").value = deck;
                                });
                            });
                            ShowDialogInitialCard(true);
                        }
                    });
                });
            } else {
                dkId = deckId;
                setDeck(deckId);
                changeMobilePage('#pageFlashCard');
                document.getElementById("block").className = "block";
            }
        });
    });
}

//Get total number of cards of that deck
function getTotalCard(deckId) {
    db.transaction(function(txt) {
        txt.executeSql('SELECT count(*) AS fcCount from tbFlashCard WHERE deckId=?', [deckId], function(txt, result) {
            var data = result.rows.item(0);
            totalCard = data.fcCount;
            noOfCard = totalCard;
        });
    });
}

//Set and get current deck id
function setDeckId(id) {
    window.localStorage.setItem("DeckId", id);
}

function getDeckId() {
    return window.localStorage.getItem("DeckId");
}

//Calculate time 
function calculateFCViewingTime(duration) {
    setTimerState("running");
    var t = setTimeout("updateFCTimer(" + duration + ")", 1000);
	//alert("start");
    return false;
  
}

// Set and get Default deck
/*function defDeckNo(){
 	
db.transaction(function (txt) { 
txt.executeSql('SELECT * from tbDeck where ownerId=?', [-1], function(txt, result) { 
var row = result.rows.length;
setDefDeckNo(row);
		 
}); 
});

}*/
/*function setDefDeckNo(no){
window.localStorage.setItem("DefaultDeck",no);
}

function getDefDeckNo(){
return window.localStorage.getItem("DefaultDeck");
}*/

//Fill array(arrayOfDeck) of deck.
function setDeck(deckId) {

    db.transaction(function(txt) {
        txt.executeSql('SELECT * from tbFlashCard fc,tbFCStatus fs WHERE fc.fcId = fs.fcId AND fc.deckId=? AND ownerId=?', [deckId, userId], function(txt, result) {
            arrayOfDeck = new Array(result.rows.length);
            for (var i = 0; i < result.rows.length; i++) {
                arrayIndex = i + 1;
                var data = result.rows.item(i);

                arrayOfDeck[i] = (arrayIndex + "," + data.fcId + "," + data.deckId + "," + data.question + "," + data.cue + "," + data.answer + "," + data.ownerId + "," + data.fcCount);
            }
            generateCard(arrayOfDeck);
        });
    });
}

//Split array and get flash card details. 
function generateCard(arrayOfDeck) {

    deckLength = arrayOfDeck.length;
    cardData = arrayOfDeck[index].split(",");

    cardNumber = cardData[0];
    fcId = cardData[1];
    deckId = cardData[2];
    que = cardData[3];
    cue = cardData[4];
    ans = cardData[5];
    ownerId = cardData[6];
    fcCount = cardData[7];
    setFCMenu(deckId);
    checkCardStatus(fcId);
}

//Display quick navigation on flash card page for custom deck and default deck
function setFCMenu(deckId) {
    // var totalDefDeck = getDefDeckNo();
    var setmenu;
    var defaultHelp = "<div>Tap on the card to flip the card or select "+
                   "<img src='images/quicknavimgs/happy.png' alt='' height='15px' width='15px'/> if you knew the answer or <img src='images/quicknavimgs/sad.png' alt='' height='15px' width='15px'/> if you did not; the next card are will be displayed in random order."+
                   "<br/><br/> (Add status icon) Status shows deck summary with mastered card shown in green and un-mastered in red. "+

                   "<br/><br/> (Add pause icon) Pause saves the status of the deck and opens the Deck List page."+
                   "<br/><br/> (Add reset icon) You can reshuffle the deck at any time and start over again."+
                   "<br/><br/></div>";
	var customHelp =  "<div>Tap on the card to view the answer or select "+
                   "<img src='images/quicknavimgs/happy.png' alt='' height='15px' width='15px'/> if you knew the answer or <img src='images/quicknavimgs/sad.png' alt='' height='15px' width='15px'/> if you did not; the next card are will be displayed in random order."+
                   "<br/><br/> (Add personal status icon) Status shows deck summary with mastered card shown in green and un-mastered in red. "+

                   "<br/><br/> (Add pause icon) Pause saves the status of the deck and opens the Deck List page."+
                   "<br/><br/> (Add reset icon) You can reshuffle the deck at any time and start over again."+
				   "<br/><br/> (Add “+ ”icon) Add additional cards to the personal deck."+
				   "<br/><br/> (Add edit icon) Edit card being displayed."+
                   "</div>";			   
    if (isUser) {
		$("#FCHelpText").html(customHelp);
        setDeckImage = 'cardRemainingCustomIcon';
    } else {
		$("#FCHelpText").html(defaultHelp);
        setDeckImage = 'cardRemainingIcon';
    }
    setmenu = "	<table><tr id='menuFcHelp' >" +
			  "<td class='helpIcon'></td>" +
			  "<td class='line'><div class='menuItem'>HELP</div></td></tr>" +
			  "<tr id='remainingCards'><td class='" + setDeckImage + "'></td>" +
			  "<td class='line'> <div class='menuItem'>STATUS</div></td></tr>" +
			  "<tr id='pause'><td class='pauseIcon'></td>" +
			  "<td class='line'> <div class='menuItem'>PAUSE</div></td></tr>" +
			  "<tr id='resetDeckQuickNav'><td class='resetDeckIcon'></td> ";
			
			  if(isUser)
			  {
				if(!isLast)
				{
					setmenu +="<td class='line'> <div class='menuItem'>RESET</div></td></tr> ";
				}else
				{
					setmenu += "<td> <div class='menuItem'>RESET</div></td></tr>";
				}
			  }else{
				   setmenu += "<td> <div class='menuItem'>RESET</div></td></tr>";
			  }


    if (isUser) {
	
        if (isLast == false) {
			
            setmenu += "<tr id='addNewFC'> " +
						"<td class='addCardIcon'></td> " +
						"<td class='line'> <div class='menuItem'>ADD</div></td> " +
						"</tr>" +
						"<tr id='editFC' > " +
						"<td class='editCardIcon'></td>" +
						"<td> <div class='menuItem'>EDIT</div></td></tr> ";
        }
    }
    setmenu += "</table>";
    $("#showcompassFC").html(setmenu);

}

//Check card is hide or not.
function checkCardStatus(fcId) {

    db.transaction(function(txt) {
        txt.executeSql('SELECT isHidden from tbFCStatus WHERE fcId = ? AND ownerId = ?', [fcId, userId], function(txt, result) {

            var data = result.rows.item(0);
            if (data.isHidden == 0 || data.isHidden == 2) {
                showInitialCard();
            } else {
                nextCard();
            }

        });
    });
}

//Set isLast flag false 
function showInitialCard() {
    isLast = false;
    setFCMenu(deckId);
    $("#contentDiv").removeClass('contentClass');
    $("#contentDiv").addClass('contentDiv');
    displayCard(cardNumber, deckId, que, cue, ans);
}

//Display Card
function displayCard(id, deckId, que, cue, ans) {

    if (id < 10) {
        id = " 0" + id;
    } else {
        id = id;
    }

    $("#queNumber").html(id);
    $("#question").html(que);
    $("#cue").html(cue);
    $("#ansTitle").html("Answer");
    $("#answer").html(ans);

    document.getElementById("block").className = "block";
}

//First check last card .
//If it is last card then call lastPage().
//Otherwise display next card.
function nextCard() {

    index = Math.floor(Math.random() * deckLength);

    db.transaction(function(txt) {

        txt.executeSql('SELECT count(*) AS undCount from tbFCStatus fs, tbFlashCard fc where fs.fcid = fc.fcid and  fs.isHidden=? AND fc.deckId =? AND fs.ownerId=?', [1, deckId, userId], function(txt, result) {

            var uncCard = result.rows.item(0);
            undCardCountToReset = uncCard.undCount;

            //alert("noofcard" + noOfCard + "und" + undCardCountToReset)

            if (noOfCard == undCardCountToReset) {
                lastPage();
                isLast = true;
                setFCMenu(deckId);
            } else {

                isLast = false;
                setFCMenu(deckId);
                generateCard(arrayOfDeck);
                displayCard(cardNumber, deckId, que, cue, ans);


            }
        });
    });
}

//Set last page message
function lastPage() {
    document.getElementById("block").className = "block";
    $("#contentDiv").removeClass('contentDiv');
    $("#contentDiv").addClass('contentClass');
    $("#queNumber").html('');
    $("#question").html("<div align='center' style='padding-left:5%;padding-right:5%;'>All the cards have been mastered.</div>");
    $("#cue").html("<div align='center' id='resetUndDeck' style='color:#06F;padding-left:5%;padding-right:5%;'>Tap here to reset and start over again.</div><br/><div style='padding-left:5%;padding-right:5%;'>Tap on back button to view flash card decks.</div>");
    $("#ansTitle").html('');
    $("#answer").html('');


}

//Dialog for add initial card.
function ShowDialogInitialCard(modal) {
	
	refreshFields();
    $("#overlayfc").verticalcenter().show();
	
    $("#dialogfc").fadeIn(300);

    if (modal) {
        $("#overlayfc").unbind("click");
    } else {
        $("#overlayfc").click(function() {
            HideDialogInitialCard();
        });
    }
}

function HideDialogInitialCard() {
    $("#overlayfc").hide();
    $("#dialogfc").fadeOut(300);
}

//Generate list of individual card with count.
function setIndividualCard(dkId) {
    var individualCard = '';

    db.transaction(function(txt) {

        txt.executeSql('SELECT question as question, cue as cue, fcCount AS fcCount from tbFCStatus fs, tbFlashCard fc where fs.fcid = fc.fcid AND fc.deckId =? AND fs.ownerId=?', [dkId, userId], function(txt, result) {

            for (var i = 0; i < result.rows.length; i++) {
                var dataRow = result.rows.item(i);

                question = dataRow.question;
                flashCardCount = dataRow.fcCount;
                cue = dataRow.cue;

                individualCard = "<div class='statusBox'><table width=100% border='0'><tr>" +
								 "<td><div >" + question + "" + cue + " </div></td><td align='right' width=10%><div>" + flashCardCount + " </div></td></tr>" + "</table></div>";
                individualCard += "<hr class=hrStyle>";

                $("#individualCards").append(individualCard);
            }
        });
    });
}

//For flip the card
function flipCard() {
    if (isLast == false) {
        if (document.getElementById("block").className == "block") {
            document.getElementById("block").className += " rotated";
        } else {
            document.getElementById("block").className = "block";
        }
    }
}

//Assign default deck to the user
function defaultUserCards() {

    db.transaction(function(txt) {

        txt.executeSql('SELECT * from tbFCStatus where ownerId=?', [userId], function(txt, result) {

            var row = result.rows.length;
            if (row <= 0) {
                createFCForUser(userId);
            }
        });
    });
}

function createFCForUser(id) {
    db.transaction(function(txt) {
        txt.executeSql('SELECT fcId from tbFlashCard where deckId in (select deckId from tbDeck where ownerId=?) ', [-1], function(txt, result) {

            for (var i = 0; i < result.rows.length; i++) {
                var deckRow = result.rows.item(i);
                setfcId = deckRow.fcId;
                txt.executeSql('INSERT INTO tbFCStatus (fcId, ownerId, fcCount, isHidden) VALUES (?,?,?,?)', [setfcId, id, 0, 0]);

            }
        });

        txt.executeSql('SELECT deckId from tbDeck where ownerId=?', [-1], function(txt, result) {

            for (var i = 0; i < result.rows.length; i++) {
                var deckRow = result.rows.item(i);
                setDkId = deckRow.deckId;
                txt.executeSql('INSERT INTO tbUserDeck (deckId, userId, timeToView, pausedFCIndex) VALUES (?,?,?,?)', [setDkId, id, 0, 0]);

            }
        });
    });
}


function ShowDialogNewDeck(modal) {
	document.getElementById("txtDeckName").value = "";
	document.getElementById("txtDeckName").style.border = "0px";
	document.getElementById("txtDeckName").style.borderBottom = "3px solid #AAA";
    $("#overlaydeck").verticalcenter().show();
    $("#dialogdeck").fadeIn(300);

    if (modal) {
        $("#overlaydeck").unbind("click");
    } else {
        $("#overlaydeck").click(function() {
            HideDialogNewDeck();
        });
    }
}

function HideDialogNewDeck() {
    $("#overlaydeck").hide();
    $("#dialogdeck").fadeOut(300);
}

//Create new deck.
function createNewDeck() {
    var newDeckId = getPrimaryKey();
    document.getElementById("txtDeckName").style.backgroundColor = "";
    var newDeckName = document.getElementById("txtDeckName").value;
    var tempArray = newDeckName.split(' ');
    for (var i = 0; i < tempArray.length; i++) {
        tempArray[i] = tempArray[i].charAt(0).toUpperCase() + tempArray[i].substring(1);
    }
    newDeckName = tempArray.toString().replaceAll(',', ' ');

    if (newDeckName == "") {
        showAppToast('showNoticeToast', 'You must fill deck name field', 2000);
        document.getElementById("txtDeckName").style.border = "1px solid red";
    } else {
        db.transaction(function(txt) {

            txt.executeSql('SELECT * from tbDeck where deckName=? AND ownerId=? OR deckName=? AND ownerId=?', [newDeckName, userId, newDeckName, -1], function(txt, result) {
                var row = result.rows.length;

                if (row > 0) {
                    showAppToast('showNoticeToast', 'This deck already exist', 2000);
                    //alert("Already exist this deck.");
                } else {

                    txt.executeSql('INSERT INTO tbDeck (deckId, deckName, ownerId) VALUES (?,?,?)', [newDeckId, newDeckName, userId],
					function(txt, result) {
					    /*		txt.executeSql('SELECT max(deckId) as deckId from tbDeck where ownerId=?', [userId], function(txt, result) {
					    var deckRow = result.rows.item(0);
					    setNewDeckId = deckRow.deckId;*/
					    txt.executeSql('INSERT INTO tbUserDeck(deckId, userId, timeToView, pausedFCIndex) VALUES (?,?,?,?)', [newDeckId, userId, 0, 0], function(txt, result) {

					        $("#listofdeck").html('');
					        $("#deckofuser").html('');
					        createDeck();
					        document.getElementById("txtDeckName").value = "";
					        document.getElementById("txtDeckName").style.border = "0px";
					        document.getElementById("txtDeckName").style.borderBottom = "3px solid #AAA";
					        HideDialogNewDeck();

					        //});  
					    });
					});

                }
            });
        });
    }
}

//Hide card
function removeFlashCard(fcId) {
    FCNumeber = fcId;
    db.transaction(function(txt) {
        txt.executeSql('UPDATE tbFCStatus set isHidden =? WHERE  fcId=? AND ownerId=?', [1, fcId, userId]);
    });
}
//Skip card
function skipFlashCard(fcId) {
    FCNumeber = fcId;
    db.transaction(function(txt) {
        txt.executeSql('UPDATE tbFCStatus set isHidden =? WHERE  fcId=? AND ownerId=?', [2, fcId, userId]);
    });
}
//Reset Deck
function resetDeck(deckId) {
	
    db.transaction(function(txt) {
		
		
        txt.executeSql('UPDATE tbFCStatus SET isHidden=? WHERE fcId In (select fcId from tbFlashCard WHERE deckId =?) And ownerId = ?', [0, deckId, userId]);
		
        txt.executeSql('UPDATE tbUserDeck SET timeToView=?, pausedFCIndex=? WHERE deckId=? And userId = ?', [0, 0, deckId, userId]);
	
        //changeMobilePage('#pageDeckOfFlashCard');
    });
	
    FCTimer.pause();
    isSetTimeDone = true;
	isResetCalled = true;
}

//Remaining card list
function generateFCList() {
    var colorcode;

    db.transaction(function(txt) {
        txt.executeSql('SELECT deckName as deckName from tbDeck dk, tbUserDeck udk where dk.deckId = udk.deckId AND udk.userId=? AND dk.deckId=?', [userId, deckId], function(txt, result) {

            var data = result.rows.item(0);
            groupName = data.deckName;

            var j = 0;
            var k = 0;
            colorcode = 'unansweredColor';

            var fclist = "<div style='width:100%'><table width='100%' id='defcomscreen'>";
            fclist += "<tr><td colspan='5'> GROUP : " + groupName + " </td></tr><tr>";

            txt.executeSql('SELECT fcCount,isHidden,fs.fcId from tbFCStatus fs,tbFlashCard fc where fs.fcid = fc.fcid AND fc.deckId =? AND fs.ownerId=?', [deckId, ownerId], function(txt, result) {

                for (var i = 0; i < result.rows.length; i++) {

                    var fcitem = result.rows.item(i);
                    fcnum = fcitem.fcId;

                    //var isSkiped = fcitem.fcCount;
                    //var isHidden = fcitem.isHidden;

                    colorcode = 'unansweredColor';
                    k++;

                    if (j == 5) {
                        fclist += "</tr><tr>";
                        j = 1;
                    } else {
                        j++;
                    }
                    if (fcitem.isHidden == 1) {
                        colorcode = 'understoodCardsColor';

                    } else if (fcitem.fcCount > 0 && fcitem.isHidden == 0) {
                        colorcode = 'unansweredColor';
						
                    } else if (fcitem.fcCount > 0 && fcitem.isHidden == 2) {
                        colorcode = 'skipedCardsColor';
					}

                    if (colorcode == 'unansweredColor' || colorcode == 'skipedCardsColor') {
                        fclist += "<td class='buttons " + colorcode + "'><div id=" + fcnum + " onclick='showFC(" + i + ")'>" + k + "</div></td>";
                    } else {
                        fclist += "<td class='buttons " + colorcode + "'><div id=" + fcnum + " >" + k + "</div></td>";
                    }

                }

                fclist += "</tr></table></div>"
                $("#fclist").html(fclist);
            });
        });
    });
}

function showFC(fcnum) {
    index = fcnum;

    generateCard(arrayOfDeck);
    displayCard(cardNumber, deckId, que, cue, ans);

    changeMobilePage('#pageFlashCard');
}

function removeByValue(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}

// Save New Flash Card
function saveFC(deckId, userId) {

    que = document.getElementById("txtquestion").value;
    cue = document.getElementById("txtcue").value;
    ans = document.getElementById("txtanswer").value;

    if (que == "" || ans == "") {
        showAppToast('showNoticeToast', 'You must fill question and answer fields', 2000);
        document.getElementById("txtquestion").style.border = "1px solid red";
        document.getElementById("txtanswer").style.border = "1px solid red";
        // alert("You must fill question and answer fields.");
    } else {

        db.transaction(function(txt) {
            var newFCID = getPrimaryKey();
            txt.executeSql('INSERT INTO tbFlashCard (fcId, deckId, question, cue, answer) VALUES (?,?,?,?,?)', [newFCID, deckId, que, cue, ans]);

            /*		txt.executeSql('SELECT fcId from tbFlashCard where deckId=?', [deckId], function(txt, result) {
            var deckRow = result.rows.item(0);
            setfcId = deckRow.fcId;*/

            txt.executeSql('INSERT INTO tbFCStatus (fcId, ownerId, fcCount, isHidden) VALUES (?,?,?,?)', [newFCID, userId, 0, 0]);
            //});
            showAppToast('showNoticeToast', 'Card Added Successfully', 2000);
            getTotalCard(deckId);
            document.getElementById("txtquestion").style.border = "0px";
            document.getElementById("txtanswer").style.border = "0px";
            document.getElementById("txtquestion").style.borderBottom = "3px solid #AAA";
            document.getElementById("txtanswer").style.borderBottom = "3px solid #AAA";
            //alert("Card Added Successfully.");
            createDeck();
			document.getElementById("txtquestion").focus();
            //HideDialogInitialCard();
            refreshFields();
        });
    }
}

function saveNewFC(deckId, userId) {

    if (isEdit) {
        editFCW();
    } else {

        queN = document.getElementById("txtquestionN").value;
        cueN = document.getElementById("txtcueN").value;
        ansN = document.getElementById("txtanswerN").value;

        if (queN == "" || ansN == "") {
            showAppToast('showNoticeToast', 'You must fill question and answer fields', 2000);
            document.getElementById("txtquestionN").style.border = "1px solid red";
            document.getElementById("txtanswerN").style.border = "1px solid red";
            //alert("You must fill question and answer fields.");
        } else {

            db.transaction(function(txt) {
                var newFCID = getPrimaryKey();
                txt.executeSql('INSERT INTO tbFlashCard (fcId, deckId, question, cue, answer) VALUES (?,?,?,?,?)', [newFCID, deckId, queN, cueN, ansN],

					function(txt, result) {
					    /*				txt.executeSql('SELECT max(fcId) as fcId from tbFlashCard where deckId=?', [deckId], function(txt, result) {
						
						var deckRow = result.rows.item(0);
					    setfcId = deckRow.fcId;*/

					    txt.executeSql('INSERT INTO tbFCStatus (fcId, ownerId, fcCount, isHidden) VALUES (?,?,?,?)', [newFCID, userId, 0, 0],

						function(txt, result) {
						    showAppToast('showNoticeToast', 'Card Added Successfully', 2000);
						    getTotalCard(deckId);
						    //alert("Card Added Successfully.");

						    document.getElementById("txtquestionN").style.border = "0px";
						    document.getElementById("txtanswerN").style.border = "0px";
						    document.getElementById("txtquestionN").style.borderBottom = "3px solid #AAA";
						    document.getElementById("txtanswerN").style.borderBottom = "3px solid #AAA";
  							document.getElementById("txtquestionN").focus();
						    setDeck(deckId);
						    refreshFieldsN();
						});
					    //});	
					});
            });
        }
    }
}
//Clear text box
function refreshFields() {
    
    que = document.getElementById("txtquestion").value = "";
    cue = document.getElementById("txtcue").value = "";
    ans = document.getElementById("txtanswer").value = "";
	document.getElementById("txtquestion").style.border = "0px";
	document.getElementById("txtanswer").style.border = "0px";
	document.getElementById("txtquestion").style.borderBottom = "3px solid #AAA";
	document.getElementById("txtanswer").style.borderBottom = "3px solid #AAA";
}

function refreshFieldsN() {
    queN = document.getElementById("txtquestionN").value = "";
    cueN = document.getElementById("txtcueN").value = "";
    ansN = document.getElementById("txtanswerN").value = "";
	document.getElementById("txtquestionN").style.border = "0px";
	document.getElementById("txtanswerN").style.border = "0px";
	document.getElementById("txtquestionN").style.borderBottom = "3px solid #AAA";
	document.getElementById("txtanswerN").style.borderBottom = "3px solid #AAA";
}

// Edit User Card Content
function editMyCards() {
    db.transaction(function(txt) {
        txt.executeSql('SELECT * from tbFlashCard WHERE fcId = ?', [fcId], function(txt, result) {

            for (var i = 0; i < result.rows.length; i++) {
                var item = result.rows.item(i);
                nfcId = item.nfcId;
                gid = item.deckId;
                question = item.question;
                cue = item.cue;
                answer = item.answer;

                db.transaction(function(txt) {
                    txt.executeSql('SELECT deckName as deckName from tbDeck dk, tbUserDeck udk where dk.deckId = udk.deckId AND udk.userId=? AND dk.deckId=?', [userId, deckId], function(txt, result) {
                        var data = result.rows.item(0);
                        deck = data.deckName;
                        document.getElementById("txtgroupNameN").value = deck;
                    });
                });

                document.getElementById('txtquestionN').value = question;
                document.getElementById('txtcueN').value = cue;
                document.getElementById('txtanswerN').value = answer;

            }
        });
    });

    ShowDialogAddCard(true);
}

// Edit Flash Card
function editFCW() {

    gId = document.getElementById("txtgroupNameN").value;
    que = document.getElementById("txtquestionN").value;
    cue = document.getElementById("txtcueN").value;
    ans = document.getElementById("txtanswerN").value;

    db.transaction(function(txt) {
        txt.executeSql("UPDATE tbFlashCard SET deckId = ? , question = ? , cue = ? ,answer = ? WHERE  fcId = ? ", [deckId, que, cue, ans, fcId]);

        //alert("Data Update Successfully.");
        showAppToast('showNoticeToast', 'Data Update Successfully', 2000);
        setDeck(deckId);
        refreshFieldsN();
        HideDialogAddCard();
    });
}

//Set viewed count to card.
function individualCount(fcId) {

    var count;
    db.transaction(function(txt) {
        txt.executeSql('SELECT fcCount AS fcCount from tbFCStatus where fcId=?', [fcId], function(txt, result) {
            var data = result.rows.item(0);
            count = data.fcCount;
            count++;
            txt.executeSql("UPDATE tbFCStatus SET fcCount = ? WHERE fcId=? ", [count, fcId]);
        });
    });
}

//Tap event
$("#btnDelete").live('tap', function(event, ui) {
    event.preventDefault();

    individualCount(fcId);
    removeFlashCard(fcId);
    nextCard();

});

$("#btncross").live('tap', function(event, ui) {
    event.preventDefault();
    individualCount(fcId);
	skipFlashCard(fcId);
    nextCard();
});

$("#resetDeckQuickNav").live('tap', function(event, ui) {

    event.preventDefault();
    resetDeck(deckId);
    changeMobilePage('#pageDeckOfFlashCard');
});
$("#resetDeckSummary").live('tap', function(event, ui) {

    event.preventDefault();
    resetDeck(dkId);
    changeMobilePage('#pageDeckOfFlashCard');
});
$("#resetUndDeck").live('tap', function(event, ui) {

    event.preventDefault();
    resetDeck(deckId);
    setDeck(deckId);
	calculateFCViewingTime(0);
    //changeMobilePage('#pageDeckOfFlashCard');
});
/*$("#flashCardStatus").live('tap', function(event, ui) {

    event.preventDefault();
    goBack('#pageDeckOfFlashCard');
    //changeMobilePage('#pageDeckOfFlashCard');
});*/
$("#remainingCards").live('tap', function(event, ui) {
   FCTimer.pause();
    event.preventDefault();
    changeMobilePage('#pageFCSummary');
    generateFCList();
});

$("#btnCloseDeck").live('tap', function(event, ui) {
    event.preventDefault();
    HideDialogNewDeck();
});

$("#btnCloseDia").live('tap', function(event, ui) {
    event.preventDefault();
    HideDialogInitialCard();
});

$("#btnCloseUDia").live('tap', function(event, ui) {
    event.preventDefault();
    HideDialogAddCard();
});

$("#btnSaveInitialCard").live('tap', function(event, ui) {
    event.preventDefault();
    saveFC(getDeckId(), userId);
});

$("#btnSaveUserCard").live('tap', function(event, ui) {
    event.preventDefault();
    saveNewFC(deckId, userId);
});

$("#addNewFC").live('tap', function(event, ui) {
    event.preventDefault();
    isEdit = false;
    db.transaction(function(txt) {
        txt.executeSql('SELECT deckName as deckName from tbDeck dk, tbUserDeck udk where dk.deckId = udk.deckId AND udk.userId=? AND dk.deckId=?', [userId, deckId], function(txt, result) {
            var data = result.rows.item(0);
            deck = data.deckName;
            document.getElementById("txtgroupNameN").value = deck;
        });
    });

    ShowDialogAddCard(true);
});

$("#editFC").live('tap', function(event, ui) {
    event.preventDefault();
    isEdit = true;
    editMyCards();
});

$("#pause").live('tap', function(event, ui) {
FCTimer.pause();
    event.preventDefault();
    db.transaction(function(txt) {
        txt.executeSql("UPDATE tbUserDeck SET pausedFCIndex = ? WHERE  deckId = ?", [index, deckId]);
    });
    isSetTimeDone = false;
    changeMobilePage('#pageDeckOfFlashCard');
});



//-------------------------------------------------------------------------------------------------------------------------------------------------------
var winW = window.innerWidth;


if (winW <= 320) {
    document.write('<link rel="stylesheet" type="text/css" href="css/smallScreen.css">');
} else if (winW > 320 && winW <= 600) {
    document.write('<link rel="stylesheet" type="text/css" href="css/mediumScreen.css">');
} else if (winW > 600) {
    document.write('<link rel="stylesheet" type="text/css" href="css/bigScreen.css">');
} else {
    document.write('<link rel="stylesheet" type="text/wcss" href="css/smallScreen.css">');
}

//QuickNavigation
$("#quickNavigationDeck").live('tap', function(event, ui) {
     event.preventDefault();
    $("#showcompassDeck").toggle("fast");
    ShowDialogHelpDeckFC(true);
});

$("#showcompassDeck").live('tap', function(event, ui) {
    event.preventDefault();
    $("#showcompassDeck").toggle("fast");
    ShowDialogHelpDeckFC(true);
});

$("#darkLayerMenuDeck").live('tap', function(event, ui) {
    event.preventDefault();
    $("#showcompassDeck").hide();
    $("#darkLayerMenuDeck").hide();
    HideDialogHelpDeckFC();
});

function ShowDialogHelpDeckFC(modal) { // to show toast/msgbox 

    $("#darkLayerMenuDeck").verticalcenter().show();
    $("#dialogDeckFCHelp").fadeIn(300);

    if (modal) {
        $("#darkLayerMenuDeck").unbind("click");
    }
}

function HideDialogHelpDeckFC() { // to hide toast / msgbox

    $("#dialogDeckFCHelp").fadeOut(300);
    $("#darkLayerMenuDeck").hide();
}

$("#btnCloseDeckFCHelp").live('tap', function(event, ui) {
    HideDialogHelpDeckFC();
});

var isFCMenuSelected = false;
$("#quickNavigationFC").live('tap', function(event, ui) {
    event.preventDefault();
    $("#showcompassFC").toggle("fast");
    toggleScreenStateNavigation('#darkLayerdeckfc');

});

$("#showcompassFC").live('tap', function(event, ui) {
    event.preventDefault();
    $("#showcompassFC").toggle("fast");
    if (isFCMenuSelected == false) {
        toggleScreenEffectForPT('#darkLayerdeckfc');
    }
    isFCMenuSelected = false;
});

$("#menuFcHelp").live('tap', function(event, ui) {
    event.preventDefault();
    ShowDialogHelpFC(true);
    isFCMenuSelected = true;
});

$("#darkLayerdeckfc").live('tap', function(event, ui) {
    event.preventDefault();
    $("#showcompassFC").hide();
    $("#darkLayerdeckfc").hide();
    HideDialogHelpFC();
});

$("#contentDiv").live('tap', function(event, ui) {
    event.preventDefault();

    if (isLast) {
        $("#contentDiv").removeClass('contentDiv');
        $("#contentDiv").addClass('contentClass');
    } else {

        if ($("#contentDiv").hasClass('contentDiv')) {

            flipCard();

        }

    }
});

function ShowDialogHelpFC(modal) { // to show toast/msgbox 
    $("#darkLayerdeckfc").verticalcenter().show();
    $("#dialogFCHelp").fadeIn(300);

    if (modal) {
        $("#darkLayerdeckfc").unbind("click");
    }
}

function HideDialogHelpFC() { // to hide toast / msgbox
    $("#dialogFCHelp").fadeOut(300);
    $("#darkLayerdeckfc").hide();
}

$("#btnCloseFCHelp").live('tap', function(event, ui) {
    HideDialogHelpFC();
});

function toggleScreenStateNavigation(layer) {

    $(layer).css('display', $(layer).css('display') == 'none' ? 'block' : 'none');

}

function ShowDialogAddCard(modal) {
	refreshFieldsN();
    $("#overlayufc").verticalcenter().show();
    $("#dialogufc").fadeIn(300);

    if (modal) {
        $("#overlayufc").unbind("click");
    } else {
        $("#overlayufc").click(function() {
            HideDialogAddCard();
        });
    }
}

function HideDialogAddCard() {
    $("#overlayufc").hide();
    $("#dialogufc").fadeOut(300);
}

