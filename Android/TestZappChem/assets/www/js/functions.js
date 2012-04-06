var topicwise = "";
var testid = "";
var ansStat="";
var topicid="";
var id;
var test1;
var ansStat="";
var arr = new Array(1);
var arrqueid;
var arrTests; //=new Array(1);
var isTestExist;
var currentUidRef;

$('#pageCumulativeProgress').live('pageshow', function(event, ui) {
    db.transaction(function(tx) {

        tx.executeSql("select distinct(testid) from tbPaper where PaperStatus='C' and mode!='P'and testid in(SELECT testId from tbTest where testName<>'QoD') and userId=" + getUserId(), [], function(tx, result) {
            arrTests = new Array();
            if (result.rows.length > 0) {
                for (i = 0; i < result.rows.length; i++) {
                    if (i <= arrTests.length) {
                        testid = result.rows.item(i);
                        arrTests.push(testid.testId);
                    }
                }
			}
            showCumulativeProgress();
        });
        // Added on 20Dec2011
        tx.executeSql("SELECT topicId from tbtopics", [], function(tx, result) {
            arr = new Array(result.rows.length);
            if (result.rows.length > 0) {
                for (i = 0; i < result.rows.length; i++) {
                    topic = result.rows.item(i);
                    arr[i] = topic.topicId;
                }
            }
        });
        //End.
    });
});

$('#pageTestListProgress').live('pageshow', function(event, ui) {
    var j = 0 * 1;
    db.transaction(function(tx) {
        tx.executeSql("select distinct(testid) from tbPaper where paperStatus='C' and mode!='P' and testid in(SELECT testId from tbTest where testName<>'QoD') and userId=" + getUserId(), [], function(tx, result) {
            arrTests = new Array();
            if (result.rows.length > 0) {

                for (i = 0; i < result.rows.length; i++) {
                    if (i <= arrTests.length) {
                        j++;
                        testid = result.rows.item(i);
                        arrTests.push(testid.testId);
                    }
                }
            }
            if (j == arrTests.length) {
                showTestList();
            }
        });
    });
});

$('#pageWelcome').live('pageshow', function(event, ui) {
	cleanall();
	$('#userConfirmPassword').hide();
	$('#btnLoginLink').show();
	
});

$('#pagePaperSummary').live('pagecreate', function(event, ui) {
    db.transaction(function(tx) {

        tx.executeSql("SELECT topicId from tbtopics", [], function(tx, result) {
            arr = new Array(result.rows.length);
            if (result.rows.length > 0) {
                for (i = 0; i < result.rows.length; i++) {
                    topic = result.rows.item(i);
                    arr[i] = topic.topicId;
                }
            }
        });
    });

});
$('#pagePaperSummary').live('pagebeforeshow', function(event, ui) {
    $('#topicStat').html("");
    topicwise = "";
});

$('#pageJudgeMe').live('pagecreate', function(event, ui) {

});
$('#pageLogin').live('pagecreate', function(event, ui) {

});
$("#btnLogout").live('tap', function(event, ui) {
    event.preventDefault();
    logOut();
});
$("#lnkForgotPassword").live('tap', function(event, ui) {
    event.preventDefault();
    forgotPassword();
});
$("#btnSummary").live('tap', function(event, ui) {
    event.preventDefault();
    ShowSummary();
});
$("#btnDetailsShow").live('tap', function(event, ui) {
    event.preventDefault();
    ShowDetailResult();
});
$("#btnPaperDetails").live('tap', function(event, ui) {
    event.preventDefault();
    showPaperDetail();
});
$("#btnPaperTopic").live('tap', function(event, ui) {
    event.preventDefault();
    showTopicReult();
});
function validateEmail(elementValue) {
    var emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailPattern.test(elementValue);
}
function validatePassword(elementValue) {
    //var pass =/^[A-Za-z]\w{4,}[A-Za-z]$/;
    var pass = /^.{4,}$/;
    return pass.test(elementValue);
}
function showUser() {
    var uid;
    var pass;
    if (document.getElementById("userPassword").value == "" || document.getElementById("userConfirmPassword").value == "" || document.getElementById("userId").value == "") {
        $().toastmessage('showNoticeToast', 'All Fields are Compulsory.');

    } else if (document.getElementById("userPassword").value != document.getElementById("userConfirmPassword").value) {
        $().toastmessage('showNoticeToast', 'Password mismatched.');

    } else {
        uid = document.getElementById("userId").value;
        pass = document.getElementById("userPassword").value;
		var dataUrl = getUserLoginUrl(); 
        if (networkState()) {
            getDeviceInfoInJson(function(data) {
                var Data = data;
                
                $.ajax({
                    type: "POST",
                    url: dataUrl + '/registerUser',
                    data: { username: uid, password: pass, deviceInfo: Data, isexist: false ,Version:1},
                    success: function(responseText) {
                        var xmlData = $(responseText).find("string").text();
                        var str1 = xmlData.split(':');
                        if (str1[0] > '0') {

                            InsertRecordInUserTable(str1[0], uid, pass);
                            cleanall();
                            changeMobilePage('#pageHome');
                        }
                        if (str1[0] == '-1') {
                            $().toastmessage('showNoticeToast', 'Account with this email already exists; type new email or tap on login.');
                            document.getElementById("userId").value = uid;
                            document.getElementById("userPassword").value = pass;
							$('#userConfirmPassword').hide();
							$('#btnLoginLink').show();
							isShown=false;
							document.getElementById("userConfirmPassword").value="";
                            changeMobilePage('#pageWelcome');
                        }
                        if (str1[0] == '-2') {
                            $().toastmessage('showNoticeToast', str1[1]);
                        }
                        if (str1[0] == '-3') {
                            $().toastmessage('showNoticeToast', str1[1]);
                        }
                        if (str1[0] == '-4') {
                            $().toastmessage('showNoticeToast', str1[1]);
                        }

                        if (str1[0] == '-5') {
                            $().toastmessage('showNoticeToast', 'Promblem in communication.try again later');
                        }
						if(str1[0]=='-12'){
							$().toastmessage('showNoticeToast', str1[1]);
						}
                    },
                    error: function(xhqr, textStatus, errorThrown) {
                        if (textStatus == 'error' && errorThrown == 'Internal Server Error') {
                            $().toastmessage('showNoticeToast', 'Server error occurred.<br>Please try again later.');
                        } else {
                            toastServerError();
                        }
                    }
                });
				
            })
        }
    }

}
function InsertRecordInUserTable(uid, userid, password) {
    db.transaction(function(tx) {
        tx.executeSql('INSERT INTO tbUser (userId,userEmail,userPassword) VALUES (?,?,?)', [uid, userid, password]);
        tx.executeSql("SELECT * from tbUser where userEmail like '" + userid + "' and userPassword like '" + password + "'", [], function(tx, result) {
            if (result.rows.length != 0) {
                var loggedUser = result.rows.item(0);
                tx.executeSql("update tbControlParameters set currentLoginId=" + loggedUser.userId);
                setControlParameters();
            }

        });
    });

}
function logAnonymus() {
    db.transaction(function(tx) {
        tx.executeSql("update tbControlParameters set currentLoginId=" + anonymous);
    });
}

