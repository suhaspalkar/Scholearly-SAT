var isTest = false;
var isShown=false;
var isCumulativeProgress = false;
var isIndividualProgress = false;
var isPaperdetailsCumulative = false;
var isPaperdetailsIndividual = false;
var isHomeScreen = false;

function saveAndClose() {
    history.back();
}

function ToDo() {
    showAppToast('showNoticeToast', 'Feature coming soon in next version of the App.', 3000);
}

function passQuestVar(randomQuestBtn) {
    return randomQuestBtn;
}

function toggleScreenState(layer, icon) {
    $(layer).css('display', $(layer).css('display') == 'none' ? 'block' : 'none');
    $(icon).attr('src', $(icon).attr('src') == 'images/up_arrow.png' ? 'images/dwn_arrow.png' : 'images/up_arrow.png');
}

$('#pageHome').live('pagebeforeshow', function(event, ui) {
    isHomeScreen = true;
});

$('#pageHome').live('pagebeforehide', function(event, ui) {
    isHomeScreen = false;
});



$('#pageHome').live('pageinit', function() {
    window.localStorage.setItem("PTshowAtw", false);
});

$('#pageSelectQuestion').live('pagebeforeshow', function(event, ui) {
    generateQuestionIcons();
});

$("#showTimer").live('click', function(event, ui) {
    event.preventDefault();
    $("#panelTimer").toggle("fast");
    $(this).toggleClass("active");
    return false;
});

$("#myTestPageNavButton").live('click', function(event, ui) {
    event.preventDefault();
    $("#myTestPanel").slideToggle("slow");
    $(this).toggleClass("");
    toggleScreenState('#darkLayerMyTest', '#imgMyTestNavigate');
    return false;
});

$("#qotdPageNavButton").live('click', function(event, ui) {
    event.preventDefault();
    $("#qotdPanel").slideToggle("slow");
    $(this).toggleClass("");
    toggleScreenState('#darkLayerQotd', '#imgQotdNavigate');
    return false;
});

$("#fcDeckPageNavButton").live('click', function(event, ui) {
    event.preventDefault()
    $("#fcDeckPanel").slideToggle("slow");
    $(this).toggleClass("");
    toggleScreenState('#darkLayerdeck', '#imgFcDeckNavigate');
    return false;
});

$("#ptPageNavButton").live('click', function(event, ui) {
    event.preventDefault();
    $("#ptPanel").slideToggle("slow");
    $(this).toggleClass("");
    toggleScreenState('#darkLayerPT', '#imgPtNavigate');
    return false;
});

$("#referencePageNavButton").live('click', function(event, ui) {
    event.preventDefault();
    $("#referencePanel").slideToggle("slow");
    $(this).toggleClass("");
    toggleScreenState('#darkLayerReference', '#imgReferenceNavigate');
    return false;
});
//Avinash
$("#MyAccountRegisteredNavButton").live('click', function(event, ui) {
    event.preventDefault();
    $("#MyAccountRegisteredPanel").slideToggle("slow");
    $(this).toggleClass("");
    toggleScreenState('#darkLayerMyAccountRegistered', '#imgMyAccountRegistered');
    return false;
});
$("#ChangePasswordNavButton").live('click', function(event, ui) {
    event.preventDefault();
    $("#ChangePasswordPanel").slideToggle("slow");
    $(this).toggleClass("");
    toggleScreenState('#darkLayerChangePassword', '#imgChangePassword');
    return false;
});
$("#PaperSummaryNavButton").live('click', function(event, ui) {
    event.preventDefault();
    $("#PaperSummaryPanel").slideToggle("slow");
    $(this).toggleClass("");
    toggleScreenState('#darkLayerPaperSummary', '#imgPaperSummary');
    return false;
});
$("#PaperDetailsNavButton").live('click', function(event, ui) {
    event.preventDefault();
    $("#PaperDetailsPanel").slideToggle("slow");
    $(this).toggleClass("");
    toggleScreenState('#darkLayerPaperDetails', '#imgPaperDetails');
    return false;
});

$("#ReviewQuestionNavButton").live('click', function(event, ui) {
    event.preventDefault();
    $("#ReviewQuestionPanel").slideToggle("slow");
    $(this).toggleClass("");
    toggleScreenState('#darkLayerReviewQuestion', '#imgReviewQuestion');
    return false;
});

//Avinash 

$("#questionPageNavButton").live('click', function(event, ui) {
    event.preventDefault();
    $("#panel2").slideToggle("slow");
    $(this).toggleClass("");
    toggleScreenState('#darkLayer1', '#imgNavigate2');
    var state;
    state = getTimerState();
    if (state == "running") {
        state = "paused";
    } else {
        state = "running";
    }
    setTimerState(state);
    return false;
});

$('#btnLoginLink, #btnChangePassword, #btnRegister, #btnLogin, #btnReference, #btnTest, #btnFlashCards, #btnTimedTest, #btnQOTD, #btnGetMore, #btnPeriodicTable, #btnNavResume, #btnNavProgress, #btnNavTimed, #btnNavMyTestHome, #btnNavMyTestLearn,#btnNavPtLearn, #btnNavMyTestQOTD, #btnNavMyTests, #btnNavQotdHome, #btnNavQotdLearn, #btnNavQotdMyTests, #btnNavReferenceHome, #btnNavReferenceQOTD, #btnNavReferenceMyTests, #btnNavFcDeckHome,#btnNavFcDeckQOTD, #btnNavFcDeckMyTests,#btnNavFcDeckLearn,#btnNavPtHome,#btnNavPtQOTD,#btnNavPtMyTests ,#btnGetMoreTests,#btnChangePass,#btnLogout, #btnPageJudgeMe,#btnMyAccountRegistered, #btnNewFlashCardDeck,#btnNavMyAccountRegisteredHome,#btnNavMyAccountRegisteredQOTD,#btnNavMyAccountRegisteredMyTests,#btnNavMyAccountRegisteredReference,#btnNavChangePasswordHome,#btnNavChangePasswordQOTD,#btnNavChangePasswordMyTests,#btnNavChangePasswordReference,#btnNavPaperSummaryHome,#btnNavPaperSummaryQOTD,#btnNavPaperSummaryMyTests,#btnNavPaperSummaryReference,#btnNavPaperDetailsHome,#btnNavPaperDetailsQOTD,#btnNavPaperDetailsMyTests,#btnNavPaperDetailsReference, #btnRestore, #btnBackup,#lnkShowTest,#lnkShowcumulativeTest,#btnNavReviewQuestionHome,#btnNavReviewQuestionQOTD,#btnNavReviewQuestionMyTests,#btnNavReviewQuestionReference').live('tap', function(event, ui) {
    event.preventDefault();

    var selOpt = $(this).attr('id');
    if (selOpt == 'btnLoginLink') {
        if (document.getElementById("userId").value != "" && document.getElementById("userPassword").value != "") {
            if (validateEmail(document.getElementById("userId").value)) {
                if (validatePassword(document.getElementById("userPassword").value)) {
                    checklogin(document.getElementById("userId").value, document.getElementById("userPassword").value);
                } else {
                    showAppToast('showWarningToast', 'Password must be of min 4 characters', 3000);
                }
            } else {
                showAppToast('showNoticeToast', 'Enter valid email', 3000);
            }
        } else {
			
            changeMobilePage('#pageLogin');
        }
    }
/*    else if (selOpt == 'btnRegisterLink') {
        if (document.getElementById("userId2").value != "" && document.getElementById("userPassword2").value != "") {
            if (validateEmail(document.getElementById("userId2").value)) {
                if (validatePassword(document.getElementById("userPassword2").value)) {
                    document.getElementById("userId").value = document.getElementById("userId2").value;
                    document.getElementById("userPassword").value = document.getElementById("userPassword2").value;
                    document.getElementById("userConfirmPassword").value = "";
                    changeMobilePage('#pageRegister');
                } else {
                    showAppToast('showWarningToast', 'Password must be of min 4 characters', 3000);
                }
            } else {
                showAppToast('showNoticeToast', 'Enter valid email', 3000);
            }
        } else {
            changeMobilePage('#pageRegister');
        }
    }*/
    else if (selOpt == 'btnLoginLink1') {
        if (document.getElementById("userId3").value != "" && document.getElementById("userPassword3").value != "") {
            if (validateEmail(document.getElementById("userId3").value)) {
                if (validatePassword(document.getElementById("userPassword3").value)) {
                    checklogin(document.getElementById("userId3").value, document.getElementById("userPassword3").value);
                } else {
                    showAppToast('showWarningToast', 'Password must be of min 4 characters', 3000);
                }
            } else {
                showAppToast('showNoticeToast', 'Enter valid email', 3000);
            }
        } else {
            checklogin(document.getElementById("userId3").value, document.getElementById("userPassword3").value);
        }
    }
    else if (selOpt == 'btnRegisterLink1') {
        if (document.getElementById("userId3").value != "" && document.getElementById("userPassword3").value != "") {
            document.getElementById("userId").value = document.getElementById("userId3").value;
            document.getElementById("userPassword").value = document.getElementById("userPassword3").value
        }
        changeMobilePage('#pageRegister');
    }
    else if (selOpt == 'btnRegister' || selOpt == 'btnLogin') {
        if (selOpt == 'btnLogin') {
            if (document.getElementById("userId1").value != "" && document.getElementById("userPassword1").value != "") {
                if (validateEmail(document.getElementById("userId1").value)) {
                    if (validatePassword(document.getElementById("userPassword1").value)) {
                        checklogin(document.getElementById("userId1").value, document.getElementById("userPassword1").value);
                    } else {
                        showAppToast('showWarningToast', 'Password must be of min 4 characters', 3000);
                    }
                } else {
                    showAppToast('showNoticeToast', 'Enter valid email', 3000);
                }
            } else {
					if(document.getElementById("userId1").value == "" && document.getElementById("userPassword1").value == ""){
						showAppToast('showNoticeToast', 'Email Address and Password are compulsory.', 3000);
					}else if(document.getElementById("userId1").value == ""){
						showAppToast('showNoticeToast', 'Please Enter Email.', 3000);
					}else if(document.getElementById("userPassword1").value == ""){
						showAppToast('showNoticeToast', 'Please Enter Password.', 3000);
					}
            }
        } else {
					if (document.getElementById("userId").value != "" && document.getElementById("userPassword").value != "") {
						if (validateEmail(document.getElementById("userId").value)) {
							if (validatePassword(document.getElementById("userPassword").value)) {
								if(document.getElementById("userConfirmPassword").value=="" ){	
									 if(isShown==true){
										showAppToast('showNoticeToast', 'Enter Confirm Password.', 3000);
									 }else{
									 $('#userConfirmPassword').show();
									 $('#btnLoginLink').hide();
									 isShown=true;
									 }
								}else{
									if (validatePassword(document.getElementById("userConfirmPassword").value)) {
										showUser();
									} else {
										showAppToast('showWarningToast', 'Password must be of min 4 characters', 3000);
									}
								}
							} else {
								showAppToast('showWarningToast', 'Password must be of min 4 characters', 3000);
							}
						} else {
							showAppToast('showNoticeToast', 'Enter valid email', 3000);
						}
				} else {
					showAppToast('showNoticeToast', 'Please enter all fields', 3000);
			}
		}
    }
    else if (selOpt == 'btnReference') {

        changeMobilePage('#pageReference');
    }
    else if (selOpt == 'btnNavMyTestLearn') {
        $('.btn-slide-mytest').click();

        changeMobilePage('#pageReference');
    }
    else if (selOpt == 'btnNavQotdLearn') {
        $('.btn-slide-qotd').click();

        changeMobilePage('#pageReference');
    }
    else if (selOpt == 'btnNavFcDeckQOTD') {
        $('.btn-slide-fcDeck').click();
        showQOTDDateList('');

        changeMobilePage('#pageQuestionOfDayList');
    }
    else if (selOpt == 'btnNavPtQOTD') {
        $('.btn-slide-pt').click();
        showQOTDDateList('');

        changeMobilePage('#pageQuestionOfDayList');
    }
    else if (selOpt == 'btnNavPtLearn') {
        $('.btn-slide-pt').click();

        changeMobilePage('#pageReference');
    }
    else if (selOpt == 'btnNavProgress') {
        $('.btn-slide').click();

        changeMobilePage('#pageJudgeMe');
    }
    else if (selOpt == 'btnTest') {
        changeMobilePage('#pageMyTest');
    }
    else if (selOpt == 'btnNavQotdHome') {

        changeMobilePage('#pageHome');
        $('.btn-slide-qotd').click();
    }
    else if (selOpt == 'btnNavPtHome') {

        changeMobilePage('#pageHome');
        $('.btn-slide-pt').click();
    }
    else if (selOpt == 'btnNavFcDeckHome') {

        changeMobilePage('#pageHome');
        $('.btn-slide-fcDeck').click();
    }
    else if (selOpt == 'btnNavReferenceHome') {

        changeMobilePage('#pageHome');
        $('.btn-slide-reference').click();
    }
    else if (selOpt == 'btnNavMyTestHome') {

        changeMobilePage('#pageHome');
        $('.btn-slide-mytest').click();

    }
    else if (selOpt == 'btnNavQotdMyTests') {
        $('.btn-slide-qotd').click();

        changeMobilePage('#pageMyTest');
    }
    else if (selOpt == 'btnNavFcDeckMyTests') {
        $('.btn-slide-fcDeck').click();

        changeMobilePage('#pageMyTest');

    }
    else if (selOpt == 'btnNavFcDeckLearn') {

        $('.btn-slide-fcDeck').click();

        changeMobilePage('#pageReference');
    }
    else if (selOpt == 'btnNavPtMyTests') {
        $('.btn-slide-pt').click();

        changeMobilePage('#pageMyTest');
    }
    else if (selOpt == 'btnNavReferenceMyTests') {
        $('.btn-slide-reference').click();

        changeMobilePage('#pageMyTest');
    }
    else if (selOpt == 'btnNavReferenceQOTD') {
        $('.btn-slide-reference').click();
        showQOTDDateList('');

        changeMobilePage('#pageQuestionOfDayList');
    }
    else if (selOpt == 'btnNavMyTestQOTD') {
        $('.btn-slide-mytest').click();
        showQOTDDateList('');

        changeMobilePage('#pageQuestionOfDayList');

    }
    else if (selOpt == 'btnFlashTest' || selOpt == 'btnRandomQuestions' || selOpt == 'btnCrossword' || selOpt == 'btnMovie' || selOpt == 'btnGetMore') {
        if (selOpt == 'btnGetMore') {

            changeMobilePage('#pageChangePassword');
        } else {
            ToDo();
        }
    }
    else if (selOpt == 'btnFlashCards') {

        changeMobilePage('#pageDeckOfFlashCard');
    }
    else if (selOpt == 'btnPeriodicTable') {

        $('#divPageQuestionTest').css('display', 'none');
        $('#divPageReferenceBack').css('display', 'inline');

        $('#PTtabID atomicwt').css("display", "none");
        $('#PTtabID name').css("display", "none");

        hideElement('#elmName');
        hideElement('#elmWt');

changeMobilePage('#pageTable');
    }
    else if (selOpt == 'btnBilingualGlossary') {

        changeMobilePage('#pageBilingualGlossary');
    }
    else if (selOpt == 'btnQOTD') {
        importQOTD('#pageQuestionOfDayList'); //importQOTD(Page) 
    }
    else if (selOpt == 'btnChangePassword') {
        if (document.getElementById("usercurrentPassword").value != "" && document.getElementById("userNewPassword1").value != "" && document.getElementById("userNewConfirmPassword1").value != "") {
            if (validatePassword(document.getElementById("usercurrentPassword").value) && validatePassword(document.getElementById("userNewPassword1").value) && validatePassword(document.getElementById("userNewConfirmPassword1").value)) {
                changepassword();
            } else {
                showAppToast('showWarningToast', 'Password must be of min 4 characters', 3000);
            }
        } else {
            showAppToast('showWarningToast', 'Please fill all fields', 3000);
        }
    }
    else if (selOpt == 'btnGetMoreTests') {

        var user = getUserId();
        if (user == undefined || user == anonymous) {
            changeMobilePage('#pageWelcome');
        }
        else {
            getTestFromServer();
        }
    }

    else if (selOpt == 'btnLogout') {

        logOut();

    }
    else if (selOpt == 'btnChangePass') {
        changeMobilePage('#pageChangePassword');
    }
    else if (selOpt == 'btnPageJudgeMe') {
        db.transaction(function(tx) {

			tx.executeSql("select distinct(testid) from tbPaper where PaperStatus='C' and mode!='P' and testid in(SELECT testId from tbTest where testName<>'QoD') and userId=" + getUserId(), [], function(tx, result) {
				if (result.rows.length > 0) {
				  changeMobilePage('#pageCumulativeProgress');
				} else {
				   $().toastmessage('showNoticeToast', 'No Completed and Scored test for this User');
				}
			});
		});
    }
    else if (selOpt == 'btnMyAccountRegistered') {
        changeMobilePage('#pageMyAccountRegistered');
    }
    else if (selOpt == 'btnNewFlashCardDeck') {
        ShowDialogNewDeck(true);
    }
    else if (selOpt == 'btnNavMyAccountRegisteredHome') {
        $('.btn-slide-register').click();
        changeMobilePage('#pageHome');
    }
    else if (selOpt == 'btnNavMyAccountRegisteredQOTD') {
        $('.btn-slide-register').click();
        changeMobilePage('#pageQuestionOfDayList');
    }
    else if (selOpt == 'btnNavMyAccountRegisteredMyTests') {
        $('.btn-slide-register').click();
        changeMobilePage('#pageMyTest');
    }
    else if (selOpt == 'btnNavMyAccountRegisteredReference') {
        $('.btn-slide-register').click();
        changeMobilePage('#pageReference');
    }
    else if (selOpt == 'btnNavChangePasswordHome') {
        $('.btn-slide-ChangePassword').click();
        changeMobilePage('#pageHome');
    }
    else if (selOpt == 'btnNavChangePasswordQOTD') {
        $('.btn-slide-ChangePassword').click();
        changeMobilePage('#pageQuestionOfDayList');
    }
    else if (selOpt == 'btnNavChangePasswordMyTests') {
        $('.btn-slide-ChangePassword').click();
        changeMobilePage('#pageMyTest');
    }
    else if (selOpt == 'btnNavChangePasswordReference') {
        $('.btn-slide-ChangePassword').click();
        changeMobilePage('#pageReference');
    }
    else if (selOpt == 'btnNavPaperSummaryHome') {
        $('.btn-slide-PaperSummary').click();
        changeMobilePage('#pageHome');
    }
    else if (selOpt == 'btnNavPaperSummaryQOTD') {
        $('.btn-slide-PaperSummary').click();
        changeMobilePage('#pageQuestionOfDayList');
    }
    else if (selOpt == 'btnNavPaperSummaryMyTests') {
        $('.btn-slide-PaperSummary').click();
        changeMobilePage('#pageMyTest');
    }
    else if (selOpt == 'btnNavPaperSummaryReference') {
        $('.btn-slide-PaperSummary').click();
        changeMobilePage('#pageReference');
    }
    else if (selOpt == 'btnNavPaperDetailsHome') {
        $('.btn-slide-PaperDetails').click();
        changeMobilePage('#pageHome');
    }
    else if (selOpt == 'btnNavPaperDetailsQOTD') {
        $('.btn-slide-PaperDetails').click();
        changeMobilePage('#pageQuestionOfDayList');
    }
    else if (selOpt == 'btnNavPaperDetailsMyTests') {
        $('.btn-slide-PaperDetails').click();
        changeMobilePage('#pageMyTest');
    }
    else if (selOpt == 'btnNavPaperDetailsReference') {
        $('.btn-slide-PaperDetails').click();
        changeMobilePage('#pageReference');
    }
    else if (selOpt == 'btnNavReviewQuestionHome') {
        $('.btn-slide-ReviewQuestion').click();
        changeMobilePage('#pageHome');
    }
    else if (selOpt == 'btnNavReviewQuestionQOTD') {

        $('.btn-slide-ReviewQuestion').click();
        changeMobilePage('#pageQuestionOfDayList');
    }
    else if (selOpt == 'btnNavReviewQuestionMyTests') {
        $('.btn-slide-ReviewQuestion').click();
        changeMobilePage('#pageMyTest');
    }
    else if (selOpt == 'btnNavReviewQuestionReference') {
        $('.btn-slide-ReviewQuestion').click();
        changeMobilePage('#pageReference');
    }
    // MY ACCOUNT Sync & Backup #btnSync, #btnBackup
    else if (selOpt == 'btnBackup') {
        var user = getUserId();
        if (user == undefined || user == anonymous) {
            changeMobilePage('#pageWelcome');
        }
        else {
            callBackupDataAPI(); 
        }
    }
    else if (selOpt == 'btnRestore') {
		var user = getUserId();
        if (user == undefined || user == anonymous) {
            changeMobilePage('#pageWelcome');
        }
        else {
			callBackupListAPI();
		}		
    }
    else if (selOpt == 'lnkShowTest') {
        changeMobilePage('#pageTestListProgress');
    }
    else if (selOpt == 'lnkShowcumulativeTest') {
        changeMobilePage('#pageCumulativeProgress');
    }
});