function checklogin(email, pass) {
    if ((email == "") || (pass == "")) {
        $().toastmessage('showNoticeToast', 'Please enter userid and password.');
    } else {
        db = getDatabase();
        db.transaction(function(tx) {

            tx.executeSql("SELECT * from tbUser where userEmail like '" + email + "'", [], function(tx, result) {
                if (result.rows.length != 0) {
                    tx.executeSql("SELECT * from tbUser where userEmail like '" + email + "' and userPassword like '" + pass + "'", [], function(tx, result) {
                        if (result.rows.length != 0) {
                            var loggedUser = result.rows.item(0);
                            tx.executeSql("update tbControlParameters set currentLoginId=" + loggedUser.userId);
                            setControlParameters();
                            cleanall();
                            changeMobilePage('#pageHome');
                        }
                        else {
                            $().toastmessage('showNoticeToast', 'You have entered wrong password');
                        }
                    });

                } else {

                    checkUser(email, pass); // 2 means called from check login function

                }
            });

        });

    }

}
function ShowSummary() {
    $().toastmessage('showNoticeToast', 'Agreegate Report card not yet implemented.');
}
function showPaperSummary(test) {
    var skiped;
    var correct;
    var wrong;
    var unattempted;
    var testname;
    var htmlSource = "";
    test1 = test;
    var rawscore = 0;
    db = getDatabase();
    db.transaction(function(tx) {

        tx.executeSql("select testName from tbTest where testId =(select testId from tbPaper where paperId='" + test1 + "')", [], function(tx, result) {
            testname = result.rows.item(0);
            htmlSource += "<div width='70%' id='divOverallStatus'></div><table width='95%' class='tableText' border='0'><tr><td align='left' colspan='3' class='hedingprogress'>Summary for  " + testname.testName + "</td></tr>";
            tx.executeSql("select mode,count(*)as cnt from tbQuestionPaper,tbpaper where tbpaper.paperId='" + test1 + "' and answerStatus='C' and tbQuestionPaper.paperId ='" + test1 + "'", [], function(tx, result) {
                correct = result.rows.item(0);
                htmlSource += "<tr style='color:#353535;'><td colspan='2' align='left'>Correct Answers</td><td align='right'>" + correct.cnt + "</td></tr>";
                tx.executeSql("select count(*)as cnt from tbQuestionPaper where answerStatus='W' and paperId ='" + test1 + "'", [], function(tx, result) {
                    wrong = result.rows.item(0);
                    htmlSource += "<tr style='color:#353535;'><td colspan='2' align='left'>Incorrect Answers</td><td align='right'>" + wrong.cnt + "</td></tr>";
                    tx.executeSql("select count(*)as cnt from tbQuestionPaper where answerStatus =='S' and paperId ='" + test1 + "'", [], function(tx, result) {
                        unattempted = result.rows.item(0);
                        htmlSource += "<tr style='color:#353535;'><td colspan='2' align='left'>Skipped Questions</td><td align='right'>" + unattempted.cnt + "</td></tr>";
                        tx.executeSql("select count(*)as cnt from tbQuestionPaper where answerStatus !='S' and answerStatus !='C' and answerStatus !='W' and paperId ='" + test1 + "'", [], function(tx, result) {
                            skiped = result.rows.item(0);
                            htmlSource += "<tr style='color:#353535;'><td colspan='2' align='left'>Unanswered Questions</td><td align='right'>" + skiped.cnt + "</td></tr></table>";
                            rawscore = (correct.cnt * 1) - (wrong.cnt * 0.25);
                            if (correct.mode == 'P') {
                                htmlSource += "<div width='70%' id='divOverallStatus'></div><table width='95%' class='tableText' border='0'><tr><td align='left' colspan='3' class='hedingprogress'>Test is not scored! </td></tr></table>";
                                $('#papersummary').html(htmlSource);
                                tx.executeSql("UPDATE tbPaper SET score=0 WHERE paperId=?", [test1]);
                            } else {
                                tx.executeSql("select scaledScore from tbRawScaledScore where rawscore=" + Math.round(rawscore), [], function(tx, result) {
                                    skiped = result.rows.item(0);
                                    htmlSource += "<div width='70%' id='divOverallStatus'></div><table width='95%' class='tableText' border='0'><tr><td align='left' colspan='3' class='hedingprogress'>Your SAT Score is : " + skiped.scaledScore + "</td></tr></table>";
                                    $('#papersummary').html(htmlSource);
                                    tx.executeSql("UPDATE tbPaper SET score=? WHERE paperId=?", [skiped.scaledScore, test1]);
                                });
                            }

                        });
                    });
                });

            });
        });

    });

    changeMobilePage('#pagePaperSummary');
}
function showPaperDetail() {
    var htmlsource = ""; //incorrect questions
    var htmlsource1 = ""; //correct questions
    var htmlsource2 = ""; //skiped questions
    var htmlsource3 = ""; //unattempted questions
    var item;
    var i;
    var j = 0;
    var k = 0;
    var l = 0;
    var m = 0;
	
    //For incorrect answers
    htmlsource = "<table align='center' border=0><tr>"
	topicid=0; //All
    //db=getDatabase();
    db.transaction(function(tx) {
        tx.executeSql("SELECT uId,qno,srNo from tbQuestionpaper  where answerStatus='W' and paperId='" + test1 + "'", [], function(tx, result1) {

            if (result1.rows.length > 0) {
				ansStat= 1;
                for (i = 0; i < result1.rows.length; i++) {

                    try {
                        item = result1.rows.item(i);
                        j++;
                        if (j < 6) {
                            htmlsource += "<td width='20px' class='buttons orange' onClick='generateQuestionsForReview(" + item.uId +","+ansStat+","+topicid+ ")'>" + item.srNo + "</td>";
                        } else {
                            htmlsource += "</tr><tr><td width='20px' class='buttons orange' onClick='generateQuestionsForReview(" + item.uId +","+ansStat+","+topicid+ ")'>" + item.srNo + "</td>";
                            j = 1;
                        }
                    } catch (err) {
                    }
                }
                htmlsource += "</tr></table>"
                $('#divIncorrect').html(htmlsource);
            } else {
                htmlsource = "";
                $('#divIncorrect').html(htmlsource);
            }

        });
    });
    //For Correct answers
    var star;
    var noofQuestion = 0;
    var allocatedTime = 0;
    var tot = 0;

    htmlsource1 = "<table align='center'><tr>"

    db.transaction(function(tx) {

        tx.executeSql("select count(*) as cnt from tbQuestionPaper where paperId ='" + test1 + "'", [], function(tx, result) {
            if (result.rows.length > 0) {
                noofQuestion = result.rows.item(0);
            }
            tx.executeSql("select timeLimit from tbTest where testId =(select testId from tbPaper where paperId ='" + test1 + "' )", [], function(tx, result) {
                tot = result.rows.item(0);
                allocatedTime = tot.timeLimit / noofQuestion.cnt;

                tx.executeSql("SELECT uId,qno,timeTaken,srNo from tbQuestionPaper where answerStatus='C' and paperId='" + test1 + "'", [], function(tx, result) {
                    if (result.rows.length > 0) {
								ansStat=2;
                        for (i = 0; i < result.rows.length; i++) {

                            try {
                                item = result.rows.item(i);
                                if (item.timeTaken == allocatedTime) {
                                    star = "**";
                                } else if (item.timeTaken < allocatedTime) {
                                    star = "***";
                                }
                                else {
                                    star = "*";
                                }

                                k++;
                                if (k < 6) {
                                    htmlsource1 += "<td width='20px' class='buttons orange' onClick='generateQuestionsForReview(" + item.uId +","+ansStat+","+topicid+ ")'>" + item.srNo + "</br>" + star + "</td>";
                                } else {
                                    htmlsource1 += "</tr><tr><td width='20px' class='buttons orange' onClick='generateQuestionsForReview(" + item.uId +","+ansStat+","+topicid+ ")'>" + item.srNo + "</br>" + star + "</td>";
                                    k = 1;
                                }


                            } catch (err) {
                            }

                        }
                        htmlsource1 += "</tr></table>"
                        $('#divCorrect').html(htmlsource1);
                    } else {
                        htmlsource1 = "";
                        $('#divCorrect').html(htmlsource1);
                    }

                });
            });
        });
    }); //outermost

    //Skiped or unanswered questions


    htmlsource2 = "<table align='center' border=0><tr>"
    db.transaction(function(tx) {
        tx.executeSql("SELECT uId,qno,srNo from tbQuestionpaper where answerStatus='S' and paperId='" + test1 + "' order by qno", [], function(tx, result2) {

            if (result2.rows.length > 0) {
					ansStat=3;
                for (i = 0; i < result2.rows.length; i++) {

                    try {
                        item = result2.rows.item(i);
                        l++;
                        if (l < 6) {
                            htmlsource2 += "<td width='20px' class='buttons orange' onClick='generateQuestionsForReview(" + item.uId +","+ansStat+","+topicid+ ")'>" + item.srNo + "</td>";
                        } else {
                            htmlsource2 += "</tr><tr><td width='20px' class='buttons orange' onClick='generateQuestionsForReview(" + item.uId +","+ansStat+","+topicid+ ")'>" + item.srNo + "</td>";
                            l = 1;
                        }


                    } catch (err) {
                    }

                }
                htmlsource2 += "</tr></table>"
                $('#divSkipped').html(htmlsource2);
            } else {
                htmlsource2 = "";
                $('#divSkipped').html(htmlsource2);
            }

        });
    });

    // unattempted questions
    htmlsource3 = "<table align='center' border=0><tr>"
    db.transaction(function(tx) {
        tx.executeSql("SELECT uId,qno,srNo from tbQuestionpaper where answerStatus !='S' and answerStatus !='C' and answerStatus !='W' and paperId='" + test1 + "' order by qno", [], function(tx, result2) {

            if (result2.rows.length > 0) {
					ansStat=4;
                for (i = 0; i < result2.rows.length; i++) {

                    try {
                        item = result2.rows.item(i);
                        m++;
                        if (m < 6) {
                            htmlsource3 += "<td width='20px' class='buttons orange' onClick='generateQuestionsForReview(" + item.uId +","+ansStat+","+topicid+ ")'>" + item.srNo + "</td>";
                        } else {
                            htmlsource3 += "</tr><tr><td width='20px' class='buttons orange' onClick='generateQuestionsForReview(" + item.uId +","+ansStat+","+topicid+ ")'>" + item.srNo + "</td>";
                            m = 1;
                        }


                    } catch (err) {
                    }

                }
                htmlsource3 += "</tr></table>"
                $('#divUnattempted').html(htmlsource3);
            } else {
                htmlsource3 = "";
                $('#divUnattempted').html(htmlsource3);
            }

        });
    });

    changeMobilePage('#pagePaperDetails');

}
//newly added
function showTopicDetailsCumulative(topicid) {


    var htmlsource = ""; //incorrect questions
    var htmlsource1 = ""; //correct questions
    var htmlsource2 = ""; //skiped questions
    var htmlsource3 = ""; //unattempted questions
    var item;
    var uId;
    var i;
    var j = 0;
    var k = 0;
    var l = 0;
    var m = 0;
    var All = 0;
    isCumulativeProgress = true;
    //For incorrect answers
    htmlsource = "<table align='center' border=0><tr>"
  
    db.transaction(function(tx) {

        tx.executeSql("SELECT qno,uid,srNo from tbQuestionpaper where answerStatus='W' and paperId in (select paperId from tbpaper where paperStatus='C' and userId=" + getUserId() + " and testid in(select testid from tbTest where testName<>'QoD')) and uid in(select uid from tbQuestionBank where topicId=" + topicid + ")", [], function(tx, result1) {

            if (result1.rows.length > 0) {
				ansStat=1;
                for (i = 0; i < result1.rows.length; i++) {

                    try {
                        item = result1.rows.item(i);
                        j++;
                        if (j < 6) {
                            //htmlsource+="<td width='20px' class='buttons orange' onClick='popupIncorrectQuestionCumulative(" +item.uId +","+item.qno+")'>" +item.qno +"</td>";
                            htmlsource += "<td width='20px' class='buttons orange' onClick='generateQuestionsForReview(" + item.uId + "," + ansStat + ","+ topicid+"," + All + ")'>" + item.srNo + "</td>";
                        } else {
                            htmlsource += "</tr><tr><td width='20px' class='buttons orange' onClick='generateQuestionsForReview(" + item.uId + "," + ansStat + ","+ topicid+"," + All + ")'>" + item.srNo + "</td>";
                            j = 1;
                        }
                    } catch (err) {
                    }
                }
                htmlsource += "</tr></table>"
                $('#divIncorrect').html(htmlsource);
            } else {
                htmlsource = "";
                $('#divIncorrect').html(htmlsource);
            }

        });
    });
    //For Correct answers
    var star;
    var noofQuestion = 0;
    var allocatedTime = 0;
    var tot = 0;

    htmlsource1 = "<table align='center'><tr>"

    db.transaction(function(tx) {
        tx.executeSql("SELECT qno,uId,srNo from tbQuestionPaper where answerStatus='C' and paperId in (select paperId from tbpaper where paperStatus='C' and userId=" + getUserId() + " and testid in(select testid from tbTest where testName<>'QoD')) and uid in(select uid from tbQuestionBank where topicId=" + topicid + ")", [], function(tx, result) {
            if (result.rows.length > 0) {
				ansStat=2;
                for (i = 0; i < result.rows.length; i++) {

                    try {
                        item = result.rows.item(i);
                        if (item.timeTaken == allocatedTime) {
                            star = "**";
                        } else if (item.timeTaken < allocatedTime) {
                            star = "***";
                        }
                        else {
                            star = "*";
                        }

                        k++;
                        if (k < 6) {

                            htmlsource1 += "<td width='20px' class='buttons orange' onClick='generateQuestionsForReview(" + item.uId + "," + ansStat + ","+ topicid+"," + All + ")'>" + item.srNo + "</br>" + star + "</td>";
                        } else {
                            htmlsource1 += "</tr><tr><td width='20px' class='buttons orange' onClick='generateQuestionsForReview(" + item.uId + "," + ansStat + ","+ topicid+"," + All + ")'>" + item.srNo + "</br>" + star + "</td>";
                            k = 1;
                        }


                    } catch (err) {
                    }

                }
                htmlsource1 += "</tr></table>"
                $('#divCorrect').html(htmlsource1);
            } else {
                htmlsource1 = "";
                $('#divCorrect').html(htmlsource1);
            }

        });
    }); //outer most

    //Skiped or unanswered questions


    htmlsource2 = "<table align='center' border=0><tr>"
    db.transaction(function(tx) {
        tx.executeSql("SELECT qno,uId,srNo from tbQuestionpaper where answerStatus=='S' and paperId in (select paperId from tbpaper where paperStatus='C' and userId=" + getUserId() + " and testid in(select testid from tbTest where testName<>'QoD')) and uid in(select uid from tbQuestionBank where topicId=" + topicid + ") order by qno", [], function(tx, result2) {

            if (result2.rows.length > 0) {
					ansStat=3;
                for (i = 0; i < result2.rows.length; i++) {

                    try {
                        item = result2.rows.item(i);
                        l++;
                        if (l < 6) {

                            htmlsource2 += "<td width='20px' class='buttons orange' onClick='generateQuestionsForReview(" + item.uId + "," + ansStat + ","+ topicid+"," + All +")'>" + item.srNo + "</td>";
                        } else {
                            htmlsource2 += "</tr><tr><td width='20px' class='buttons orange' onClick='generateQuestionsForReview(" + item.uId + "," + ansStat + ","+ topicid+"," + All + ")'>" + item.srNo + "</td>";
                            l = 1;
                        }


                    } catch (err) {
                    }

                }
                htmlsource2 += "</tr></table>"
                $('#divSkipped').html(htmlsource2);
            } else {
                htmlsource2 = "";
                $('#divSkipped').html(htmlsource2);
            }

        });
    });

    // unattempted questions
    htmlsource3 = "<table align='center' border=0><tr>"
    db.transaction(function(tx) {
        tx.executeSql("SELECT qno,uId,srNo from tbQuestionpaper where answerStatus !='S' and answerStatus !='C' and answerStatus !='W' and paperId in (select paperId from tbpaper where paperStatus='C' and userId=" + getUserId() + " and testid in(select testid from tbTest where testName<>'QoD')) and uid in(select uid from tbQuestionBank where topicId=" + topicid + ") order by qno", [], function(tx, result2) {

            if (result2.rows.length > 0) {
				ansStat=4;
                for (i = 0; i < result2.rows.length; i++) {

                    try {
                        item = result2.rows.item(i);
                        m++;
                        if (m < 6) {

                            htmlsource3 += "<td width='20px' class='buttons orange' onClick='generateQuestionsForReview(" + item.uId + "," + ansStat + ","+ topicid+"," + All + ")'>" + item.srNo + "</td>";
                        } else {
                            htmlsource3 += "</tr><tr><td width='20px' class='buttons orange' onClick='generateQuestionsForReview(" + item.uId + "," + ansStat + ","+ topicid+"," + All + ")'>" + item.srNo + "</td>";
                            m = 1;
                        }


                    } catch (err) {
                    }

                }
                htmlsource3 += "</tr></table>"
                $('#divUnattempted').html(htmlsource3);

            } else {
                htmlsource3 = "";
                $('#divUnattempted').html(htmlsource3);
            }

        });
    });

    changeMobilePage('#pagePaperDetails');

}

function ShowTopicDetailsIndividual(topicid, tid) {
    var htmlsource = ""; //incorrect questions
    var htmlsource1 = ""; //correct questions
    var htmlsource2 = ""; //skiped questions
    var htmlsource3 = ""; //unattempted questions
    var item;
    var i;
    var j = 0;
    var k = 0;
    var l = 0;
    var m = 0;


    isIndividualProgress = true;
    //For incorrect answers
    htmlsource = "<table align='center' border=0><tr>"

    db.transaction(function(tx) {
        tx.executeSql("SELECT qno,uId,srNo from tbQuestionpaper where answerStatus='W' and paperId in (select paperId from tbpaper where paperStatus='C' and userId=" + getUserId() + " and testId=" + tid + ") and uid in(select uid from tbQuestionBank where topicId=" + topicid + ")", [], function(tx, result1) {

            if (result1.rows.length > 0) {
					ansStat=1;
                for (i = 0; i < result1.rows.length; i++) {

                    try {
                        item = result1.rows.item(i);
                        j++;
                        if (j < 6) {


                            htmlsource += "<td width='20px' class='buttons orange' onClick='generateQuestionsForReview(" + item.uId + ","+ansStat + ","+topicid+"," + tid + ")'>" + item.srNo + "</td>";
                        } else {
                            htmlsource += "</tr><tr><td width='20px' class='buttons orange' onClick='generateQuestionsForReview(" + item.uId + ","+ansStat + ","+topicid+"," + tid + ")'>" + item.srNo + "</td>";
                            j = 1;
                        }
                    } catch (err) {
                    }
                }
                htmlsource += "</tr></table>"
                $('#divIncorrect').html(htmlsource);
            } else {
                htmlsource = "";
                $('#divIncorrect').html(htmlsource);
            }

        });
    });
    //For Correct answers
    var star;
    var noofQuestion = 0;
    var allocatedTime = 0;
    var tot = 0;

    htmlsource1 = "<table align='center'><tr>"

    db.transaction(function(tx) {
        tx.executeSql("SELECT qno,uId,srNo from tbQuestionPaper where answerStatus='C' and paperId in (select paperId from tbpaper where paperStatus='C' and userId=" + getUserId() + " and testId=" + tid + ") and uid in(select uid from tbQuestionBank where topicId=" + topicid + ")", [], function(tx, result) {
            if (result.rows.length > 0) {
					ansStat=2;
                for (i = 0; i < result.rows.length; i++) {

                    try {
                        item = result.rows.item(i);
                        if (item.timeTaken == allocatedTime) {
                            star = "**";
                        } else if (item.timeTaken < allocatedTime) {
                            star = "***";
                        }
                        else {
                            star = "*";
                        }

                        k++;
                        if (k < 6) {

                            htmlsource1 += "<td width='20px' class='buttons orange' onClick='generateQuestionsForReview(" + item.uId + ","+ansStat + ","+topicid+"," + tid + ")'>" + item.srNo + "</br>" + star + "</td>";
                        } else {
                            htmlsource1 += "</tr><tr><td width='20px' class='buttons orange' onClick='generateQuestionsForReview(" + item.uId + ","+ansStat + ","+topicid+"," + tid + ")'>" + item.srNo + "</br>" + star + "</td>";
                            k = 1;
                        }


                    } catch (err) {
                    }

                }
                htmlsource1 += "</tr></table>"
                $('#divCorrect').html(htmlsource1);
            } else {
                htmlsource1 = "";
                $('#divCorrect').html(htmlsource1);
            }

        });
    }); //outermost

    //Skiped or unanswered questions


    htmlsource2 = "<table align='center' border=0><tr>"
    db.transaction(function(tx) {
        tx.executeSql("SELECT qno,uId,srNo from tbQuestionpaper where answerStatus=='S' and paperId in (select paperId from tbpaper where paperStatus='C' and userId=" + getUserId() + " and testId=" + tid + ") and uid in(select uid from tbQuestionBank where topicId=" + topicid + ") order by qno", [], function(tx, result2) {

            if (result2.rows.length > 0) {
					ansStat=3;
                for (i = 0; i < result2.rows.length; i++) {

                    try {
                        item = result2.rows.item(i);
                        l++;
                        if (l < 6) {

                            htmlsource2 += "<td width='20px' class='buttons orange' onClick='generateQuestionsForReview(" + item.uId + ","+ansStat + ","+topicid+"," + tid + ")'>" + item.srNo + "</td>";
                        } else {
                            htmlsource2 += "</tr><tr><td width='20px' class='buttons orange' onClick='generateQuestionsForReview(" + item.uId + ","+ansStat + ","+topicid+"," + tid + ")'>" + item.srNo + "</td>";
                            l = 1;
                        }


                    } catch (err) {
                    }

                }
                htmlsource2 += "</tr></table>"
                $('#divSkipped').html(htmlsource2);
            } else {
                htmlsource2 = "";
                $('#divSkipped').html(htmlsource2);
            }

        });
    });

    // unattempted questions
    htmlsource3 = "<table align='center' border=0><tr>"
    db.transaction(function(tx) {
        tx.executeSql("SELECT qno,uId,srNo from tbQuestionpaper where answerStatus !='S' and answerStatus !='C' and answerStatus !='W' and paperId in (select paperId from tbpaper where paperStatus='C' and userId=" + getUserId() + " and testId=" + tid + ") and uid in(select uid from tbQuestionBank where topicId=" + topicid + ") order by qno", [], function(tx, result2) {

            if (result2.rows.length > 0) {
				ansStat=4;
                for (i = 0; i < result2.rows.length; i++) {

                    try {
                        item = result2.rows.item(i);
                        m++;
                        if (m < 6) {

                            htmlsource3 += "<td width='20px' class='buttons orange' onClick='generateQuestionsForReview(" + item.uId + ","+ansStat + ","+topicid+"," + tid + ")'>" + item.srNo + "</td>";
                        } else {
                            htmlsource3 += "</tr><tr><td width='20px' class='buttons orange' onClick='generateQuestionsForReview(" + item.uId + ","+ansStat + ","+topicid+"," + tid + ")'>" + item.srNo + "</td>";
                            m = 1;
                        }


                    } catch (err) {
                    }

                }
                htmlsource3 += "</tr></table>"
                $('#divUnattempted').html(htmlsource3);
            } else {
                htmlsource2 = "";
                $('#divUnattempted').html(htmlsource3);
            }

        });
    });

    changeMobilePage('#pagePaperDetails');

}
//end

function popupCorrectQuestion(qno) { //correct
    var question = "";
    var ans;
    $('#questionText').html("");
    db.transaction(function(tx) {
        tx.executeSql("SELECT question,statementI,statementII,TypeName,submittedAnswer,correctAnswer,explanation from tbtype,tbQuestionBank,tbquestionPaper where tbtype.typeid=tbquestionbank.typeid and tbquestionpaper.uId =tbQuestionBank.uId and qno=" + qno + " and paperId='" + test1 + "' and answerStatus ='C'", [], function(tx, result2) {
            if (result2.rows.length > 0) {
                ans = result2.rows.item(0);
                if (ans.typeName == 'A' || ans.typeName == 'C') {
                    question = "<table border=1><tr><td align='left'>Q." + qno + "." + ans.question + "</td></tr><tr><td align='left'>Correct answer :" + ans.correctAnswer + "</td></tr><tr><td align='left'>You selected :" + ans.submittedAnswer + "</td></tr><tr><td align='left'>Explanation :<br/>" + ans.explanation + "</td></tr></table>"
                } else if (ans.typeName == 'B') {

                    question = "<table border=1><tr><td align='left'>I." + ans.statementI + "</td></tr><tr><td align='left'>Because </td></tr><tr><td align='left'>II." + ans.statementII + "</td></tr><tr><td align='left'>Correct answer :" + ans.correctAnswer + "</td></tr><tr><td align='left'>You selected :" + ans.submittedAnswer + "</td></tr><tr><td align='left'>Explanation :<br/>" + ans.explanation + "</td></tr></table>"
                }
            }
            $('#questionText').html(question);
        });
    });
    changeMobilePage('#pageReviewQuestion');
}
function popupCorrectQuestionCumulative(uId, qno) { //correct
    var question = "";
    var ans;
    $('#questionText').html("");
    db.transaction(function(tx) {
        tx.executeSql("SELECT question,statementI,statementII,TypeName,submittedAnswer,correctAnswer,explanation from tbtype,tbQuestionBank,tbquestionPaper where tbtype.typeid=tbquestionbank.typeid and tbQuestionBank.uId=" + uId + " and qno=" + qno + " and answerStatus ='C'", [], function(tx, result2) {
            if (result2.rows.length > 0) {
                ans = result2.rows.item(0);
                if (ans.typeName == 'A' || ans.typeName == 'C') {
                    question = "<table border=1><tr><td align='left'>Q." + qno + "." + ans.question + "</td></tr><tr><td align='left'>Correct answer :" + ans.correctAnswer + "</td></tr><tr><td align='left'>You selected :" + ans.submittedAnswer + "</td></tr><tr><td align='left'>Explanation :<br/>" + ans.explanation + "</td></tr></table>"
                } else if (ans.typeName == 'B') {

                    question = "<table border=1><tr><td align='left'>I." + ans.statementI + "</td></tr><tr><td align='left'>Because </td></tr><tr><td align='left'>II." + ans.statementII + "</td></tr><tr><td align='left'>Correct answer :" + ans.correctAnswer + "</td></tr><tr><td align='left'>You selected :" + ans.submittedAnswer + "</td></tr><tr><td align='left'>Explanation :<br/>" + ans.explanation + "</td></tr></table>"
                }
            }
            $('#questionText').html(question);
        });
    });
    changeMobilePage('#pageReviewQuestion');
}
function popupCorrectQuestionIndividual(uId, qno) { //correct
    var question = "";
    var ans;
    $('#questionText').html("");
    db.transaction(function(tx) {
        tx.executeSql("SELECT question,statementI,statementII,TypeName,submittedAnswer,correctAnswer,explanation from tbtype,tbQuestionBank,tbquestionPaper where tbtype.typeid=tbquestionbank.typeid and tbQuestionBank.uId=" + uId + " and qno=" + qno + " and answerStatus ='C'", [], function(tx, result2) {
            if (result2.rows.length > 0) {
                ans = result2.rows.item(0);
                if (ans.typeName == 'A' || ans.typeName == 'C') {
                    question = "<table border=1><tr><td align='left'>Q." + qno + "." + ans.question + "</td></tr><tr><td align='left'>Correct answer :" + ans.correctAnswer + "</td></tr><tr><td align='left'>You selected :" + ans.submittedAnswer + "</td></tr><tr><td align='left'>Explanation :<br/>" + ans.explanation + "</td></tr></table>"
                } else if (ans.typeName == 'B') {

                    question = "<table border=1><tr><td align='left'>I." + ans.statementI + "</td></tr><tr><td align='left'>Because </td></tr><tr><td align='left'>II." + ans.statementII + "</td></tr><tr><td align='left'>Correct answer :" + ans.correctAnswer + "</td></tr><tr><td align='left'>You selected :" + ans.submittedAnswer + "</td></tr><tr><td align='left'>Explanation :<br/>" + ans.explanation + "</td></tr></table>"
                }
            }
            $('#questionText').html(question);
        });
    });
    changeMobilePage('#pageReviewQuestion');
}
function popupIncorrectQuestion(qno) { //Incorrect
    $('#questionText').html("");
    var question = "";
    var ans;
    db.transaction(function(tx) {

        tx.executeSql("SELECT question,statementI,statementII,TypeName,submittedAnswer,correctAnswer,explanation from tbtype,tbQuestionBank,tbquestionPaper where tbtype.typeid=tbquestionbank.typeid and tbquestionpaper.uId =tbQuestionBank.uId and qno=" + qno + " and paperId='" + test1 + "' and answerStatus ='W'", [], function(tx, result2) {
            if (result2.rows.length > 0) {
                ans = result2.rows.item(0);
                if (ans.typeName == 'A' || ans.typeName == 'C') {
                    question = "<table border=1><tr><td align='left'>Q." + qno + "." + ans.question + "</td></tr><tr><td align='left'>Correct answer :" + ans.correctAnswer + "</td></tr><tr><td align='left'>You selected :" + ans.submittedAnswer + "</td></tr><tr><td align='left'>Explanation :<br/>" + ans.explanation + "</td></tr></table>"
                } else if (ans.typeName == 'B') {
                    question = "<table border=1><tr><td align='left'>I." + ans.statementI + "</td></tr><tr><td align='left'>Because </td></tr><tr><td align='left'> II." + ans.statementII + "</td></tr><tr><td align='left'>Correct answer :" + ans.correctAnswer + "</td></tr><tr><td align='left'>You selected :" + ans.submittedAnswer + "</td></tr><tr><td align='left'>Explanation :<br/>" + ans.explanation + "</td></tr></table>"
                }
            }
            $('#questionText').html(question);
        });
    });

    changeMobilePage('#pageReviewQuestion');

}
function popupIncorrectQuestionCumulative(uId, qno) { //Incorrect
    $('#questionText').html("");
    var question = "";
    var ans;
    db.transaction(function(tx) {

        tx.executeSql("SELECT question,statementI,statementII,TypeName,submittedAnswer,correctAnswer,explanation from tbtype,tbQuestionBank,tbquestionPaper where tbtype.typeid=tbquestionbank.typeid and tbQuestionBank.uId=" + uId + " and qno=" + qno + " and answerStatus ='W'", [], function(tx, result2) {
            if (result2.rows.length > 0) {
                ans = result2.rows.item(0);
                if (ans.typeName == 'A' || ans.typeName == 'C') {
                    question = "<table border=1><tr><td align='left'>Q." + qno + "." + ans.question + "</td></tr><tr><td align='left'>Correct answer :" + ans.correctAnswer + "</td></tr><tr><td align='left'>You selected :" + ans.submittedAnswer + "</td></tr><tr><td align='left'>Explanation :<br/>" + ans.explanation + "</td></tr></table>"
                } else if (ans.typeName == 'B') {
                    question = "<table border=1><tr><td align='left'>I." + ans.statementI + "</td></tr><tr><td align='left'>Because </td></tr><tr><td align='left'> II." + ans.statementII + "</td></tr><tr><td align='left'>Correct answer :" + ans.correctAnswer + "</td></tr><tr><td align='left'>You selected :" + ans.submittedAnswer + "</td></tr><tr><td align='left'>Explanation :<br/>" + ans.explanation + "</td></tr></table>"
                }
            }
            $('#questionText').html(question);
        });
    });

    changeMobilePage('#pageReviewQuestion');

}