$('#darkLayerQotd').live('tap', function(event, ui) {
    event.preventDefault();
    $('.btn-slide-qotd').click();
});

$('#darkLayerPT').live('tap', function(event, ui) {
    event.preventDefault();
    $('.btn-slide-pt').click();
});

$('#darkLayerdeck').live('tap', function(event, ui) {
    event.preventDefault();
    $('.btn-slide-fcDeck').click();
});

$('#darkLayerMyTest').live('tap', function(event, ui) {
    event.preventDefault();
    $('.btn-slide-mytest').click();
});

$('#darkLayerReference').live('tap', function(event, ui) {
    event.preventDefault();
    $('.btn-slide-reference').click();
});

$('#btnAbout').live('tap', function(event, ui) {
	try{
		$('#pageAbout').page('destroy').page();
	}catch(e){}
	 
     changeMobilePage('#pageAbout');
});

//Avinash Code
$('#darkLayerMyAccountRegistered').live('tap', function(event, ui) {
    event.preventDefault();
    $('.btn-slide-register').click();
});
$('#darkLayerChangePassword').live('tap', function(event, ui) {
    event.preventDefault();
    $('.btn-slide-ChangePassword').click();
});
$('#darkLayerPaperSummary').live('tap', function(event, ui) {
    event.preventDefault();
    $('.btn-slide-PaperSummary').click();
});
$('#darkLayerPaperDetails').live('tap', function(event, ui) {
    event.preventDefault();
    $('.btn-slide-PaperDetails').click();
});
$('#darkLayerReviewQuestion').live('tap', function(event, ui) {
    event.preventDefault();
    $('.btn-slide-ReviewQuestion').click();
});