function popupIncorrectQuestionIndividual(uId, qno) { //Incorrect
    $('#questionText').html("");
    var question = "";
    var ans;
    db.transaction(function(tx) {
        tx.executeSql("SELECT question,statementI,statementII,TypeName,submittedAnswer,correctAnswer,explanation from tbtype,tbQuestionBank,tbquestionPaper where tbtype.typeid=tbquestionbank.typeid and tbQuestionBank.uId=" + uId + " and qno=" + qno + " and answerStatus ='W'", [], function(tx, result2) {
            if (result2.rows.length > 0) {
                ans = result2.rows.item(0);
                if (ans.typeName == 'A' || ans.typeName == 'C') {
                    question = "<table border=1><tr><td align='left'>Q." + qno + "." + ans.question + "</td></tr><tr><td align='left'>Correct answer :" + ans.correctAnswer + "</td></tr><tr><td align='left'>You selected :" + ans.submittedAnswer + "</td></tr><tr><td align='left'>Explanation :<br/>" + ans.explanation + "</td></tr></table>"
                } else if (ans.typeName == 'B') {
                    question = "<table border=1><tr><td align='left'>I." + ans.statementI + "</td></tr><tr><td align='left'>Because </td></tr><tr><td align='left'> II." + ans.statementII + "</td></tr><tr><td align='left'>Correct answer :" + ans.correctAnswer + "</td></tr><tr><td align='left'>You selected :" + ans.submittedAnswer + "</td></tr><tr><td align='left'>Explanation :<br/>" + ans.explanation + "</td></tr></table>"
                }
            }
            $('#questionText').html(question);
        });
    });

    changeMobilePage('#pageReviewQuestion');

}
function popupSkippedQuestion(qno) { //skiped
    $('#questionText').html("");
    var question = "";
    var ans;
    db.transaction(function(tx) {
        tx.executeSql("SELECT question,statementI,statementII,Typename,submittedAnswer,correctanswer,explanation from tbtype,tbQuestionBank,tbquestionPaper where tbtype.typeid=tbquestionbank.typeid and tbquestionpaper.uId =tbQuestionBank.uId and qno=" + qno + " and paperId='" + test1 + "' and answerStatus !='C' and answerStatus !='W'", [], function(tx, result2) {
            if (result2.rows.length > 0) {
                ans = result2.rows.item(0);
                if (ans.typeName == 'A' || ans.typeName == 'C') {
                    question = "<table border=1><tr><td align='left'>Q." + qno + "." + ans.question + "</td></tr><tr><td align='left'>Correct answer :" + ans.correctAnswer + "</td></tr><tr><td align='left'>You selected :" + ans.submittedAnswer + "</td></tr><tr><td align='left'>Explanation :<br/>" + ans.explanation + "</td></tr></table>"
                } else if (ans.typeName == 'B') {
                    question = "<table border=1><tr><td align='left'>I." + ans.statementI + "</td></tr><tr><td align='left'>Because</td></tr><tr><td align='left'>II." + ans.statementII + "</td></tr><tr><td align='left'>Correct answer :" + ans.correctAnswer + "</td></tr><tr><td align='left'>You selected :" + ans.submittedAnswer + "</td></tr><tr><td align='left'>Explanation :<br/>" + ans.explanation + "</td></tr></table>"
                }
            }
            $('#questionText').html(question);
        });
    });
    changeMobilePage('#pageReviewQuestion');
}
function popupSkippedQuestionCumulative(uId, qno) { //skiped
    $('#questionText').html("");
    var question = "";
    var ans;
    db.transaction(function(tx) {
        tx.executeSql("SELECT question,statementI,statementII,Typename,submittedAnswer,correctanswer,explanation from tbtype,tbQuestionBank,tbquestionPaper where tbtype.typeid=tbquestionbank.typeid and tbQuestionBank.uId=" + uId + " and qno=" + qno + " and  answerStatus =='S'", [], function(tx, result2) {
            if (result2.rows.length > 0) {
                ans = result2.rows.item(0);
                if (ans.typeName == 'A' || ans.typeName == 'C') {
                    question = "<table border=1><tr><td align='left'>Q." + qno + "." + ans.question + "</td></tr><tr><td align='left'>Correct answer :" + ans.correctAnswer + "</td></tr><tr><td align='left'>You selected :" + ans.submittedAnswer + "</td></tr><tr><td align='left'>Explanation :<br/>" + ans.explanation + "</td></tr></table>"
                } else if (ans.typeName == 'B') {
                    question = "<table border=1><tr><td align='left'>I." + ans.statementI + "</td></tr><tr><td align='left'>Because</td></tr><tr><td align='left'>II." + ans.statementII + "</td></tr><tr><td align='left'>Correct answer :" + ans.correctAnswer + "</td></tr><tr><td align='left'>You selected :" + ans.submittedAnswer + "</td></tr><tr><td align='left'>Explanation :<br/>" + ans.explanation + "</td></tr></table>"
                }
            }
            $('#questionText').html(question);
        });
    });
    changeMobilePage('#pageReviewQuestion');
}
function popupSkippedQuestionIndividual(uId, qno) { //skiped
    $('#questionText').html("");
    var question = "";
    var ans;
    db.transaction(function(tx) {
        tx.executeSql("SELECT question,statementI,statementII,Typename,submittedAnswer,correctanswer,explanation from tbtype,tbQuestionBank,tbquestionPaper where tbtype.typeid=tbquestionbank.typeid and tbQuestionBank.uId=" + uId + " and qno=" + qno + " and  answerStatus =='S'", [], function(tx, result2) {
            if (result2.rows.length > 0) {
                ans = result2.rows.item(0);
                if (ans.typeName == 'A' || ans.typeName == 'C') {
                    question = "<table border=1><tr><td align='left'>Q." + qno + "." + ans.question + "</td></tr><tr><td align='left'>Correct answer :" + ans.correctAnswer + "</td></tr><tr><td align='left'>You selected :" + ans.submittedAnswer + "</td></tr><tr><td align='left'>Explanation :<br/>" + ans.explanation + "</td></tr></table>"
                } else if (ans.typeName == 'B') {
                    question = "<table border=1><tr><td align='left'>I." + ans.statementI + "</td></tr><tr><td align='left'>Because</td></tr><tr><td align='left'>II." + ans.statementII + "</td></tr><tr><td align='left'>Correct answer :" + ans.correctAnswer + "</td></tr><tr><td align='left'>You selected :" + ans.submittedAnswer + "</td></tr><tr><td align='left'>Explanation :<br/>" + ans.explanation + "</td></tr></table>"
                }
            }
            $('#questionText').html(question);
        });
    });
    changeMobilePage('#pageReviewQuestion');
}

function popupUnattemptedQuestion(qno) { //Unattempted
    $('#questionText').html("");
    var question = "";
    var ans;
    db.transaction(function(tx) {
        tx.executeSql("SELECT question,statementI,statementII,Typename,submittedAnswer,correctanswer,explanation from tbtype,tbQuestionBank,tbquestionPaper where tbtype.typeid=tbquestionbank.typeid and tbquestionpaper.uId =tbQuestionBank.uId and qno=" + qno + " and paperId='" + test1 + "' and answerStatus !='C' and answerStatus !='W'", [], function(tx, result2) {
            if (result2.rows.length > 0) {
                ans = result2.rows.item(0);
                if (ans.typeName == 'A' || ans.typeName == 'C') {
                    question = "<table border=1><tr><td align='left'>Q." + qno + "." + ans.question + "</td></tr><tr><td align='left'>Correct answer :" + ans.correctAnswer + "</td></tr><tr><td align='left'>You selected :" + ans.submittedAnswer + "</td></tr><tr><td align='left'>Explanation:<br/>" + ans.explanation + "</td></tr></table>"
                } else if (ans.typeName == 'B') {
                    question = "<table border=1><tr><td align='left'>I." + ans.statementI + "</td></tr><tr><td align='left'>Because</td></tr><tr><td align='left'>II." + ans.statementII + "</td></tr><tr><td align='left'>Correct answer :" + ans.correctAnswer + "</td></tr><tr><td align='left'>You selected :" + ans.submittedAnswer + "</td></tr><tr><td align='left'>Explanation :<br/>" + ans.explanation + "</td></tr></table>"
                }
            }
            $('#questionText').html(question);
        });
    });
    changeMobilePage('#pageReviewQuestion');
}
function popupUnattemptedQuestionCumulative(uId, qno) { //Unattempted
    $('#questionText').html("");
    var question = "";
    var ans;
    db.transaction(function(tx) {
        tx.executeSql("SELECT question,statementI,statementII,Typename,submittedAnswer,correctanswer,explanation from tbtype,tbQuestionBank,tbquestionPaper where tbtype.typeid=tbquestionbank.typeid and tbQuestionBank.uId=" + uId + " and qno=" + qno + " and answerStatus !='C' and answerStatus !='W' and answerStatus !='S'", [], function(tx, result2) {
            if (result2.rows.length > 0) {
                ans = result2.rows.item(0);
                if (ans.typeName == 'A' || ans.typeName == 'C') {
                    question = "<table border=1><tr><td align='left'>Q." + qno + "." + ans.question + "</td></tr><tr><td align='left'>Correct answer :" + ans.correctAnswer + "</td></tr><tr><td align='left'>You selected :" + ans.submittedAnswer + "</td></tr><tr><td align='left'>Explanation:<br/>" + ans.explanation + "</td></tr></table>"
                } else if (ans.typeName == 'B') {
                    question = "<table border=1><tr><td align='left'>I." + ans.statementI + "</td></tr><tr><td align='left'>Because</td></tr><tr><td align='left'>II." + ans.statementII + "</td></tr><tr><td align='left'>Correct answer :" + ans.correctAnswer + "</td></tr><tr><td align='left'>You selected :" + ans.submittedAnswer + "</td></tr><tr><td align='left'>Explanation :<br/>" + ans.explanation + "</td></tr></table>"
                }
            }
            $('#questionText').html(question);
        });
    });
    changeMobilePage('#pageReviewQuestion');
}
function popupUnattemptedQuestionIndividual(uId, qno) { //Unattempted
    $('#questionText').html("");
    var question = "";
    var ans;
    db.transaction(function(tx) {
        tx.executeSql("SELECT question,statementI,statementII,Typename,submittedAnswer,correctanswer,explanation from tbtype,tbQuestionBank,tbquestionPaper where tbtype.typeid=tbquestionbank.typeid and tbQuestionBank.uId=" + uId + " and qno=" + qno + " and answerStatus !='C' and answerStatus !='W' and answerStatus !='S'", [], function(tx, result2) {
            if (result2.rows.length > 0) {
                ans = result2.rows.item(0);
                if (ans.typeName == 'A' || ans.typeName == 'C') {
                    question = "<table border=1><tr><td align='left'>Q." + qno + "." + ans.question + "</td></tr><tr><td align='left'>Correct answer :" + ans.correctAnswer + "</td></tr><tr><td align='left'>You selected :" + ans.submittedAnswer + "</td></tr><tr><td align='left'>Explanation:<br/>" + ans.explanation + "</td></tr></table>"
                } else if (ans.typeName == 'B') {
                    question = "<table border=1><tr><td align='left'>I." + ans.statementI + "</td></tr><tr><td align='left'>Because</td></tr><tr><td align='left'>II." + ans.statementII + "</td></tr><tr><td align='left'>Correct answer :" + ans.correctAnswer + "</td></tr><tr><td align='left'>You selected :" + ans.submittedAnswer + "</td></tr><tr><td align='left'>Explanation :<br/>" + ans.explanation + "</td></tr></table>"
                }
            }
            $('#questionText').html(question);
        });
    });
    changeMobilePage('#pageReviewQuestion');
}
function checkUser(uid, pass) {
    if (networkState()) {
        getDeviceInfoInJson(function(data) {
            var Data = data;
                        
			var dataUrl = getUserLoginUrl();
            $.ajax({
                type: "POST",
                url: dataUrl + '/registerUser',
                data: { username: uid, password: pass, deviceInfo: Data, isexist: true ,Version:1},
                
                success: function(responseText) {
                   
                    var xmlData = $(responseText).find("string").text();                            
                    var str1 = xmlData.split(':');
                    if (str1[0] > '0') {
                        InsertRecordInUserTable(str1[0], uid, pass);
                        changeMobilePage('#pageHome');
                    }
                    if (str1[0] == '-2') {
                        $().toastmessage('showNoticeToast', 'Incorrect Username');
                        document.getElementById("userPassword").value = "";
                        document.getElementById("userId").value = uid;
                        changeMobilePage('#pageWelcome');
                    }
                    if (str1[0] == '-3') {
                        $().toastmessage('showNoticeToast', 'Incorrect Password. Retype or tap on forgot password');
                        document.getElementById("userId1").value = uid;
                        document.getElementById("userPassword1").value = "";
                        changeMobilePage('#pageLogin');
                    }
                    if (str1[0] == '-5') {
                        $().toastmessage('showNoticeToast', 'Error In communication. Try again later');
                        document.getElementById("userId1").value = uid;
                        document.getElementById("userPassword1").value = "";
                    }
					 if (str1[0] == '-12') {
                        $().toastmessage('showNoticeToast', 'This user has exceed the limit of accessing this application from 5 devices.');
                         document.getElementById("userPassword").value = "";
                        document.getElementById("userId").value = uid;
                    }
                },
                error: function(xhqr, textStatus, errorThrown) {
                    if (textStatus == 'error' && errorThrown == 'Internal Server Error') {
                        $().toastmessage('showNoticeToast', 'Server error occurred.<br>Please try again later.');
                    } else {
                        toastServerError();
                    }

                }
            });
        })
    }
}
function changepassword() {
    var user;
    var cnt = 0;
    user = getUserId();
    db.transaction(function(tx) {
        tx.executeSql("select count(*) as cnt,* from tbUser where userId=" + user + " and userPassword ='" + document.getElementById("usercurrentPassword").value + "'", [], function(tx, result) {
            cnt = result.rows.item(0);
            if (cnt.cnt > 0) {
                if (document.getElementById("userNewPassword1").value == document.getElementById("userNewConfirmPassword1").value) {
                    changePasswordOnServer(cnt.userEmail, document.getElementById("usercurrentPassword").value, document.getElementById("userNewPassword1").value);
                } else {
                    $().toastmessage('showNoticeToast', 'New password and confirm new password mismaatched.');
                }
            } else {
                $().toastmessage('showNoticeToast', 'Wrong Current Password.');
            }
        });
    });
}
function changePasswordOnServer(email, oldpass, newpass) {
    if (networkState()) {
        var usr = getUserId();
        
		var dataUrl = getUserLoginUrl();
        $.ajax({
            type: "POST",
            url: dataUrl + '/changePassword',
            data: { 'username': email, 'oldpassword': oldpass, 'newpassword': newpass ,'Version':1},
            success: function(responseText) {
                var xmlData = $(responseText).find("string").text();
                var str1 = xmlData.split(':');
                if (str1[0] == usr) {
                    changePasswordOnClient(newpass, str1[1]);
                } else {
                    $().toastmessage('showNoticeToast', str1[1]);
                }
            },
            error: function(xhqr, textStatus, errorThrown) {
                if (textStatus == 'error' && errorThrown == 'Internal Server Error') {
                    $().toastmessage('showNoticeToast', 'Server error occurred.<br>Please try again later.');
                } else {
                    toastServerError();
                }
            }
        });
    }
}
function changePasswordOnClient(newpass, msg) {
    var usrid = getUserId();
    db.transaction(function(tx) {
        tx.executeSql("Update tbUser set userPassword =? where userId =?", [newpass, usrid], function(tx, result) {
            setControlParameters()
			$().toastmessage('showNoticeToast', msg);
            cleanall();
        });
    });
}
function cleanall() {
    document.getElementById("userId").value = "";
    document.getElementById("userPassword").value = "";
    document.getElementById("userId1").value = "";
    document.getElementById("userPassword1").value = "";
	document.getElementById("userConfirmPassword").value = "";
    document.getElementById("usercurrentPassword").value = "";
    document.getElementById("userNewPassword1").value = "";
    document.getElementById("userNewConfirmPassword1").value = "";
}

function logOut() {
    db.transaction(function(tx) {
        tx.executeSql("update tbControlParameters set currentLoginId="+anonymous );
        setControlParameters();
        cleanall();
		isShown=false;
        changeMobilePage('#pageWelcome');
        $('#pageWelcome').find('#divProgress').css("display", "none");
        $('#pageWelcome').find('#divWelcomeForm').css("display", "inline");

    });
}
function checkLoginStatus(callback) {
    var loginstat;
    db.transaction(function(tx) {
        tx.executeSql("select currentLoginId from tbControlParameters", [], function(tx, result) {
            if (result.rows.length > 0) {
                loginstat = result.rows.item(0);
                /*
                var page ="";
                if (loginstat.currentLoginId != '') {
                page = '#pageHome';
                } else {
                page = '#pageWelcome';
                }
                callback(page);
                */
                callback(loginstat.currentLoginId);

            }
        });
    });
}
function forgotPassword() {
    if (document.getElementById("userId1").value != "") {
        if (validateEmail(document.getElementById("userId1").value)) {
            if (networkState()) {
                 
				var dataUrl = getUserLoginUrl();
                $.ajax({
                    type: "POST",
                    url: dataUrl + '/resetPassword',
                    data: { username: document.getElementById("userId1").value ,Version:1}, 
                    success: function(responseText) {
                        var xmlData = $(responseText).find("string").text();
                        var str1 = xmlData.split(':');
                        if (str1[0] == '-3') {
                            $().toastmessage('showNoticeToast', str1[1]);
                        } else {
                            $().toastmessage('showNoticeToast', 'Your login information has been sent successfully to your email address.');
                        }
                    },
                    error: function(xhqr, textStatus, errorThrown) {
                        if (textStatus == 'error' && errorThrown == 'Internal Server Error') {
                            $().toastmessage('showNoticeToast', 'Server error occurred.<br>Please try again later.');
                        } else {
                            toastServerError();
                        }
                    }
                });
            }
        } else {
            $().toastmessage('showNoticeToast', 'Enter valid email address.');
        }
    } else {
        $().toastmessage('showNoticeToast', 'UserId can not be blank.');
    }

}
//Calculating all Cumulative Results
function showCumulativeProgress() {
    var htmlCode = "";
    var htmltopic = "";
    var htmlOverall = "";
    var res;
    var rawscore = 0 * 1;
    var score;
    var elapsedtime;
    var OverallProgress;
    var averagescore = 0;
    var time;

    db.transaction(function(tx) {
        tx.executeSql("select sum(score)as aveage,(select sum(finishTime) from tbpaper where paperStatus='C' and mode!='P' and userId=" + getUserId() + " and testId in(SELECT testId from tbTest where testName<>'QoD')) as time,count(paperId)as totalPaper from tbPaper where paperStatus='C' and mode!='P' and userId=" + getUserId() + " and testid in(select testid from tbTest where testName<>'QoD')", [], function(tx, result) {
            if (result.rows.length > 0) {
                res = result.rows.item(0);
                //rawscore = (res.correct * 1) - (res.wrong * .25);
				var avg = (res.aveage /res.totalPaper);
				var percentOfScore=((avg-250)/(800-250))*100
                //tx.executeSql("select scaledScore from tbRawScaledScore where rawscore=" + Math.round(rawscore), [], function(tx, result1) {
                    //if (result1.rows.length > 0) {
                      //  score = result1.rows.item(0);
                        //var percentOfScore = (score.scaledScore * 100) / 800;
                        htmlCode += "<div width='70%' class=statusBox> <table width='95%'><tr><td width=10% valign=center align=center rowspan=2><div class=imgGear>&nbsp;</div></td>";
                        htmlCode += "<td width=40% align=left>Cumulative </td><td align=right>" + Math.round(avg) + "(" + formatAsTime(res.time) + ")</td></tr>";
                        htmlCode += "<tr><td colspan=2><div class='meter-wrap tapTest'>" +
																"<div id='callProgressScreen1' class='meter-value' style='width:" + percentOfScore + "%;' >" +
																"</div>" +
																"</div></td></tr><tr><td colspan=5 align='right'><a id='lnkShowTest' class='link'>SHOW TEST(S)</a></td></tr></table></div>";
                    }
                    $('#divCumulative').html(htmlCode);
                //});
            //}
        });
    });


    db.transaction(function(tx) {
        tx.executeSql("select sum(finishTime) as time from tbPaper where paperStatus='C' and mode!='P' and userId=" + getUserId() + " and  testid in(select testid from tbTest where testName<>'QoD')", [], function(tx, result) {
            if (result.rows.length > 0) {
                elapsedtime = result.rows.item(0);
            }
            time = formatAsTime(elapsedtime.time);
            htmlOverall = "<div width='70%' id='divOverallStatus'></div><table width='95%' class='tableText' border='0'><tr><td align='left' colspan='3' class='hedingprogress'>Overall details</td></tr><tr style='color:#353535;'><td colspan='2' align='left'>Elapsed Time</td><td align='right'>" + time + "</td></tr>";
            tx.executeSql("select count(*)as overall ,(select count(*) from tbquestionPaper where paperId in(select paperId from tbpaper where paperStatus='C' and mode!='P' and userId=" + getUserId() + " and testid in (select testid from tbTest where testName<>'QoD')) and answerStatus='C')as correct from tbquestionPaper where paperId in(select paperId from tbpaper where paperStatus='C' and mode!='P' and userId=" + getUserId() + " and testid in (select testid from tbTest where testName<>'QoD'))", [], function(tx, result) {
                if (result.rows.length > 0) {
                    OverallProgress = result.rows.item(0);
                }
                htmlOverall += "<tr style='color:#353535;'><td colspan='2' align='left'>Correct Answers</td><td align='right'>" + OverallProgress.correct + "(" + OverallProgress.overall + ")</td></tr>";
                tx.executeSql("select sum(score)as aveage,count(paperId)as totalPaper from tbPaper where paperStatus='C' and mode!='P' and userId=" + getUserId() + " and testid in(select testid from tbTest where testName<>'QoD')", [], function(tx, result) {
                    if (result.rows.length > 0) {
                        averagescore = result.rows.item(0);
                    }
                    var avgscore = averagescore.aveage / averagescore.totalPaper;
                    htmlOverall += "<tr style='color:#353535;'><td colspan='2' align='left'>Current Average Score</td><td align='right'>" + Math.round(avgscore) + "</td></tr></table>";
                    $('#divOverAllDetails').html(htmlOverall);
                });
            });
        });
    });
    //Topicwise Cumulative	
    db.transaction(function(tx) {
        htmltopic += "<div width='70%' id='divTopic' class='progresscontent'></div><table width='95%' class='tableText' border='0'><tr><td align='left' colspan='3' class='hedingprogress'>By Topics</td></tr></table>"
        for (i = 0; i < arr.length; i++) {

            tx.executeSql("select distinct(topicName),topicId,(select count(*) from tbquestionPaper where paperId in (select paperId from tbpaper where paperStatus='C' and mode!='P' and userId=" + getUserId() + " and testid in(select testid from tbTest where testName<>'QoD')) and answerStatus='C' and uId in(select uId from tbQuestionBank where topicId=" + arr[i] + ")) as correct,(select count(*) from tbquestionPaper where paperId in (select paperId from tbpaper where paperStatus='C' and mode!='P' and userId=" + getUserId() + " and testid in(select testid from tbTest where testName<>'QoD')) and uId in(select uId from tbQuestionBank where topicId=" + arr[i] + ")) as total from tbQuestionPaper,tbtopics where topicId=" + arr[i], [], function(tx, result2) {
                if (result2.rows.length > 0) {
                    topicwise = result2.rows.item(0);

                    htmltopic += "<div  id='divTopicwiseCumulative'class=statusBox onclick='showTopicDetailsCumulative(" + topicwise.topicId + ")'> <table width=96% border=0><tr>";
                    htmltopic += "<td width=40% align='left'>" + topicwise.topicName + " </td><td align=right>" + Math.round((topicwise.correct * 100) / topicwise.total) + "%(" + topicwise.correct + " of " + topicwise.total + ")" + "</td></tr>";
                    htmltopic += "<tr><td colspan=2><div class='meter-wrap tapTest'>" +
																	"<div id='callProgressScreen1' class='meter-value' style='width:" + (topicwise.correct * 100) / topicwise.total + "%;' >" +
																	"</div>" +
																	"</div></td></tr></table></div>";
                }
                $('#divTopicWise').html(htmltopic);
            });
        }
    });
}
function showTestList() {
    var attempted = "";
    var htmlList = "";
    var testId = 0;
    db.transaction(function(tx) {
		htmlList += "<hr class=hrStyle>";
		
        for (n = 0; n < arrTests.length; n++) {
            tx.executeSql("select count(*) as attempted,(select testName from tbtest where testid=" + arrTests[n] + ") as testName,(select testId from tbtest where testid=" + arrTests[n] + ") as id,(select sum(finishTime) from tbpaper where paperStatus='C' and mode!='P' and userId=" + getUserId() + " and testId=" + arrTests[n] + ") as time,(select count(*) from tbquestionPaper where paperId in (select paperId from tbPaper where testId=" + arrTests[n] + " and paperStatus='C' and mode!='P' and userId=" + getUserId() + ") and (answerStatus='W' or answerStatus='C' or answerStatus='S')) as wrong from tbquestionPaper where paperId in (select paperid from tbpaper where testId=" + arrTests[n] + " and paperStatus='C' and mode!='P' and userId=" + getUserId() + ")", [], function(tx, result) {
                if (result.rows.length > 0) {
                    attempted = result.rows.item(0);
                    percentOfScore = Math.round((attempted.wrong * 100) / attempted.attempted);
                    htmlList += "<div align=center class=statusBox onClick=showIndividualTest(" + attempted.id + ")> <table width=100%><tr><td width=15% align=center rowspan=2><div class=imgGear>&nbsp;</div></td>";
					htmlList += "<td><div>" +
								"<table width=100%><tr>";
					
                    htmlList += "<td>" + attempted.testName + " </td><td align=right>" + percentOfScore + "%(" + formatAsTime(attempted.time) + ")" + "</td></tr>";
								
                    htmlList += "<tr><td colspan=2><div class='meter-wrap tapTest'>" +
								"<div id='callProgressScreen1' class='meter-value' style='width:" + percentOfScore + "%;' >" +
								"</div>" +
								"</div></td></tr></table></div></td><td rowspan=2 width=5%></td></tr></table></div>";
				
				htmlList += "<hr class=hrStyle>";
				
				
                }
                $('#divTestListProgress').html(htmlList);
            });
        }
    });
}
function showIndividualTest(tid) {
    var htmlCode = "";
    var htmltopic = "";
    var htmlOverall = "";
    var res;
    var rawscore = 0 * 1;
    var score;
    var elapsedtime;
    var OverallProgress;
    var averagescore = 0;
    var time;
    db.transaction(function(tx) {
        tx.executeSql("select count(*)as correct,(select testName from tbtest where testid=" + tid + ") as testName,(select sum(finishTime) from tbpaper where paperStatus='C' and userId=" + getUserId() + " and testId=" + tid + ") as time,(select count(*) from tbquestionPaper where paperId in (select paperId from tbPaper where testId=" + tid + ") and answerStatus='W') as wrong from tbquestionPaper where paperId in (select paperId from tbPaper where testId=" + tid + ") and answerStatus='C'", [], function(tx, result) {
            if (result.rows.length > 0) {
                res = result.rows.item(0);
                rawscore = (res.correct * 1) - (res.wrong * .25);
                tx.executeSql("select scaledScore from tbRawScaledScore where rawscore=" + Math.round(rawscore), [], function(tx, result1) {
                    if (result1.rows.length > 0) {
                        score = result1.rows.item(0);
                        var percentOfScore = (score.scaledScore * 100) / 800;
                        htmlCode += "<div width='70%' class=statusBox> <table width=95%><tr><td width=10% valign=center align=center rowspan=2><div class=imgGear>&nbsp;</div></td>";
                        htmlCode += "<td width=40% align=left>" + res.testName + " </td><td align=right>" + percentOfScore + "%(" + formatAsTime(res.time) + ")</td></tr>";
                        htmlCode += "<tr><td colspan=2><div class='meter-wrap tapTest'>" +
																"<div id='callProgressScreen1' class='meter-value' style='width:" + percentOfScore + "%;' >" +
																"</div>" +
																"</div></td></tr><tr><td colspan=5 align='right'><a id='lnkShowcumulativeTest' class='link'>SHOW AGGREGATE</a></td></tr></table></div>";
                    }
                    $('#divIndividialProgress').html(htmlCode);
                });
            }

        });
    });
    db.transaction(function(tx) {
        tx.executeSql("select sum(finishTime) as time from tbPaper where paperStatus='C' and userId=" + getUserId() + " and  testid =" + tid, [], function(tx, result) {
            if (result.rows.length > 0) {
                elapsedtime = result.rows.item(0);
            }
            time = formatAsTime(elapsedtime.time);
            htmlOverall = "<div width='70%' id='divOverallStatus'></div><table width='95%' class='tableText' border='0'><tr><td align='left' colspan='3' class='hedingprogress'>Overall details</td></tr><tr style='color:#353535;'><td colspan='2' align='left'>Elapsed Time</td><td align='right'>" + time + "</td></tr>";
            tx.executeSql("select count(*)as overall ,(select count(*) from tbquestionPaper where paperId in(select paperId from tbpaper where paperStatus='C' and userId=" + getUserId() + " and testid=" + tid + ") and answerStatus='C')as correct,(select count(*) from tbquestionPaper where paperId in(select paperId from tbpaper where paperStatus='C' and userId=" + getUserId() + " and testid=" + tid + ") and answerStatus='W')as incorrect,(select count(*) from tbquestionPaper where paperId in(select paperId from tbpaper where paperStatus='C' and userId=" + getUserId() + " and testid=" + tid + ") and answerStatus='S')as skipped from tbquestionPaper where paperId in(select paperId from tbpaper where paperStatus='C' and userId=" + getUserId() + " and testid=" + tid + ")", [], function(tx, result) {
                if (result.rows.length > 0) {
                    OverallProgress = result.rows.item(0);
                }
                htmlOverall += "<tr style='color:#353535;'><td colspan='2' align='left'>Correct Answers</td><td align='right'>" + OverallProgress.correct + "(" + OverallProgress.overall + ")</td></tr>";
                htmlOverall += "<tr style='color:#353535;'><td colspan='2' align='left'>Incorrect Answers</td><td align='right'>" + OverallProgress.incorrect + "(" + OverallProgress.overall + ")</td></tr>";
				htmlOverall += "<tr style='color:#353535;'><td colspan='2' align='left'>Skipped Questions</td><td align='right'>" + OverallProgress.skipped + "(" + OverallProgress.overall + ")</td></tr>";
				
				tx.executeSql("select sum(score)as aveage,count(paperId)as totalPaper from tbPaper where paperStatus='C' and userId=" + getUserId() + " and testid=" + tid, [], function(tx, result) {
                    if (result.rows.length > 0) {
                        averagescore = result.rows.item(0);
                    }
                    var avgscore = averagescore.aveage / averagescore.totalPaper;
                    htmlOverall += "<tr style='color:#353535;'><td colspan='2' align='left'>Current Score</td><td align='right'>" + avgscore + "</td></tr></table>";
                    $('#divIndividialProgressOverAllDetails').html(htmlOverall);
                });
            });
        });
    });
    //Topicwise Cumulative
    db.transaction(function(tx) {
        htmltopic += "<div width='70%' id='divTopic' class='progresscontent'></div><table width='95%' class='tableText' border='0'><tr><td align='left' colspan='3' class='hedingprogress'>By Topics</td></tr></table>"
        for (i = 0; i < arr.length; i++) {

            tx.executeSql("select distinct(topicName),topicId,(select count(*) from tbquestionPaper where paperId in (select paperId from tbpaper where paperStatus='C' and userId=" + getUserId() + " and testid =" + tid + ") and answerStatus='C' and uId in(select uId from tbQuestionBank where topicId=" + arr[i] + ")) as correct,(select count(*) from tbquestionPaper where paperId in (select paperId from tbpaper where paperStatus='C' and userId=" + getUserId() + " and testid=" + tid + ") and uId in(select uId from tbQuestionBank where topicId=" + arr[i] + ")) as total from tbQuestionPaper,tbtopics where topicId=" + arr[i], [], function(tx, result2) {
                if (result2.rows.length > 0) {
                    topicwise = result2.rows.item(0);

                    htmltopic += "<div id='divTopiciIndividual' class=statusBox onClick='ShowTopicDetailsIndividual(" + topicwise.topicId + "," + tid + ")'> <table width=96% border=0><tr>";
                    htmltopic += "<td width=40% align='left'>" + topicwise.topicName + " </td><td align=right>" + Math.round((topicwise.correct * 100) / topicwise.total) + "%(" + topicwise.correct + " of " + topicwise.total + ")" + "</td></tr>";
                    htmltopic += "<tr><td colspan=2><div class='meter-wrap tapTest'>" +
																"<div id='callProgressScreen1' class='meter-value' style='width:" + (topicwise.correct * 100) / topicwise.total + "%;' >" +
																"</div>" +
																"</div></td></tr></table></div>";
                }
                $('#divIndividialProgressTopicWise').html(htmltopic);
            });
        }
    });
    changeMobilePage('#pageIndividualtestProgress');
}