function goBack(pageName) {
var changePage="";
isShown=false;
    if (isTest == true) {
	changePage='#pageQuestionTest';
        //changeMobilePage('#pageQuestionTest');
    } else {
        if (goPage == "search") {
            changePage='#pageSearch';
			//changeMobilePage('#pageSearch');
            goPage = "";
        } else {
		changePage=pageName;
            //changeMobilePage(pageName);
        }

    }
    if (isPaperdetailsCumulative == true) {
        changePage='#pagePaperDetails';
		//changeMobilePage('#pagePaperDetails');
        isCumulativeProgress = true;
    } else if (isPaperdetailsIndividual == true) {
       changePage='#pagePaperDetails';
		//changeMobilePage('#pagePaperDetails');
        isIndividualProgress = true;
    } else {
        if (isCumulativeProgress == true) {
		changePage='#pageCumulativeProgress';
            //changeMobilePage('#pageCumulativeProgress');
            isCumulativeProgress = false;
        }
        if (isIndividualProgress == true) {
           changePage='#pageIndividualtestProgress';
		   //changeMobilePage('#pageIndividualtestProgress');
            isIndividualProgress = false;
        }
    }
    isSetTimeDone = false;
    isTest = false;
    isPaperdetailsCumulative = false;
    isPaperdetailsIndividual = false;
	changeMobilePage(changePage);
}



/*$('#darkLayerReference, #darkLayerMenuQuesList, #darkLayerMyTest, #darkLayerMenuMytests, #darkLayer1, #darkLayerMenuTest, #darkLayerdeck, #darkLayerMenuDeck, #darkLayerdeckfc, #darkLayerPT, #darkLayerMenuPT, #darkLayerQotd, #darkLayerMenuQotd, #darkLayerQd').live('tap',function(event, ui){ 
event.preventDefault(); 
$(this).addClass("ui-disabled");
});*/

$('#btnSkipForNow').live('tap', function(event, ui) {
    event.preventDefault();
    logAnonymus();
    //window.localStorage.setItem("LoggedUser","-1") ;
    setControlParameters();
    changeMobilePage('#pageHome');
});

function changeMobilePage(pageName) {

    try{
		if(pageName == '#pageFeedback'){
			$(pageName).page('destroy').page();
			//$(pageName).page().trigger('pagecreate');
		}
	}catch(e){}
 /**/

    //setLastPage(pageName)
    $.mobile.changePage(pageName, {
		//transition: "fade",
		//role: "dialog",
		//reverse: false,
		//changeHash: false
	});
}