var currentQuestionNo;
var currentuId;
//Newly Added on 3-Jan-2012  for reviewing question
function ReviewNextQuestion() {
    for (i = 0; i <= arrqueid.length; i++) {
       
			if (arrqueid[i] == currentuId) {
				if(i==arrqueid.length-1){
					showAppToast('showWarningToast', 'You are on Last question of this group', 1000);
				}else{
					generateQuestionsForReview(arrqueid[i + 1]);
					break;
				}
			}
    }
}
function ReviewPreviousQuestion() {
    for (i = 0; i <= arrqueid.length; i++) {
		if (arrqueid[i] == currentuId) {
			if(i==0){
				showAppToast('showWarningToast', 'You are on First question of this group', 1000);
			}else{
				generateQuestionsForReview(arrqueid[i - 1]);
				break;
			}
		}
    }
}


function generateQuestionsForReview(uId,ansStat,topicid,tid) {
    var strSql = "";
    currentuId = uId;
	
	$('html, body').animate({scrollTop:0}, 'slow');
	
    if (isCumulativeProgress == true) {
        isPaperdetailsCumulative = true;
        isCumulativeProgress = false;
    }
    if (isIndividualProgress == true) {
        isPaperdetailsIndividual = true;
        isIndividualProgress = false;
    }
	db.transaction(function(tx) {
		if(topicid==0){
			if(ansStat==4){
							 tx.executeSql("SELECT uid from tbQuestionpaper where answerStatus !='S' and answerStatus !='C' and answerStatus !='W' and paperId='" +test1+"'", [], function(tx, result1) {
								if (result1.rows.length > 0) {
									arrqueid = new Array();
									for (i = 0; i < result1.rows.length; i++) {
											item = result1.rows.item(i);
										arrqueid.push(item.uId);
									}

								}

							});
			
			}else{
					if(ansStat==1){
							 tx.executeSql("SELECT uid from tbQuestionpaper where answerStatus='W' and paperId='" +test1+"'"  , [], function(tx, result1) {
								if (result1.rows.length > 0) {
								arrqueid = new Array();
								for (i = 0; i < result1.rows.length; i++) {
									item = result1.rows.item(i);
									arrqueid.push(item.uId);
								}

							}

						});
					}
					if(ansStat==2){
								 tx.executeSql("SELECT uid from tbQuestionpaper where answerStatus='C' and paperId='" +test1+"'", [], function(tx, result1) {
									if (result1.rows.length > 0) {
									arrqueid = new Array();
									for (i = 0; i < result1.rows.length; i++) {
										item = result1.rows.item(i);
										arrqueid.push(item.uId);
									}

								}

							});
					}
			
				if(ansStat==3){
						 tx.executeSql("SELECT uid from tbQuestionpaper where answerStatus='S' and paperId='" +test1+"'", [], function(tx, result1) {
							if (result1.rows.length > 0) {
							arrqueid = new Array();
							for (i = 0; i < result1.rows.length; i++) {
								item = result1.rows.item(i);
								arrqueid.push(item.uId);
							}

						}

					});
				}
			}
			
		}else{
			if(tid==0){  //All test and specific topic
							if(ansStat==4){
											 tx.executeSql("SELECT uid from tbQuestionpaper where answerStatus !='S' and answerStatus !='C' and answerStatus !='W' and paperId in (select paperId from tbpaper where paperStatus='C' and userId=" + getUserId() + " and testid in(select testid from tbTest where testName<>'QoD')) and uid in(select uid from tbQuestionBank where topicId=" + topicid + ")", [], function(tx, result1) {
												
												if (result1.rows.length > 0) {
													arrqueid = new Array();
													for (i = 0; i < result1.rows.length; i++) {
															item = result1.rows.item(i);
														arrqueid.push(item.uId);
													}

												}

											});
							
							}else{
									if(ansStat==1){
											 tx.executeSql("SELECT uId from tbQuestionpaper where answerStatus='W' and paperId in (select paperId from tbpaper where paperStatus='C' and userId=" + getUserId() + " and testid in(select testid from tbTest where testName<>'QoD')) and uid in(select uid from tbQuestionBank where topicId=" + topicid + ")"  , [], function(tx, result1) {
												if (result1.rows.length > 0) {
												arrqueid = new Array();
												for (i = 0; i < result1.rows.length; i++) {
													item = result1.rows.item(i);
													arrqueid.push(item.uId);
												}

											}

										});
									}
										if(ansStat==2){
										 tx.executeSql("SELECT uId from tbQuestionpaper where answerStatus='C' and paperId in (select paperId from tbpaper where paperStatus='C' and userId=" + getUserId() + " and testid in(select testid from tbTest where testName<>'QoD')) and uid in(select uid from tbQuestionBank where topicId=" + topicid + ")", [], function(tx, result1) {
											if (result1.rows.length > 0) {
											arrqueid = new Array();
											for (i = 0; i < result1.rows.length; i++) {
												item = result1.rows.item(i);
												arrqueid.push(item.uId);
											}

										}

									});
								}
					
							if(ansStat==3){
									 tx.executeSql("SELECT uId from tbQuestionpaper where answerStatus='S' and paperId in (select paperId from tbpaper where paperStatus='C' and userId=" + getUserId() + " and testid in(select testid from tbTest where testName<>'QoD')) and uid in(select uid from tbQuestionBank where topicId=" + topicid + ")", [], function(tx, result1) {
										if (result1.rows.length > 0) {
										arrqueid = new Array();
										for (i = 0; i < result1.rows.length; i++) {
											item = result1.rows.item(i);
											arrqueid.push(item.uId);
										}

									}

								});
							}
					}
			}else{ //specific test and specific topic 
								if(ansStat==4){
											 tx.executeSql("SELECT qno,uId,srNo from tbQuestionpaper where answerStatus !='S' and answerStatus !='C' and answerStatus !='W' and paperId in (select paperId from tbpaper where paperStatus='C' and userId=" + getUserId() + " and testId=" + tid + ") and uid in(select uid from tbQuestionBank where topicId=" + topicid + ")", [], function(tx, result1) {
												
												if (result1.rows.length > 0) {
													arrqueid = new Array();
													for (i = 0; i < result1.rows.length; i++) {
															item = result1.rows.item(i);
														arrqueid.push(item.uId);
													}

												}

											});
							
							}else{
									if(ansStat==1){
											 tx.executeSql("SELECT uId from tbQuestionpaper where answerStatus='W' and paperId in (select paperId from tbpaper where paperStatus='C' and userId=" + getUserId() + " and testId=" + tid + ") and uid in(select uid from tbQuestionBank where topicId=" + topicid + ")", [], function(tx, result1) {
												if (result1.rows.length > 0) {
												arrqueid = new Array();
												for (i = 0; i < result1.rows.length; i++) {
													item = result1.rows.item(i);
													arrqueid.push(item.uId);
												}

											}

										});
									}
										if(ansStat==2){
										 tx.executeSql("SELECT uId from tbQuestionpaper where answerStatus='C' and paperId in (select paperId from tbpaper where paperStatus='C' and userId=" + getUserId() + " and testId=" + tid + ") and uid in(select uid from tbQuestionBank where topicId=" + topicid + ")", [], function(tx, result1) {
											if (result1.rows.length > 0) {
											arrqueid = new Array();
											for (i = 0; i < result1.rows.length; i++) {
												item = result1.rows.item(i);
												arrqueid.push(item.uId);
											}

										}

									});
								}
					
							if(ansStat==3){
									 tx.executeSql("SELECT uId from tbQuestionpaper where answerStatus='S' and paperId in (select paperId from tbpaper where paperStatus='C' and userId=" + getUserId() + " and testId=" + tid + ") and uid in(select uid from tbQuestionBank where topicId=" + topicid + ")", [], function(tx, result1) {
										if (result1.rows.length > 0) {
										arrqueid = new Array();
										for (i = 0; i < result1.rows.length; i++) {
											item = result1.rows.item(i);
											arrqueid.push(item.uId);
										}

									}

								});
							}
					}
					
			
			}
			
		
		}
	
	
	});

    db.transaction(function(tx) {

        strSql = "SELECT * FROM tbQuestionBank qb ,tbType tp, tbQuestionPaper qp WHERE qb.typeId = tp.typeId AND qb.uId = qp.uId AND qp.uId=? AND qp.paperId in(select paperId from tbpaper where paperStatus='C' and userId=" + getUserId() + " and testid in(select testid from tbTest where testName<>'QoD'))";
        tx.executeSql(strSql, [uId], function(tx, result) {
            if (result.rows.length > 0) {
                var currentQuestion = result.rows.item(0);
				setCurrentQuestionUid(currentQuestion.uId);
                var answer = currentQuestion.submittedAnswer;
                var correctAnswer = currentQuestion.correctAnswer;
                var time = currentQuestion.timeTaken;
                var divSelectedAnswer = "Choose answer: ";
                var htmlSource = "";
                var opts = ""
                var divTestQuestionView = "";
                var divSelectedAnswer;
                var divCorrectAnswer = currentQuestion.correctAnswer;
                var divQuestionType = "";
                currentUidRef = currentQuestion.refNo + ", UID: " + currentQuestion.uId;
                if (currentQuestion.answerStatus == 'C') {
                    divQuestionType = "Correct"
                } else if (currentQuestion.answerStatus == 'W') {
                    divQuestionType = "Incorrect"
                } else if (currentQuestion.answerStatus == 'S') {
                    divQuestionType = "Skipped"
                } else {
                    divQuestionType = "Unattempted"
                }
                if (answer == undefined) { answer = ''; }

                if (answer != '') {
                    divSelectedAnswer = "Your answer: [ " + answer + " , " + time + " sec, " + divQuestionType + " ]";
                }
                else {
                    divSelectedAnswer = "Your answer: " + divQuestionType;
                }

                var testname = "";
                testname = currentQuestion.refNo.split('/');
                $('#spnReviewQuestionType').html(testname[0] + ' - Q' + currentQuestion.srNo);

                if (currentQuestion.typeName == "A") {
                    htmlSource += currentQuestion.question + "<br>";
                    if (currentQuestion.choiceA != "") {
                        try {
                            opts = "<table width='100%'  class='alpha60'  border ='0' cellspacing='0' cellpadding='0' > " +
							"<tr> <td id='tdA1' width='10%' valign='middle'> <center><div id = 'btnA'  class = 'circle-button-gray' > A  </div> </center></td>" +
							"	 <td id='tdA2' align='left' width='90%' class='questionAnswerColor tdTextBorder'> " +
							"		<div id='choiceAText'>" + currentQuestion.choiceA + "</div>	" +
							" </td>  </tr>" +
							"<tr style= 'background-color:lightgray' class='alpha60'>" +
							"	<td id='tdB1' width='10%' valign='middle'> <center> <div id = 'btnB' class = 'circle-button-gray'> B  </div> </center></td>" +
							"	<td id='tdB2' align='left' width='90%' class='questionAnswerColor tdTextBorder'> " +
							"		<div id='choiceBText'>" + currentQuestion.choiceB + "</div>" +
							"</td>" +
							"</tr> <tr>" +
							"	<td id='tdC1' width='10%' valign='middle'> <center> <div id = 'btnC' class = 'circle-button-gray'> C  </div> </center></td>" +
							"	<td id='tdC2' align='left' width='90%' class='questionAnswerColor tdTextBorder'>" +
							"		<div id='choiceCText'>" + currentQuestion.choiceC + "</div>" +
							"</td>" +
							"</tr> <tr style= 'background-color:lightgray'  class='alpha60'>" +
							"	<td id='tdD1' width='10%' valign='middle'> <center> <div id = 'btnD' class = 'circle-button-gray'> D  </div> </center></td>" +
							"	<td id='tdD2' align='left' width='90%' class='questionAnswerColor tdTextBorder'> " +
							"		<div id='choiceDText'>" + currentQuestion.choiceD + "</div>" +
							"</td>" +
							"</tr> <tr> " +
							"	<td id='tdE1' width='10%' valign='middle'> <center><div id = 'btnE' class = 'circle-button-gray'> E  </div> </center></td>" +
							"	<td id='tdE2' align='left' width='90%' class='questionAnswerColor tdTextBorder'> " +
							"		<div id='choiceEText'>" + currentQuestion.choiceE + "</div>" +
							"</td> " +
							"</tr> </table>   ";

                        }
                        catch (e) {

                        }
                    }
                    else {

                        opts = "<table width='100%'  class='alpha60'  border ='0' cellspacing='0' cellpadding='0'> " +
							"<tr> <td valign='middle'> <center> <div id = 'btnChA' class = 'circle-button-gray'> A  </div> <div id='choiceAText'> </div></center> </td>" +
							"	  <td valign='middle'> <center> <div id = 'btnChB' class = 'circle-button-gray'> B  </div> <div id='choiceBText'> </div></center> </td>" +
							"	  <td valign='middle'> <center> <div id = 'btnChC' class = 'circle-button-gray'> C  </div> <div id='choiceCText'> </div></center> </td>" +
							"	  <td valign='middle'> <center> <div id = 'btnChD' class = 'circle-button-gray'> D  </div> <div id='choiceDText'> </div></center> </td>" +
							"	  <td valign='middle'> <center> <div id = 'btnChE' class = 'circle-button-gray'> E  </div> <div id='choiceEText'> </div></center> </td>" +
							"</tr> </table> <br> ";

                    }

                    divTestQuestionView = "<table style='width:100%'>" +
						"<tr style= 'background-color:lightgray' class='alpha60'>" +
							"<td class = 'vertical-align-middle align-left' style='width:33%;color:#0071BC;'> <b><div id='divSelectedAnswer' class='divChooseAns'>" + divSelectedAnswer + " </div></b></td>" +
						"</tr>" +
						"</table>" +
						"<div id='divOptions' class='alpha60'>" + opts + " </div> <br/>" +
						" <div id ='divQuestionPart' style='text-align:left' class='questionAnswerColor divQuestPart'>" + htmlSource + "</div>";

                }
                else if (currentQuestion.typeName == "C") {
                    htmlSource += currentQuestion.question + "<br>";
                    if (currentQuestion.choiceA != "") {
                        try {
                            opts = "<table width='100%'  class='alpha60'  border ='0' cellspacing='0' cellpadding='0' > " +
							"<tr> <td id='tdA1' width='10%' valign='middle'> <center><div id = 'btnA'  class = 'circle-button-gray'> A  </div> </center></td>" +
							"	 <td id='tdA2' align='left' width='90%' class='questionAnswerColor tdTextBorder'> " +
							"		<div id='choiceAText'>" + currentQuestion.choiceA + "</div>" +
							"</td>  </tr>" +
							"<tr style= 'background-color:lightgray' class='alpha60'>" +
							"	<td id='tdB1' width='10%' valign='middle'> <center> <div id = 'btnB' class = 'circle-button-gray'> B  </div> </center></td>" +
							"	<td id='tdB2' align='left' width='90%' class='questionAnswerColor tdTextBorder'> " +
							"		<div id='choiceBText'>" + currentQuestion.choiceB + "</div>" +
							"</td>" +
							"</tr> <tr>" +
							"	<td id='tdC1' width='10%' valign='middle'> <center> <div id = 'btnC' class = 'circle-button-gray'> C  </div> </center></td>" +
							"	<td id='tdC2' align='left' width='90%' class='questionAnswerColor tdTextBorder'>" +
							"		<div id='choiceCText'>" + currentQuestion.choiceC + "</div>" +
							"</td>" +
							"</tr> <tr style= 'background-color:lightgray'  class='alpha60'>" +
							"	<td id='tdD1' width='10%' valign='middle'> <center> <div id = 'btnD' class = 'circle-button-gray'> D  </div> </center></td>" +
							"	<td id='tdD2' align='left' width='90%' class='questionAnswerColor tdTextBorder'> " +
							"		<div id='choiceDText'>" + currentQuestion.choiceD + "</div>	" +
							"</td>" +
							"</tr> <tr> " +
							"	<td id='tdE1' width='10%' valign='middle'> <center><div id = 'btnE' class = 'circle-button-gray'> E  </div> </center></td>" +
							"	<td id='tdE2' align='left' width='90%' class='questionAnswerColor tdTextBorder'> " +
							"		<div id='choiceEText'>" + currentQuestion.choiceE + "</div>	" +
							"</td> " +
							"</tr> </table>   ";

                        }
                        catch (e) {

                        }
                    }
                    else {
                        opts = "<table width='100%'  class='alpha60'  border ='0' cellspacing='0' cellpadding='0'> " +
							"<tr> <td valign='middle'> <center> <div id = 'btnChA' class = 'circle-button-gray'> A </div> <div id='choiceAText'> </div> </center> </td>" +
							"	  <td valign='middle'> <center> <div id = 'btnChB' class = 'circle-button-gray'> B  </div> <div id='choiceBText'> </div></center> </td>" +
							"	  <td valign='middle'> <center> <div id = 'btnChC' class = 'circle-button-gray'> C  </div> <div id='choiceCText'> </div></center> </td>" +
							"	  <td valign='middle'> <center> <div id = 'btnChD' class = 'circle-button-gray'> D  </div> <div id='choiceDText'> </div></center> </td>" +
							"	  <td valign='middle'> <center> <div id = 'btnChE' class = 'circle-button-gray'> E  </div> <div id='choiceEText'> </div></center> </td>" +
							"</tr> </table> <br> ";

                    }

                    divTestQuestionView = " <div id ='divQuestionPart' style='text-align:left' class='questionAnswerColor divQuestPart'>" + htmlSource + "</div>" +
					"<br>" +
					"<table style='width:100%'>" +
						"<tr style= 'background-color:lightgray' class='alpha60'>" +
							"<td class = 'vertical-align-middle align-left' style='width:33%;color:#0071BC;'> <b><div id='divSelectedAnswer' class='divChooseAns'>" + divSelectedAnswer + " </div></b></td>" +
						"</tr>" +
					"</table>" +
					"<div id='divOptions' class='alpha60'>" + opts + " </div>";

                }
                else if (currentQuestion.typeName == "B") {

                    htmlSource += "<table width=100%>";
                    htmlSource += "  <tr>";
                    htmlSource += "	<th align=center width=45%>Statement I</th>";
                    htmlSource += "	<td width=10%>&nbsp;</td>";
                    htmlSource += "	<th align=center width=45%>Statement II</th>";
                    htmlSource += "  </tr>";
                    htmlSource += "  <tr>";
                    htmlSource += "	<td  align=center style='border-style:groove;border:solid 1px;'>" + currentQuestion.statementI + "</td>";
                    htmlSource += "	<td style='color:#F00' align='center'>because</td>";
                    htmlSource += "	<td align=center style='border-style:groove;border:solid 1px;'>" + currentQuestion.statementII + "</td>";
                    htmlSource += "  </tr>";
                    htmlSource += "</table>";

                    opts = "<table width='100%' border ='0' cellspacing='0' cellpadding='0'>" +
				"<tr class='alpha60'> <td align='center'> <div id = 'btnIT' class = 'circle-button-gray'>T</div> </td>" +
				"<td align='center'>(I)</td><td align='center'><div id = 'btnIF' class = 'circle-button-gray'>F</div> </td> </tr>" +
				"<tr><th colspan='2'>&nbsp;</th></tr>" +
				"<tr class='alpha60'><td align='center'><div id = 'btnIIT' class = 'circle-button-gray' >T</div> </td>" +
				"<td align='center'>(II)</td><td align='center'><div id = 'btnIIF' class = 'circle-button-gray'> F  </div> </td> </tr>" +
				"<tr><th colspan='2'>&nbsp;</th></tr>" +
				"<tr class='alpha60'><td align='center'><div id = 'btnCE' class = 'circle-button-gray'>CE</div> </td> " +
				"<td align='center'>CE</td><td align='center'><div id = 'btnC' class = 'circle-button-gray'>  &nbsp;&nbsp;&nbsp;&nbsp;  </div> </td>  </tr><tr><th colspan='2'>&nbsp;</th></tr> </table>";

                    divTestQuestionView = " <div id ='divQuestionPart' style='text-align:left' class='questionAnswerColor'>" + htmlSource + "</div>" +
					"<br>" +
					"<table style='width:100%;'>" +
						"<tr style= 'background-color:lightgray' class='alpha60'>" +
							"<td class = 'vertical-align-middle align-left' style='width:33%;color:#0071BC;'> <b><div id='divSelectedAnswer' class='divChooseAns'>" + divSelectedAnswer + " </div></b></td>" +
						"</tr>" +
					"</table>" +
					"<div id='divOptions'>" + opts + " </div>";
                }

                divTestQuestionView += "<table style='width:100%'>" +
						"<tr style= 'background-color:lightgray' class='alpha60'>" +
							"<td class = 'vertical-align-middle align-left' style='width:33%;color:#0071BC;'> <b><div class='divChooseAns'>Explanation: </div></b></td>" +
						"</tr>" +
						"</table><div id ='divExplanation' style='text-align:left' class='questionAnswerColor divQuestPart'>" + currentQuestion.explanation + "</div>";

                $('#questionText').html(divTestQuestionView);

                if (currentQuestion.uId == 29) { // correcting data issue
                    divTestQuestionView = divTestQuestionView.replace(/<img /, "<imgXX class='xxx' ");
                    divTestQuestionView = divTestQuestionView.replace(/<img [^>]*>/g, "");
                    divTestQuestionView = divTestQuestionView.replace(/<imgXX /, "<img ");
                }

                var wid
                if (currentQuestion.typeName == "B") {
                    wid = $('div').width() * 0.40;
                }
                else {
                    wid = $('div').width();
                }

                adjustImage(divTestQuestionView, '#questionText', 'Rev', wid);

                var ansParts = currentQuestion.correctAnswer.split(',');
                var btnI;
                var btnII;
                var btnCE;
                if (currentQuestion.typeName == "B") {
                    if (ansParts[0] == 'T') {
                        btnI = '#btnI' + ansParts[0];
                        $(btnI).removeClass("circle-button-gray");
                        $(btnI).addClass("circle-button-correct")
                    } else {
                        btnI = '#btnI' + ansParts[0];
                        $(btnI).removeClass("circle-button-gray");
                        $(btnI).addClass("circle-button-correct")
                    }
                    if (ansParts[1] == 'T') {
                        btnII = '#btnII' + ansParts[1];
                        $(btnII).removeClass("circle-button-gray");
                        $(btnII).addClass("circle-button-correct")
                    } else {
                        btnII = '#btnII' + ansParts[1];
                        $(btnII).removeClass("circle-button-gray");
                        $(btnII).addClass("circle-button-correct")
                    }
                    if (ansParts[2] == 'CE') {
                        btnCE = '#btnCE';
                        $(btnCE).removeClass("circle-button-gray");
                        $(btnCE).addClass("circle-button-correct")
                    } else {
                        btnCE = '#btnC';
                        $(btnCE).removeClass("circle-button-gray");
                        $(btnCE).addClass("circle-button-correct")
                    }
                } else {
                    var btn = '#btn' + currentQuestion.correctAnswer;
                    $(btn).removeClass("circle-button-gray");
                    $(btn).addClass("circle-button-correct")
                }
            }

        });
    });
    changeMobilePage('#pageReviewQuestion');
}
//End 

/* Coding part of quick nav help dialogs  */
function toggleScreenEffectForProgress(layer) {
    $(layer).css('display', $(layer).css('display') == 'none' ? 'block' : 'none');
}
// For Individual Progress
$("#quickNavForITProgress").live('tap', function(event, ui) {
    event.preventDefault();
    ShowDialogHelpITProgress(true);
});
$("#hideQuickNavITProgress").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavITProgress").toggle("fast");
    ShowDialogHelpITProgress(true);
});
function ShowDialogHelpITProgress(modal) { // to show toast/msgbox 
    $("#darkLayerMenuITProgress").show();
    $("#dialogITProgressHelp").fadeIn(300);

    if (modal) {
        $("#darkLayerMenuITProgress").unbind("click");
    } else {
        $("#darkLayerMenuITProgress").click(function(e) {
            HideDialogHelpITProgress();
        });
    }
}
function HideDialogHelpITProgress() { // to hide toast / msgbox
    $("#dialogITProgressHelp").fadeOut(300);
    $("#darkLayerMenuITProgress").hide();
}
$("#btnCloseITProgressHelp").live('tap', function(event, ui) {
    HideDialogHelpITProgress();
});
$("#darkLayerMenuITProgress").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavITProgress").hide();
    HideDialogHelpITProgress();
});
// End
// For TestListProgress
$("#quickNavForTestListProgress").live('tap', function(event, ui) {
    event.preventDefault();
    ShowDialogHelpTestListProgress(true);
});
$("#hideQuickNavTestListProgress").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavTestListProgress").toggle("fast");
    ShowDialogHelpTestListProgress(true);
});
function ShowDialogHelpTestListProgress(modal) { // to show toast/msgbox 
    $("#darkLayerMenuTestListProgress").show();
    $("#dialogTestListProgressHelp").fadeIn(300);

    if (modal) {
        $("#darkLayerMenuTestListProgress").unbind("click");
    } else {
        $("#darkLayerMenuTestListProgress").click(function(e) {
            HideDialogHelpTestListProgress();
        });
    }
}
function HideDialogHelpTestListProgress() { // to hide toast / msgbox
    $("#dialogTestListProgressHelp").fadeOut(300);
    $("#darkLayerMenuTestListProgress").hide();
}
$("#btnCloseTestListProgressHelp").live('tap', function(event, ui) {
    HideDialogHelpTestListProgress();
});
$("#darkLayerMenuTestListProgress").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavTestListProgress").hide();
    HideDialogHelpTestListProgress();
});
// End
// For CumulativeProgress
$("#quickNavForCumulativeProgress").live('tap', function(event, ui) {
   event.preventDefault();
    ShowDialogHelpCumulativeProgress(true);
});
$("#hideQuickNavCumulativeProgress").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavCumulativeProgress").toggle("fast");
    ShowDialogHelpCumulativeProgress(true);
});
function ShowDialogHelpCumulativeProgress(modal) { // to show toast/msgbox 
    $("#darkLayerMenuCumulativeProgress").show();
    $("#dialogCumulativeProgressHelp").fadeIn(300);

    if (modal) {
        $("#darkLayerMenuCumulativeProgress").unbind("click");
    } else {
        $("#darkLayerMenuCumulativeProgress").click(function(e) {
            HideDialogHelpCumulativeProgress();
        });
    }
}
function HideDialogHelpCumulativeProgress() { // to hide toast / msgbox
    $("#dialogCumulativeProgressHelp").fadeOut(300);
    $("#darkLayerMenuCumulativeProgress").hide();
}
$("#btnCloseCumulativeProgressHelp").live('tap', function(event, ui) {
    HideDialogHelpCumulativeProgress();
});
$("#darkLayerMenuCumulativeProgress").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavCumulativeProgress").hide();
    HideDialogHelpCumulativeProgress();
});
// End

// For PaperDetails
$("#quickNavForPaperDetails").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavPaperDetails").toggle("fast");
    toggleScreenEffectForProgress('#darkLayerMenuPaperDetails');
});
$("#hideQuickNavPaperDetails").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavPaperDetails").toggle("fast");
    ShowDialogHelpPaperDetails(true);
});
function ShowDialogHelpPaperDetails(modal) { // to show toast/msgbox 
    $("#darkLayerMenuPaperDetails").show();
    $("#dialogPaperDetailsHelp").fadeIn(300);

    if (modal) {
        $("#darkLayerMenuPaperDetails").unbind("click");
    } else {
        $("#darkLayerMenuPaperDetails").click(function(e) {
            HideDialogHelpPaperDetails();
        });
    }
}
function HideDialogHelpPaperDetails() { // to hide toast / msgbox
    $("#dialogPaperDetailsHelp").fadeOut(300);
    $("#darkLayerMenuPaperDetails").hide();
}
$("#btnClosePaperDetailsHelp").live('tap', function(event, ui) {
    HideDialogHelpPaperDetails();
});
$("#darkLayerMenuPaperDetails").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavPaperDetails").hide();
    HideDialogHelpPaperDetails();
});
// End
// For PaperSummary
$("#quickNavForPaperSummary").live('tap', function(event, ui) {
    event.preventDefault();
    ShowDialogHelpPaperSummary(true);
    toggleScreenEffectForProgress('#darkLayerMenuPaperSummary');
});
/*$("#hideQuickNavPaperSummary").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavPaperSummary").toggle("fast");
    ShowDialogHelpPaperSummary(true);
});*/
function ShowDialogHelpPaperSummary(modal) { // to show toast/msgbox 
    //$("#darkLayerMenuPaperSummary").show();
    $("#dialogPaperSummaryHelp").fadeIn(300);

    if (modal) {
        $("#darkLayerMenuPaperSummary").unbind("click");
    } else {
        $("#darkLayerMenuPaperSummary").click(function(e) {
            HideDialogHelpPaperSummary();
        });
    }
}
function HideDialogHelpPaperSummary() { // to hide toast / msgbox
    $("#dialogPaperSummaryHelp").fadeOut(300);
    $("#darkLayerMenuPaperSummary").hide();
}
$("#btnClosePaperSummaryHelp").live('tap', function(event, ui) {
    HideDialogHelpPaperSummary();
});
$("#darkLayerMenuPaperSummary").live('tap', function(event, ui) {
    event.preventDefault();
    HideDialogHelpPaperSummary();
});

// End 
// For ChangePassword
$("#quickNavForChangePassword").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavChangePassword").toggle("fast");
    toggleScreenEffectForProgress('#darkLayerMenuChangePassword');
});
$("#hideQuickNavChangePassword").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavChangePassword").toggle("fast");
    ShowDialogHelpChangePassword(true);
});
function ShowDialogHelpChangePassword(modal) { // to show toast/msgbox 
    $("#darkLayerMenuChangePassword").show();
    $("#dialogChangePasswordHelp").fadeIn(300);

    if (modal) {
        $("#darkLayerMenuChangePassword").unbind("click");
    } else {
        $("#darkLayerMenuChangePassword").click(function(e) {
            HideDialogHelpChangePassword();
        });
    }
}
function HideDialogHelpChangePassword() { // to hide toast / msgbox
    $("#dialogChangePasswordHelp").fadeOut(300);
    $("#darkLayerMenuChangePassword").hide();
}
$("#btnCloseChangePasswordHelp").live('tap', function(event, ui) {
    HideDialogHelpChangePassword();
});

$("#darkLayerMenuChangePassword").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavChangePassword").hide();
    HideDialogHelpChangePassword();
});
// End
// For AccountRegistered
$("#quickNavForAccountRegistered").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavAccountRegistered").toggle("fast");
    toggleScreenEffectForProgress('#darkLayerMenuAccountRegistered');
});
$("#hideQuickNavAccountRegistered").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavAccountRegistered").toggle("fast");
    ShowDialogHelpAccountRegistered(true);
});
function ShowDialogHelpAccountRegistered(modal) { // to show toast/msgbox 
    $("#darkLayerMenuAccountRegistered").show();
    $("#dialogAccountRegisteredHelp").fadeIn(300);

    if (modal) {
        $("#darkLayerMenuAccountRegistered").unbind("click");
    } else {
        $("#darkLayerMenuAccountRegistered").click(function(e) {
            HideDialogHelpAccountRegistered();
        });
    }
}
function HideDialogHelpAccountRegistered() { // to hide toast / msgbox
    $("#dialogAccountRegisteredHelp").fadeOut(300);
    $("#darkLayerMenuAccountRegistered").hide();
}
$("#btnCloseAccountRegisteredHelp").live('tap', function(event, ui) {
    HideDialogHelpAccountRegistered();
});
$("#darkLayerMenuAccountRegistered").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavAccountRegistered").hide();
    HideDialogHelpAccountRegistered();
});
// End 

// For Review Question
$("#quickNavForReviewQuestion").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavReviewQuestion").toggle("fast");
    toggleScreenEffectForProgress('#darkLayerMenuReviewQuestion');
});
$("#hideQuickNavReviewQuestion").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavReviewQuestion").toggle("fast");
});

function ShowDialogHelpReviewQuestion(modal) { // to show toast/msgbox
    $("#darkLayerMenuReviewQuestion").show();
    $("#dialogReviewQuestionHelp").fadeIn(300);

    if (modal) {
        $("#darkLayerMenuReviewQuestion").unbind("click");
    } else {
        $("#darkLayerMenuReviewQuestion").click(function(e) {
            HideDialogHelpReviewQuestion();
        });
    }
}

function HideDialogHelpReviewQuestion() { // to hide toast / msgbox
    $("#dialogReviewQuestionHelp").fadeOut(300);
    $("#darkLayerMenuReviewQuestion").hide();
}
$("#btnCloseReviewQuestionHelp").live('tap', function(event, ui) {
    event.preventDefault();
    HideDialogHelpReviewQuestion();
});
$("#darkLayerMenuReviewQuestion").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavReviewQuestion").hide();
    HideDialogHelpReviewQuestion();
});
$("#ReviewQuestionProgress").live('tap', function(event, ui) {
    event.preventDefault();
    $("#darkLayerMenuReviewQuestion").hide();
    changeMobilePage('#pageCumulativeProgress');
});
$("#ReviewQuestionHelp").live('tap', function(event, ui) {
    event.preventDefault();
    ShowDialogHelpReviewQuestion(true);
});
$('#divReviewNextQuestion, #divReviewPrevQuestion').live('tap', function(event, ui) {
    event.preventDefault();
    var selOpt = $(this).attr('id');

    if (selOpt == 'divReviewNextQuestion') {
        ReviewNextQuestion();
    }
    else if (selOpt == 'divReviewPrevQuestion') {
        ReviewPreviousQuestion();
    }
});
$("#spnReviewQuestionType").live('tap', function(event, ui) {
    event.preventDefault();
    showAppToast('showWarningToast', currentUidRef, 3000);
});

$('.scaledDnRev').live('tap', function(event, ui) {

    var imgData = $(this).attr('src');
    imgData = "<img class='fullImage' src='" + imgData + "' />";
    $("#theImageRev").html(imgData);
    $(this).css("border", "3px dotted blue");
    $(".fullImage").css("border", "3px dotted red");
    $(".fullImage").css("background-size", "contain");
	
	var availH = $(window).innerHeight();
	var oriH = $('#dialogForZoomedImageInRev').height();
	
	if(oriH > availH  || oriH==0) 
	{
		$(".fullImage").css("height",$(window).innerHeight() * 0.80 );
	}
	
    ShowZoomedImage(true, "dialogForZoomedImageInRev", "darkLayerForZoomedImageInRev");
    touchslider.createSlidePanel('#fullImageRev', 200, 15);

});

$('#btnCloseForZoomedImageInRev').live('tap', function(event, ui) {
    event.preventDefault();
    ShowZoomedImage(false, "dialogForZoomedImageInRev", "darkLayerForZoomedImageInRev");
});

$('#darkLayerForZoomedImageInRev').live('tap', function(event, ui) {
    event.preventDefault();
    ShowZoomedImage(false, "dialogForZoomedImageInRev", "darkLayerForZoomedImageInRev");
});
