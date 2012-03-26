//variables~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var currentQuestionNo;
var correctAns;
var stI , stII, ce;
var optI, optII, optCe;
var arrayTopicwiseQuest = new Array(1);
var randQuest;
var questVar;
var testName;	
var timerQuestion , timerExam;
var questionTimeInSec = 0*1;	
var examTimeInSec = 0*1;	
var remaining_time = 3600;
var completedTime = 0; 
var isNavigationTracked = false;
var qType='';
var colorClass;
var areOptionsHighlighted = false;
var tempTestUserId = 'aa';
var tempTestTestId = 'aa';
var temoTestPaperId = 'aa';
var currentTestId;

//Methods~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//method to display a question on test screen  
function generateQuestions(){
	currentQuestionNo = getCurrentQuestion();
	questionTimeInSec = 0;
	areOptionsHighlighted = false;
	//timerQuestion = 0;
	$('html, body').animate({scrollTop:0}, 'slow');
	currentQuestionNo = (currentQuestionNo == undefined) ?  1 :currentQuestionNo; 
	//verify if answer was given previously. if yes, than get its answer along with the time taken
	db.transaction(function (tx) {

	tx.executeSql('SELECT * FROM tbQuestionBank qb ,tbType tp, tbQuestionPaper qp WHERE qb.typeId = tp.typeId AND qb.uId = qp.uId AND qp.qno =?  AND qp.paperId=?', [currentQuestionNo,getSessionPaperId()], function(tx, result) { 
		 if(result.rows.length>0)
		 {
			var currentQuestion = result.rows.item(0); 
			setCurrentQuestionUid(currentQuestion.uId);
			var answer = currentQuestion.submittedAnswer;
			var correctAnswer = currentQuestion.correctAnswer;
			var time = currentQuestion.timeTaken;
			var divSelectedAnswer = "Choose answer: ";
			var htmlSource = "";
			var opts = ""
			var divTestQuestionView = "";
			var divSelectedAnswer = getSelectedAnswerText();
			
			setCurrentQuestionTimer(time);
			setSelectedAnswerValue(answer);
			setQuestionReferenceNo(currentQuestion.refNo + ", UID: " + currentQuestion.uId);
			if(answer == undefined){ answer =''; }
			
			window.localStorage.setItem("CurrentQuestionsAnswer", answer);
			if(answer!=''){ 
				divSelectedAnswer = "Choose answer: [ " + answer + " , " + time + " sec ]"; 
				setWasAnswerGiven(1);
			}
			else{
				divSelectedAnswer = "Choose answer: ";
				setWasAnswerGiven(0);
			}
			
			setSelectedAnswerText(divSelectedAnswer);
			
			$('#spnQuestionType').html( getSessionTestName()  + ' - Q' + currentQuestion.srNo);
 
			if(currentQuestion.typeName =="A") {
 				htmlSource += currentQuestion.question +"<br>" ;
				if ( currentQuestion.choiceA !=""){
					
					try{
						opts ="<table width='100%'  class='alpha60'  border ='0' cellspacing='0' cellpadding='0' > " +
							"<tr onclick='choiceA()'> <td id='tdA1' width='10%' valign='middle'> <center><div id = 'btnA'  class = 'circle-button' > A  </div> </center></td>" +
							"	 <td id='tdA2' align='left' width='90%' class='questionAnswerColor tdTextBorder'> " + 
							"		<div id='choiceAText'>"+currentQuestion.choiceA+"</div>	" + 				
							" </td>  </tr>" +
							"<tr style= 'background-color:lightgray' class='alpha60' onclick='choiceB()'>" +
							"	<td id='tdB1' width='10%' valign='middle'> <center> <div id = 'btnB' class = 'circle-button' > B  </div> </center></td>" +
							"	<td id='tdB2' align='left' width='90%' class='questionAnswerColor tdTextBorder'> "+
							"		<div id='choiceBText'>"+currentQuestion.choiceB+"</div>" + 
							"</td>" +
							"</tr> <tr onclick='choiceC()'>" +
							"	<td id='tdC1' width='10%' valign='middle'> <center> <div id = 'btnC' class = 'circle-button' > C  </div> </center></td>" +
							"	<td id='tdC2' align='left' width='90%' class='questionAnswerColor tdTextBorder'>"+
							"		<div id='choiceCText'>"+currentQuestion.choiceC+"</div>" + 
							"</td>" +
							"</tr> <tr style= 'background-color:lightgray'  class='alpha60' onclick='choiceD()'>" +
							"	<td id='tdD1' width='10%' valign='middle'> <center> <div id = 'btnD' class = 'circle-button' > D  </div> </center></td>" +
							"	<td id='tdD2' align='left' width='90%' class='questionAnswerColor tdTextBorder'> "+
							"		<div id='choiceDText'>"+currentQuestion.choiceD+"</div>" + 
							"</td>" +
							"</tr> <tr onclick='choiceE()'> " +
							"	<td id='tdE1' width='10%' valign='middle'> <center><div id = 'btnE' class = 'circle-button' > E  </div> </center></td>" +
							"	<td id='tdE2' align='left' width='90%' class='questionAnswerColor tdTextBorder'> "+
							"		<div id='choiceEText'>"+currentQuestion.choiceE+"</div>" + 
							"</td> " +
							"</tr> </table>   ";
						}
					catch (e){
						
					}
				}
				else{
					//htmlSource += "<img src=" + currentQuestion.letteredChoicesImage + ">";
					opts =  "<table width='100%'  class='alpha60'  border ='0' cellspacing='0' cellpadding='0'> " +
							"<tr> <td valign='middle'> <center> <div id = 'btnChA' class = 'circle-button' onclick='javascript:choiceA();'> A  </div> <div id='choiceAText'> </div></center> </td>" +
							"	  <td valign='middle'> <center> <div id = 'btnChB' class = 'circle-button' onclick='javascript:choiceB();'> B  </div> <div id='choiceBText'> </div></center> </td>" +
							"	  <td valign='middle'> <center> <div id = 'btnChC' class = 'circle-button' onclick='javascript:choiceC();'> C  </div> <div id='choiceCText'> </div></center> </td>" +
							"	  <td valign='middle'> <center> <div id = 'btnChD' class = 'circle-button' onclick='javascript:choiceD();'> D  </div> <div id='choiceDText'> </div></center> </td>" +
							"	  <td valign='middle'> <center> <div id = 'btnChE' class = 'circle-button' onclick='javascript:choiceE();'> E  </div> <div id='choiceEText'> </div></center> </td>" +
							"</tr> </table> <br> ";
				}			
				
				divTestQuestionView = "<table style='width:100%'>" +
						"<tr style= 'background-color:lightgray' class='alpha60'>" +
							"<td class = 'vertical-align-middle align-left' style='width:80%;color:#0071BC;'> <b><div id='divSelectedAnswer' class='divChooseAns'>" + divSelectedAnswer + " </div></b></td>" +
						"</tr>" +
						"</table>" +
						"<div id='divOptions' class='alpha60'>" +  opts + " </div> <br/>" +
						" <div id ='divQuestionPart' style='text-align:left' class='questionAnswerColor divQuestPart'>"+ htmlSource + "</div>";
						
			}
			else if(currentQuestion.typeName =="C") {
 				htmlSource +=   currentQuestion.question +"<br>" ;
				if ( currentQuestion.choiceA !=""){
					try{
						opts ="<table width='100%'  class='alpha60'  border ='0' cellspacing='0' cellpadding='0' > " +
							"<tr onclick='choiceA()'> <td id='tdA1' width='10%' valign='middle'> <center><div id = 'btnA'  class = 'circle-button' > A  </div> </center></td>" +
							"	 <td id='tdA2' align='left' width='90%' class='questionAnswerColor tdTextBorder'> " + 
							"		<div id='choiceAText'>"+currentQuestion.choiceA+"</div>"+
							"</td>  </tr>" +
							"<tr style= 'background-color:lightgray' class='alpha60' onclick='choiceB()'>" +
							"	<td id='tdB1' width='10%' valign='middle'> <center> <div id = 'btnB' class = 'circle-button' > B  </div> </center></td>" +
							"	<td id='tdB2' align='left' width='90%' class='questionAnswerColor tdTextBorder'> "+
							"		<div id='choiceBText'>"+currentQuestion.choiceB+"</div>"+	
							"</td>" +
							"</tr> <tr onclick='choiceC()'>" +
							"	<td id='tdC1' width='10%' valign='middle'> <center> <div id = 'btnC' class = 'circle-button' > C  </div> </center></td>" +
							"	<td id='tdC2' align='left' width='90%' class='questionAnswerColor tdTextBorder'>"+
							"		<div id='choiceCText'>"+currentQuestion.choiceC+"</div>"+	
							"</td>" +
							"</tr> <tr style= 'background-color:lightgray'  class='alpha60' onclick='choiceD()'>" +
							"	<td id='tdD1' width='10%' valign='middle'> <center> <div id = 'btnD' class = 'circle-button' > D  </div> </center></td>" +
							"	<td id='tdD2' align='left' width='90%' class='questionAnswerColor tdTextBorder'> "+
							"		<div id='choiceDText'>"+currentQuestion.choiceD+"</div>	"+
							"</td>" +
							"</tr> <tr onclick='choiceE()'> " +
							"	<td id='tdE1' width='10%' valign='middle'> <center><div id = 'btnE' class = 'circle-button' > E  </div> </center></td>" +
							"	<td id='tdE2' align='left' width='90%' class='questionAnswerColor tdTextBorder'> "+
							"		<div id='choiceEText'>"+currentQuestion.choiceE+"</div>	"+
							"</td> " +
							"</tr> </table>   ";
						}
					catch (e){
						
					}
				}
				else{
					opts =  "<table width='100%'  class='alpha60'  border ='0' cellspacing='0' cellpadding='0'> " +
							"<tr> <td valign='middle'> <center> <div id = 'btnChA' class = 'circle-button' onclick='javascript:choiceA();'> A </div> <div id='choiceAText'> </div> </center> </td>" +
							"	  <td valign='middle'> <center> <div id = 'btnChB' class = 'circle-button' onclick='javascript:choiceB();'> B  </div> <div id='choiceBText'> </div></center> </td>" +
							"	  <td valign='middle'> <center> <div id = 'btnChC' class = 'circle-button' onclick='javascript:choiceC();'> C  </div> <div id='choiceCText'> </div></center> </td>" +
							"	  <td valign='middle'> <center> <div id = 'btnChD' class = 'circle-button' onclick='javascript:choiceD();'> D  </div> <div id='choiceDText'> </div></center> </td>" +
							"	  <td valign='middle'> <center> <div id = 'btnChE' class = 'circle-button' onclick='javascript:choiceE();'> E  </div> <div id='choiceEText'> </div></center> </td>" +
							"</tr> </table> <br> ";
				}	
				
				divTestQuestionView = " <div id ='divQuestionPart' style='text-align:left' class='questionAnswerColor divQuestPart'>"+ htmlSource + "</div>" + 
					"<br>" +
					"<table style='width:100%'>" +
						"<tr style= 'background-color:lightgray' class='alpha60'>" +
							"<td class = 'vertical-align-middle align-left' style='width:80%;color:#0071BC;'> <b><div id='divSelectedAnswer' class='divChooseAns'>" + divSelectedAnswer + " </div></b></td>" +
						"</tr>" +
					"</table>" +
					"<div id='divOptions' class='alpha60'>" +  opts + " </div>";	
							
			}	
			else if(currentQuestion.typeName =="B") {		

				htmlSource += "<table width=100% cellspacing='0' cellpadding='0'>";
				htmlSource += "  <tr>";
				htmlSource += "	<th align=center width=47%>Statement I</th>";
				htmlSource += "	<td width=5%>&nbsp;</td>";
				htmlSource += "	<th align=center width=48%>Statement II</th>";
				htmlSource += "  </tr>";		
				htmlSource += "  <tr>";
				htmlSource += "	<td align=center style='border-style:groove;border:solid 1px;'>"+ currentQuestion.statementI +"</td>";
				htmlSource += "	<td style='color:#F00' align='center'>because</td>";
				htmlSource += "	<td align=center style='border-style:groove;border:solid 1px;'>"+ currentQuestion.statementII +"</td>";
				htmlSource += "  </tr>";	 
				htmlSource += "</table>";
				
				opts = "<table width='100%' border ='0' cellspacing='0' cellpadding='0'>"+
				"<tr class='alpha60'> <td align='center'> <div id = 'btnIT' class = 'circle-button'  onclick='javascript:choiceFirstTrue();'>T</div> </td>"+
				"<td align='center'>(I)</td><td align='center'><div id = 'btnIF' class = 'circle-button' onclick='javascript:choiceFirstFalse();'>F</div> </td> </tr>"+
				"<tr><th colspan='2'>&nbsp;</th></tr>" +
				"<tr class='alpha60'><td align='center'><div id = 'btnIIT' class = 'circle-button' onclick='javascript:choiceSecondTrue();'>T</div> </td>"+
				"<td align='center'>(II)</td><td align='center'><div id = 'btnIIF' class = 'circle-button' onclick='javascript:choiceSecondFalse();'> F  </div> </td> </tr>"+
				"<tr><th colspan='2'>&nbsp;</th></tr>" +
				"<tr class='alpha60'><td align='center'><div id = 'btnCE' class = 'circle-button' onclick='javascript:correctExplanation();'>CE</div> </td> "+
				"<td align='center'>CE</td><td align='center'><div id = 'btnNA' class = 'circle-button' onclick='javascript:noExplanation();'>  &nbsp;&nbsp;&nbsp;&nbsp;  </div> </td>  </tr><tr><th colspan='2'>&nbsp;</th></tr> </table>";
				
				divTestQuestionView = " <div id ='divQuestionPart' style='text-align:left' class='questionAnswerColor'>"+ htmlSource + "</div>" + 
					"<br>" +
					"<table style='width:100%;'>" +
						"<tr style= 'background-color:lightgray' class='alpha60'>" +
							"<td class = 'vertical-align-middle align-left' style='width:80%;color:#0071BC;'> <b><div id='divSelectedAnswer' class='divChooseAns'>" + divSelectedAnswer + " </div></b></td>" +
						"</tr>" +
					"</table>" +
					"<div id='divOptions'>" +  opts + " </div>";
			}
			
			qType = currentQuestion.typeName;
			correctAns = currentQuestion.correctAnswer;
			stI = stII = ce = '';
			
			performQuestionTimer(time);	
			
			$('#divTestQuestionView').html(divTestQuestionView);			
			
			/*------
			zooming image
			*/////
			if (currentQuestion.uId == 29) { // correcting data issue
				divTestQuestionView = divTestQuestionView.replace(/<img /,"<imgXX class='xxx' ");
				divTestQuestionView = divTestQuestionView.replace(/<img [^>]*>/g,"");
				divTestQuestionView = divTestQuestionView.replace(/<imgXX /,"<img ");			
			}
			
			var wid
			if(currentQuestion.typeName =="B") {
				wid = $('div').width() * 0.40;
			}
			else
			{
				wid = $('div').width();
			}
			
			adjustImage(divTestQuestionView,'#divTestQuestionView', 'Test', wid);
			
			if(answer!=''){ 
				if(currentQuestion.typeName =="B"){
					highlightSubmitted(2,answer);
				}
				else
				{
					if(currentQuestion.choiceA !=""){
						highlightSubmitted(0,answer);
					}
					else
					{
						highlightSubmitted(1,answer);
					}
				}
			}
		 }
					
		}); 
	}); 
}

//method to generate Questions in grid format on Select Question Page
function generateQuestionIcons(){
	var code ="<div align=center> <table width='98%'>";
	 
	$('html, body').animate({scrollTop:0}, 'slow');
	$("#qlTestName").html(getSessionTestName() + " - ");
	
	showElement('#imgThumbnailView2');
	hideElement('#imgThumbnailView');
	
	db.transaction(function (tx) { 

		tx.executeSql('SELECT * FROM tbQuestionBank qb ,tbType tp, tbQuestionPaper qp WHERE qb.typeId = tp.typeId AND qb.uId = qp.uId AND qp.paperId=? order by tp.typeName , qp.qno asc', [getSessionPaperId()], function(tx, result) {

			var type='';
			var j = -1;
			for(i=0;i<result.rows.length; i++){
				if(j==4){
					code += "</tr><tr>";
					j=0;
				}else{
					j++;
				}
			
				var question = result.rows.item(i);
				if (question != null){
					
					colorClass = getColorClass(question.answerStatus, question.submittedAnswer);
					
					if(type != question.typeName){
						if(j>0){
							code +='</tr>';
							j=0;
						}
						
						type = question.typeName;
						code +='<tr bgcolor=lightgray><td colspan="5" align=center><h3>Type - ' + question.typeName + '</h3></td></tr>';
						code += "<tr><td class='buttons "+ colorClass +" '><div id=" + question.uId + " onClick='showQuestion("+ question.qno +")'>" + question.srNo +"</div></td>";
					}else{
						code += "<td class='buttons "+ colorClass +" '><div id=" + question.uId + " onClick='showQuestion("+ question.qno +")'>" + question.srNo +"</div></td>";
					}
				}else{
					code += "<td>&nbsp;</td>";
				}
			}
			code+= "</tr></table></div>"
			$("#tableQuestions").html(code);
		});
	});
}

//method for generating questions in list view format on Select Question page
function generateQuestionIconsList(){
	var code ="<div class='scrollEffect'><table width='100%'>";
	
    $('html, body').animate({scrollTop:0}, 'slow');
	showElement('#imgThumbnailView');
	hideElement('#imgThumbnailView2');
	$("#qlTestName").html(getSessionTestName() + " - ");

	db.transaction(function (tx) { 
		tx.executeSql('SELECT * FROM tbQuestionBank qb ,tbType tp, tbQuestionPaper qp WHERE qb.typeId = tp.typeId AND qb.uId = qp.uId AND qp.paperId=? order by tp.typeName , qp.qno asc', [getSessionPaperId()], function(tx, result) {

		var type='';
		for(i=0;i<result.rows.length; i++){
			var question = result.rows.item(i);
			
			colorClass = getColorClass(question.answerStatus, question.submittedAnswer);
			
			if(type != question.typeName){
				type = question.typeName;
				code +='<tr><td colspan="5">Type - ' + question.typeName + '</td></tr>';
			}
			
			if (question != null){
				
				code += "<tr><td style='width:5%'><div id=" + question.uId + " class='buttons " + colorClass +"' onclick='showQuestion("+question.qno+")'>" + question.srNo +"</div></td>";
				if(question.typeName =="B"){	
					code += "<td align=left class='tdTextBorder questionAnswerColor'>" + question.statementI + "</td>";
				}
				else{
					code += "<td align=left class='tdTextBorder questionAnswerColor'>" + question.question + "</td>";
				}
				var ans = question.submittedAnswer;
				if(ans == ''){
					code += "<td style='width:4%' class='tdTextBorder'><div>-</div></td></tr>";
				}
				else
				{
					code += "<td style='width:8%' class='tdTextBorder'><div>[" + question.submittedAnswer +"]</div></td></tr>";
				}
			}else{
			}
			if (question.uId == 29) { // correcting data issue
				code = code.replace(/<img /,"<imgXX class='xxx' ");
				code = code.replace(/<img [^>]*>/g,"");
				code = code.replace(/<imgXX /,"<img ");			
			}
		}
		code+= "</table></div>"
		
		$("#tableQuestions").html(code);
		
		var wid = $('div').width() * 0.40;
		adjustImage(code,'#tableQuestions','SelQues', wid);
		});
	});
}

//method to get color that is to be assigned to a button in Select question page, which represents whether a question is Skipped or attempted or un attempted
function getColorClass(answerStatus, submittedAnswer)
{
	colorClass = 'unansweredColor';
	if (answerStatus == 'N'){ // Not attempted
		colorClass = 'unansweredColor';				
	}else if (answerStatus == 'C'){ //  Correct Ans
		colorClass = 'answeredColor';
	}else if (answerStatus == 'W'){ //  Wrong Ans 
		colorClass = 'answeredColor';
	}else if (answerStatus == 'S'){ //  Skipped Ques 
		colorClass = 'skippedColor';
	}else if (answerStatus == 'P'){ //  Paused Ques
		var ans = submittedAnswer;
		if(ans == ''){
			colorClass = 'skippedColor';
		}
		else
		{
			colorClass = 'answeredColor';
		}
	}
	return colorClass;
}

//method called from select question page to dispaly a question
function showQuestion(questionNo){
	setCurrentQuestion(questionNo);
	changeMobilePage('#pageQuestionTest');
}

//method used to save a answer selected by user for type A and type C questions
function setCorrectAnswer(ans,direction){
	var ansStatus = (ans == correctAns) ?'C':'W';
	saveAnswer(ansStatus,ans,direction);
}

//method used to save a answer selected by user for type B questions
function setCorrectAnswerTypeB(ans,direction){
	var selOpts = ans;
	var ansStatus = (ans == correctAns.replace('',',')) ?'C':'W';
	saveAnswer(ansStatus,ans,direction);
}

//method used to save a answer selected by user
function saveAnswer(ansStatus,ans,direction){
	
	var solvedQuest;
	if(getWasAnswerGiven() == 0) {
		solvedQuest = parseInt(getSolvedQuestions());
		solvedQuest++;
		setSolvedQuestions(solvedQuest);
	}

	db.transaction(function (tx) {			
		tx.executeSql("UPDATE tbQuestionPaper SET  answerStatus = ?, timeTaken=?, submittedAnswer =? WHERE  paperId=? AND qno=?",[ansStatus,questionTimeInSec,ans,getSessionPaperId(),currentQuestionNo]);			
		navigate(direction);
	});
}

//method to set answer locally for Type B questions
function setCorrectAnswerForB( ){
	var ans = stI + "," +stII + "," + ce;
	s1 = (stI =='') ? '?': stI;
	s2 = (stII =='') ? '?': stII;
	s3 = (ce =='') ? '?': ce;
	var answer = "Choose answer: " + s1 + "," + s2 + "," + s3;
	$("#divSelectedAnswer").html(answer);
	if(stI !='' && stII!='' && ce!=''){
		setSelectedAnswerValue(ans); 
	}
}

//method called from My test page based on the Test selected by user. it either selects a paper if already created or else creates a paper for a particular user and than navigates to Test page.
function setTestAndNavigate(testId){	

	currentTestId = testId;
	var paperId = $("#p" + testId).html();
	var user = getUserId();
	
	if(tempTestUserId!=user && tempTestTestId!=testId && temoTestPaperId!=paperId)
	{
		tempTestUserId = user;
		tempTestTestId = testId;
		temoTestPaperId = paperId;
		
		var cntPT=0, cntPS =0, cntPF=0;
		testName = $("#t" + testId).html();
		db.transaction(function (tx) {
			
			tx.executeSql('SELECT timeLimit from tbTest WHERE testId  = ?' , [testId], function(tx, result) { 
			 var timeLimit = result.rows.item(0); 
			   setActualTime(timeLimit.timeLimit);
			});
			
			if(paperId == 'newTest') {
				var dateTime = getDateTime();	
				//var paperId  = user + "" + testId + "" + dateTime;
				  
					var tempPaperid = newPaperId(user,testId);
					tx.executeSql('INSERT INTO tbPaper (paperId,testId, complexId, paperStartDateTime, finishTime, mode, paperStatus, pauseTime, pausedOn, solvedQuestions, completedPercentage,userId,score) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',[tempPaperid,testId , 1, dateTime, 0, 'N', 'S', 0, 0, 0, 0,user,0], 
					function (tx,result) {
						var qnoA=0;
						var qnoB=100;
						var qnoC=0;
						var questionNo=0;
						var qno = 0;				
						var qA = 0,qB = 0, qC = 0;
						
						setSessionPaperId(tempPaperid);
	
						tx.executeSql('SELECT tp.typeName ,count(tp.typeName) As TotalRecords FROM tbQuestionBank qb INNER JOIN tbType tp ON qb.typeId= tp.typeId JOIN tbTestQuestions tq ON qb.uId=tq.uId Where tq.testId=? group by tp.typeName',[testId],
						function(tx,result){
							var totalA =0 , totalB =0, totalC=0;
							for(var j=0; j < result.rows.length; j++){
								var typeCount = result.rows.item(j);
								if(typeCount.typeName == 'A'){
									totalA = typeCount.TotalRecords*1
								}
								if(typeCount.typeName == 'B'){
									totalB = typeCount.TotalRecords*1
								}
								if(typeCount.typeName == 'C'){
									totalC = typeCount.TotalRecords*1
								}
							}
							
							qnoC = totalA ; //23
							qA = 0;
							qB = qA + totalA; //0 + 23 = 23
							qC = qB + totalB; //23 + 16 = 39
								
							tx.executeSql('SELECT qb.uId , tp.typeName FROM tbQuestionBank qb INNER JOIN tbType tp ON qb.typeId= tp.typeId JOIN tbTestQuestions tq ON qb.uId=tq.uId Where tq.testId=? order by qb.uId, tp.typeName asc', [testId], 
							function(tx, result) {
								for(var i=0; i<result.rows.length; i++) {
									var question = result.rows.item(i);
									cntPT++;												
									
									if(question.typeName == 'A'){
										questionNo = ++qnoA; 
										qno = ++qA;
									}
									if(question.typeName == 'B'){					
										questionNo = ++qnoB; 
										qno = ++qB;
									}
									if(question.typeName == 'C'){
										questionNo = ++qnoC; 
										qno = ++qC;
									}
	
									tx.executeSql("INSERT INTO tbQuestionPaper (uId, srNo, qno , paperId , answerStatus, timeTaken, submittedAnswer) VALUES(?,?,?,?,?,?,?)", [question.uId, questionNo,qno, tempPaperid , 'N', 0, ''],
									function (tx,result){
										//Success
										cntPS++
										if ( cntPT == (cntPS + cntPF)){
											setSolvedQuestions(0);
											setTempPaperStatus('S');
											setPaperMode('N');
											setPausedQuestionNo(0);
											setSessionTestName(testName);
											startExam('#pageQuestionTest',testId);		
										}
									}
									,function(e){
										//Error
										cntPF++
									});
								}	
							});
						});									
					});
			}
			else
			{ 
					tx.executeSql('SELECT solvedQuestions, mode, paperStatus, pausedOn, pauseTime FROM tbPaper WHERE paperId=?', [paperId], function(tx, result) {
						var paper = result.rows.item(0);
						setSolvedQuestions(paper.solvedQuestions);
						setPaperMode(paper.mode);
						setTempPaperStatus(paper.paperStatus);
						setPausedQuestionNo(paper.pausedOn);
						setRemainingTime(paper.pauseTime);
					});
				
				var paperStatus = getTempPaperStatus();
				
				if ( paperStatus == 'C')
				{
					showAppToast('showWarningToast', 'This test is already Submitted', 3000);
				}
				else
				{
					setSessionTestName(testName);
					setSessionPaperId(paperId);		
					
					startExam('#pageQuestionTest',testId);
				}	
			}
		});
	}
}

//method to find and set total questions in a test/paper
function setPapersTotalQuestions(paperId){
	db.transaction(function (tx) {
		tx.executeSql('SELECT COUNT(*) AS cnt FROM tbQuestionBank qb ,tbType tp, tbQuestionPaper qp WHERE qb.typeId = tp.typeId AND qb.uId = qp.uId AND  qp.paperId=?  order by tp.typeName asc', [paperId], function(tx, result) {
	  
			var length = result.rows.item(0).cnt;
			setTotalQuestions(length);
		});
	});
}

//method called when a test gets started
function startExam(page,testId){
	db.transaction(function (tx) {

		setPapersTotalQuestions(getSessionPaperId());
		
		var paperStatus = getTempPaperStatus();
		if(paperStatus == 'P'){
			
			tx.executeSql("UPDATE tbPaper SET  paperStatus='S' WHERE paperId=?",[getSessionPaperId()]);
			setCurrentQuestion(getPausedQuestionNo());
		}
		else
		{
			setRemainingTime(getActualTime());   
			tx.executeSql("UPDATE tbPaper SET  maxMarks=?, obtainedMarks=?, finishTime=?, mode=?, paperStatus=?, pauseTime=? WHERE paperId=?" , [200,0,0,'race','S',0,getSessionPaperId()]);
			setCurrentQuestion(1);
		}
		
		changeMobilePage(page);
		
	 	var paperStatus = getTempPaperStatus();
		remaining_time =  getRemainingTime();
		
		if(paperStatus == 'P'){
			completedTime = ((getActualTime()) - remaining_time); 
		}
		else
		{
			completedTime = 0;
		}
		
		var mode = getPaperMode();
		if(mode != 'P')
		{
			doCountdown(remaining_time);
		}
		calculateCompletingTime(completedTime);	
		
	});
	
	tempTestUserId = 'aa';
	tempTestTestId = 'aa';
	temoTestPaperId = 'aa';
}

//method called when a test is paused
function pauseExam(page){
		setTimerState("stopped");
		isNavigationTracked = true;
		var solved = getSolvedQuestions();
		var total = getTotalQuestions();
		var completedPercentage = parseInt(((solved/total) *100));
		
		db.transaction(function (tx) {
 
			tx.executeSql('UPDATE tbQuestionPaper SET answerStatus = ?, timeTaken=? WHERE paperId=? AND qno=?',['P',questionTimeInSec,getSessionPaperId(),currentQuestionNo] ); 
			
			var mode = getPaperMode();
			var pauseTime;
			if(mode == 'P'){
				pauseTime = 0;
			}
			else
			{
				pauseTime = getRemainingTime();
			}
			tx.executeSql('UPDATE tbPaper SET finishTime=?, paperStatus=?, pauseTime=?, pausedOn=?, solvedQuestions=?, completedPercentage=? WHERE paperId=?',[0,'P',pauseTime,getCurrentQuestion(),parseInt(solved),completedPercentage,getSessionPaperId()]);
			
			changeMobilePage('#' + page);			
		});
}

//method called a test is submited/stopped
function stopExam(){
		setTimerState("stopped");
		isNavigationTracked = true;
		var solved = getSolvedQuestions();
		var total = getTotalQuestions();
		var endDateTime = getDateTime();
		var completedPercentage = parseInt(((solved/total) *100));
		
		db.transaction(function (tx) { 
			var ans = getSelectedAnswerValue();
	
			if(ans == "" || ans == undefined){
				tx.executeSql('UPDATE tbQuestionPaper SET answerStatus = ?, timeTaken=? WHERE paperId=? AND qno=?',['S',questionTimeInSec,getSessionPaperId(),currentQuestionNo] ); 
			}
			
			tx.executeSql('UPDATE tbPaper SET paperEndDateTime=?, finishTime=?, paperStatus=?, pauseTime=?, pausedOn=?, solvedQuestions=?, completedPercentage=? WHERE paperId=?',[endDateTime,completedTime,'C',0,getCurrentQuestion(),parseInt(solved),completedPercentage,getSessionPaperId()] );

			$("#btnPaperDetails").show();
			showPaperSummary(getSessionPaperId());
		});		
}

//method called when choice A is selected for either type A or type C questions
function choiceA(){
	setOriginClassToBtnTests();
	if (getSelectedAnswerValue() == 'A')
	{
		setSelectedAnswerValue('');
	}
	else
	{
		changeBtnColor("#btnA", "#tdA1", "#tdA2");
		setSelectedAnswerValue('A'); 
	}	
}

//method called when choice B is selected for either type A or type C questions
function choiceB(){
	setOriginClassToBtnTests();
	if (getSelectedAnswerValue() == 'B')
	{
		setSelectedAnswerValue('');
	}
	else
	{
		changeBtnColor("#btnB", "#tdB1", "#tdB2");
		setSelectedAnswerValue('B'); 
	}
}

//method called when choice C is selected for either type A or type C questions
function choiceC(){
	setOriginClassToBtnTests();
	if (getSelectedAnswerValue() == 'C')
	{
		setSelectedAnswerValue('');
	}
	else
	{
		changeBtnColor("#btnC", "#tdC1", "#tdC2");
		setSelectedAnswerValue('C'); 	
	}
}

//method called when choice D is selected for either type A or type C questions
function choiceD(){
	setOriginClassToBtnTests();
	if (getSelectedAnswerValue() == 'D')
	{
		setSelectedAnswerValue('');
	}
	else
	{
		changeBtnColor("#btnD", "#tdD1", "#tdD2");
		setSelectedAnswerValue('D'); 
	}
}

//method called when choice E is selected for either type A or type C questions
function choiceE(){
	setOriginClassToBtnTests();
	if (getSelectedAnswerValue() == 'E')
	{
		setSelectedAnswerValue('');
	}
	else
	{
		changeBtnColor("#btnE", "#tdE1", "#tdE2");
		setSelectedAnswerValue('E'); 
	}
}

//method called when T is selected for first statement of type B questions
function choiceFirstTrue(){
	stI='T';
	changeBtnColorForTypeB('#btnIF','#btnIT');
  	setCorrectAnswerForB();	 
}

//method called when F is selected for first statement of type B questions
function choiceFirstFalse(){
	 stI = 'F';
	changeBtnColorForTypeB('#btnIT','#btnIF');
	setCorrectAnswerForB();	 
}

//method called when correct expalination is selected for type B questions
function correctExplanation(){
	ce ='CE';
	changeBtnColorForTypeB('#btnNA','#btnCE');
	setCorrectAnswerForB();	 
}

//method called when option stating second statement is not an correct explaination for first statement is selected of type B questions
function noExplanation(){
	ce ='NA';
	changeBtnColorForTypeB('#btnCE','#btnNA');
	setCorrectAnswerForB();
}

//method called when T is selected for second statement of type B questions
function choiceSecondTrue(){
	stII ='T';
	changeBtnColorForTypeB('#btnIIF','#btnIIT');
	setCorrectAnswerForB();
}

//method called when F is selected for second statement of type B questions
function choiceSecondFalse(){
	stII = 'F';
	changeBtnColorForTypeB('#btnIIT','#btnIIF');
	setCorrectAnswerForB();
}

//method called to show previous question in a test
function previousQuestion(){
	if(currentQuestionNo != 1)
	{	currentQuestionNo--; 
		setCurrentQuestion(currentQuestionNo);
		generateQuestions();
	}
	else
	{
		showAppToast('showWarningToast', 'First Question', 1000);
	}
}

//method called to show next question in a test
function nextQuestion(){
	if(currentQuestionNo !=getTotalQuestions())
	{	currentQuestionNo++;
		setCurrentQuestion(currentQuestionNo);
		generateQuestions();
	}
	else
	{
		showAppToast('showWarningToast', 'Last Question', 1000);
	}
}

//method used to start test completion timer
function calculateCompletingTime(duration)
{
	var t=setTimeout("updateCompletionTimer("+duration+")", 1000);
	return false;
}

//method that calculates test timer value every second
function updateCompletionTimer(value)
{
	if(getTimerState()=="running")
	{
		var newValue = value + 1;
		completedTime = newValue;
		var t=setTimeout("updateCompletionTimer("+newValue+")", 1000);
	}
}

//method used to calculate remaining time for a test
function doCountdown(duration) {

	start_num = duration;
	
	setTimerState("running");
	var countdown_output = document.getElementById('countdown_div');

	 if (start_num > 0) {	
		countdown_output.innerHTML = formatAsTime(start_num);
		var t=setTimeout("update_clock(\"countdown_div\", "+start_num+")", 1000);
	}
	return false;
}

//methid to update remainning times value	 
function update_clock(countdown_div, new_value) {
	var countdown_output = document.getElementById(countdown_div);
	
	var new_value;
	if(getTimerState()=="running")
	{
		new_value = new_value - 1;
		remaining_time = new_value;
		setRemainingTime(remaining_time);

		if (new_value > 0) {
			new_formatted_value = formatAsTime(new_value);
			countdown_output.innerHTML = new_formatted_value;
	
			var t=setTimeout("update_clock(\"countdown_div\", "+new_value+")", 1000);
			
		} else {
			countdown_output.innerHTML = "";
			$('#countdown_box').hide();
			 
			 ShowDialogTest(true,'dialogTest');	
		}
	}
}

//method used to get formated value of remaining time to be displayed in test
function formatAsTime(seconds) {
	 
	var hours = parseInt(seconds / (60*60));
	var minutes = parseInt((seconds % (60*60))/60);
	var seconds = parseInt(seconds -((hours*60*60)+(minutes*60)));
	
	if (hours < 10) {
		hours = "0"+hours;
	}
	
	if (minutes < 10) {
		minutes = "0"+minutes;
	}

	if (seconds < 10) {
		seconds = "0"+seconds;
	}

	var return_var = hours+':'+minutes+':'+seconds;

	return return_var;
}

//method used to get formated value of test timing to be displayed in My tests page 
function formatTimeDisplay(seconds) {
	 
	var hours = parseInt(seconds / (60*60));
	var minutes = parseInt((seconds % (60*60))/60);
	var seconds = parseInt(seconds -((hours*60*60)+(minutes*60)));
	
	if (hours < 10) {
		hours = "0"+hours;
	}
	
	if (minutes < 10) {
		minutes = "0"+minutes;
	}

	if (seconds < 10) {
		seconds = "0"+seconds;
	}

	var return_var = hours+':'+minutes+' hr';

	return return_var;
}
  
//method used to show list of available test for a user in My test page
function showMyTests(){
	db.transaction(function (tx) {
		$('#divMyTestList').html('<hr class=hrStyle>');
		
		var userId = getUserId();
	
		tx.executeSql("SELECT test.* FROM tbTest AS test,tbUserTests AS userTests WHERE test.testId= userTests.testId And (test.isTrackable =? AND test.testId=?) OR (test.testId=userTests.testId AND userTests.userId=?) order by test.testId asc", [1,1,userId], function(tx, ques1) { 		
			for(var i=0; i < ques1.rows.length; i++ ){
				var test = ques1.rows.item(i);
				if(test.testName != 'QoD'){
					showTests(test, userId);	
				}
			}
		});
	});
}

//method used to get the list of test for a user 
function showTests(test, userId){		
	db.transaction(function (tx) {
		var htmlCode='';
		
		tx.executeSql("SELECT * FROM tbPaper WHERE testId = ? AND userId = ?", [test.testId, userId], function(tx, ques2) { 
			if (ques2.rows.length >0) {					
			
				var paper = ques2.rows.item(0); 
				var solvedQuestions = paper.solvedQuestions;
				setPapersTotalQuestions(paper.paperId);
				
				var completedPercentage = paper.completedPercentage * 1;
				
				htmlCode += "<div id='ps" + test.testId + "' style='display:none;'>" + paper.paperId + "</div>";
				
				if( paper.paperStatus == 'C')
				{
					htmlCode += "<div align=center class=statusBox onclick='callPaperSummaryPage("+ test.testId + ",0)'>";
					htmlCode += "<table width=100%><tr><td width=15% align=center rowspan=2><div class=imgGear >&nbsp;</div></td>";
					htmlCode += "<td><div> " +
											"<table width=100%><tr>";
				}
				else
				{
					htmlCode += "<div align=center class=statusBox>";
					htmlCode += "<table width=100%><tr><td width=15% align=center rowspan=2 onclick='callPaperSummaryPage("+ test.testId + ",1)'><div class=imgGear>&nbsp;</div></td>";
					
					htmlCode += "<td><div onclick='setTestAndNavigate("+ test.testId + ")'> " +
											"<table width=100%><tr>";
				}

				var totalQuestion = getTotalQuestions();
				if(totalQuestion == 0 || totalQuestion == undefined || totalQuestion == null)
				{
					totalQuestion = 85;
				}
				if( paper.paperStatus == 'C')
				{

					if( paper.mode == 'P')
					{
						var questionsLeft = totalQuestion-solvedQuestions;
						
						htmlCode += "<td>"+test.testName +"</td><td align=right>" + questionsLeft + " (" + formatTimeDisplay(paper.finishTime*1) + ")</td></tr>";
						
						htmlCode += "<tr><td colspan=2><div class='meter-wrap tapTest'>" +
								"<div id='callProgressScreen1' class='meter-value' style='width:100%;'>" +
									 
								"</div>" +
								"</div></td></tr></table></div></td><td rowspan=2 width=5%></td></tr></table></div>";
					}
					else
					{
						htmlCode += "<td>"+test.testName +"</td><td align=right>SCORE: " + paper.score + " (" + formatTimeDisplay(paper.finishTime*1) + ")</td></tr>";
						
						htmlCode += "<tr><td colspan=2><div class='meter-wrap tapTest'>" +
								"<div id='callProgressScreen2' class='meter-value' style='width:100%;'>" +
									
								"</div>" +
								"</div></td></tr></table></div></td><td rowspan=2 width=5%></td></tr></table></div>";
					}
				}
							
				else if(completedPercentage == 0 && paper.paperStatus != 'P')
				{
					var formatedTime = formatTimeDisplay(test.timeLimit*1);									
							
					htmlCode += "<td>"+test.testName +"</td><td align=right>85 (" + formatedTime + ")</td></tr>"; 
					

					htmlCode += "<tr><td colspan=2><div id='p" + test.testId + "' style='display:none;'>" + paper.paperId + "</div><div id='t" + test.testId + "' style='display:none;'>" + test.testName + "</div><div class='meter-wrap'>" +
								"<div class='meter-value' style='width:0%;'>" +
									 
								" </div>" +
								"</div></td></tr></table></div></td><td rowspan=2 width=5%></td></tr></table></div>";

				}
				else
				{
					var questionsLeft = totalQuestion-solvedQuestions;
					
					htmlCode += "<td>"+test.testName +"</td><td align=right>" + questionsLeft + " (" + formatTimeDisplay(paper.pauseTime*1) + ")</td></tr>";
				
					htmlCode += "<tr><td colspan=2><div id='p" + test.testId + "' style='display:none;'>" + paper.paperId + "</div><div id='t" + test.testId + "' style='display:none;'>" + test.testName + "</div><div class='meter-wrap'>" +
								"<div class='meter-value' style='width:" + completedPercentage +"%;'>" +
									 
								" </div>" +
								"</div></td></tr></table></div></td><td rowspan=2 width=5%></td></tr></table></div>";
								
				}

			}
			else
			{
				htmlCode += "<div align=center class=statusBox onclick='setTestAndNavigate("+ test.testId + ")'> <table width=100%><tr><td width=15% align=center rowspan=2><div class=imgGear>&nbsp;</div></td>";
				htmlCode += "<td><div onclick='setTestAndNavigate("+ test.testId + ")'> " +
											"<table width=100%><tr>";
					var paperId = "newTest";
					var formatedTime = formatTimeDisplay(test.timeLimit*1);
					htmlCode += "<td>"+ test.testName +"</td><td align=right>85 (" + formatedTime + ")</td></tr>"; 
					
					htmlCode += "<tr><td colspan=2><div id='p" + test.testId + "' style='display:none;'>" + paperId + "</div><div id='t" + test.testId + "' style='display:none;'>" + test.testName + "</div><div class='meter-wrap'>" +
								"<div class='meter-value' style='width:0%;'>" +
									 
								" </div>" +
								"</div></td></tr></table></div></td><td rowspan=2 width=5%></td></tr></table></div>";
				
			}
			
			htmlCode += "<hr class=hrStyle>";
			
			$('#divMyTestList').append(htmlCode);

		});
	});		 
}

//method to call the showPaperSummary function from My Test screen. here, if caller=0 means the complete Progress view is to be shown. else if caller=1 means partial progress view is to be shown.
function callPaperSummaryPage(testId,caller)
{
	var paperId = $("#ps" + testId).html();
	if (caller==1)
	{
		$("#btnPaperDetails").hide();
	}
	else
	{
		$("#btnPaperDetails").show();
	}
	showPaperSummary(paperId);
}

//method used to calculate the question time (time a user views a question)
function performQuestionTimer(time) {
	questionTimeInSec = 0;
	timerQuestion = null;
	questionTimeInSec = time;
	timerQuestion = $.timer(function() {
			questionTimeInSec++; 
	});
	
	timerQuestion.set({ time : 1000, autostart : true });
}

//method used to toggle the display of menu
function toggleMenuDisplay(modal,layerId)
{
	if (modal)
	{
		$("#" + layerId).show();
	}
	else
	{
		$("#" + layerId).hide();
	}
}
	
//methiod used to show help dailog
function ShowDialogHelp(modal,helpDailog,layerId)
{
	if (modal)
	{
		$("#" + helpDailog).fadeIn(300);
	}
	else
	{
		
		toggleMenuDisplay(false,layerId);
		$("#" + helpDailog).fadeOut(300);
	}
}

//method to toggle the Test dailog(dailog that appears after test time elapses) 
function ShowDialogTest(modal)
{
	if (modal)
	{
		$("#darkLayerForZoomedImageInTest").show();
		$("#dialogTest").fadeIn(300); //dialogTest
	}
	else
	{
		$("#darkLayerForZoomedImageInTest").hide();
		$("#dialogTest").fadeOut(300);
	}
}

//method to handle if a question is skipped or submitted
function skipOrSubmit(direction)
{
	
	var ans = getSelectedAnswerValue();
	
	if(ans == "" || ans == undefined)
	{
		db.transaction(function (tx) {
	
			tx.executeSql("UPDATE tbQuestionPaper SET timeTaken=?, answerStatus = 'S' WHERE  paperId=? AND qno=?" , [questionTimeInSec,getSessionPaperId(),currentQuestionNo] );	
			
			if(currentQuestionNo == 1  && direction == 'P')
			{	
				showAppToast('showWarningToast', 'First Question', 1000);
			}
			else if(currentQuestionNo ==getTotalQuestions() && direction == 'N')
			{
				showAppToast('showWarningToast', 'Last Question', 1000);
			}
			else if(direction == '')
			{	
				showAppToast('showWarningToast', 'Skipping Question', 1000);
			}
			else
			{
				navigate(direction);
				showAppToast('showWarningToast', 'Skipping Question', 1000);
			}

		});

	}
	else
	{
		if(qType == 'B')  
		{
			setCorrectAnswerTypeB(ans,direction);				
		}
		else
		{
			setCorrectAnswer(ans,direction); //ans
		}
	}
}

//method used to navigate to next or previous question
function navigate(direction){
	timerQuestion.pause();
	if(direction == 'N')
	{
		nextQuestion();
	}
	else if(direction == 'P')
	{
		previousQuestion();
	}
}

//method used to shpw the toast for remaining timing
function showTimingToast(){
	var timing = formatAsTime(getRemainingTime());
	showAppToast('showNoticeToast', timing, 2000);
}

//method used to remove the visited property for any option button
function setOriginClassToBtnTests(){ // set original properties to option buttons

	$('#btnA, #btnB, #btnC, #btnD, #btnE').removeClass("circle-buttonVisited");
	
	$('#tdA1, #tdB1, #tdC1, #tdD1, #tdE1').removeClass("firstColumn-visited");
	
	$('#tdA2, #tdB2, #tdC2, #tdD2, #tdE2').removeClass("questionAnswerColor-visited");
}

//this method is used to create a new Paper Id value
function newPaperId(userId,testId)
{
	var newPaperId = userId + "" + testId + "" + getDateTime();
	newPaperId = newPaperId.replaceAll(" ","").replaceAll(":","");
	newPaperId = newPaperId.replace(/G.*/, "");
	return newPaperId;
}

//events~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

$('#pageQuestionTest').live('pagecreate', function (event, ui) {	
	/*setCurrentQuestionTimer(0);
	timerExam = $.timer(function() { ++examTimeInSec; });
	timerQuestion = $.timer(function() { 
		++questionTimeInSec; 
		setCurrentQuestionTimer(questionTimeInSec);
	});*/
	//timerQuestion = '';
});

$('#pageQuestionTest').live('pageshow', function (event, ui) {
	// if starting new test
	var exam_mode =  getPaperMode();
	if (exam_mode == undefined){
		showAppToast('showWarningToast', 'Session Expired', 3000);
	}else{
		isNavigationTracked = false;
		remaining_time = getRemainingTime();
		generateQuestions();
	}
});

$('#selectCompass').live('tap',function(event, ui){ 
		event.preventDefault();

	$("#menuTest").toggle("fast");
	toggleMenuDisplay(true,"darkLayerMenuTest");
}); 

$('#selectCompassQuesList').live('tap',function(event, ui){ 
		event.preventDefault();
	$("#menuQuesList").toggle("fast");
	toggleMenuDisplay(true,"darkLayerMenuQuesList");
});

$('#selectCompassMyTests').live('tap',function(event, ui){ 
	event.preventDefault();
	
	$("#menuMyTests").toggle("fast");
	toggleMenuDisplay(true,"darkLayerMenuMytests");
});
	
/*$('#pageQuestionTest').live('swipeleft',function(event, ui){
	skipOrSubmit('N');
});

$('#pageQuestionTest').live('swiperight',function(event, ui){
	skipOrSubmit('P');
});*/

$('#btnNavHome').live('tap',function(event, ui){ 
		event.preventDefault();
	$('#imgNavigate2').click();
	pauseExam('pageHome');
	return true;
	
});

$('#btnNavQOTD').live('tap',function(event, ui){ 
		event.preventDefault();
	$('#imgNavigate2').click();
	showQOTDDateList('');
	pauseExam('pageQuestionOfDayList');
	return true;
	
});

$('#btnNavLearn').live('tap',function(event, ui){ 
		event.preventDefault();
	$('#imgNavigate2').click();
	pauseExam('pageReference');
	return true;
	
});

$('#questionTestBack').live('tap',function(event, ui){ 
		event.preventDefault();
	pauseExam('pageMyTest');
	return true;
});

$('#menuStopExam').live('tap',function(event, ui){ 
		event.preventDefault();
	$("#menuTest").toggle("fast");
	toggleMenuDisplay(false,"darkLayerMenuTest");
	stopExam();
	return true;
});

$('#darkLayer1').live('tap',function(event, ui){ 
		event.preventDefault(); 
	$('#imgNavigate2').click();
});

$('#btnInfo').live('tap',function(event, ui){ 
		event.preventDefault();
	$('#ExplainationSection').css('display','inline');
	$('.btn-slide').click();
});

$('#btnGrid').live('tap',function(event, ui){ 
		event.preventDefault();
	$('#ExplainationSection').css('display','inline');
	$('.btn-slide').click();
});


$('#pageMyTest').live('pagebeforeshow', function (event, ui) {
	showMyTests();
});

$('#imgThumbnailView').live('tap',function(event, ui){ 
		event.preventDefault();
	generateQuestionIcons();
});

$('#imgThumbnailView2').live('tap',function(event, ui){ 
		event.preventDefault();
	generateQuestionIconsList();
});

///////////Menu Box--------------------------

$('#menuTestHelp').live('tap',function(event, ui){ 
		event.preventDefault();
	$("#menuTest").toggle("fast");
	ShowDialogHelp(true,"dialogTestHelp","darkLayerMenuTest");
});

$('#menuMyTestsHelp').live('tap',function(event, ui){ 
		event.preventDefault();
	$("#menuMyTests").toggle("fast");
	ShowDialogHelp(true,"dialogMytestsHelp","darkLayerMenuMytests");
});

$('#menuPT').live('tap',function(event, ui){ 
		event.preventDefault();
	isNavigationTracked = true;
	$('#divPageQuestionTest').css('display','inline');
	$('#divPageReferenceBack').css('display','none');
	$("#menuTest").toggle("fast");
	toggleMenuDisplay(false,"darkLayerMenuTest");
	isTest = true;
	skipOrSubmit('');
	setActiveScreen('pageTable');
	
	changeMobilePage('#pageTable');
});

$('#menuQuesListHelp').live('tap',function(event, ui){ 
		event.preventDefault();
	$("#menuQuesList").toggle("fast");
	ShowDialogHelp(true,"dialogQuesListHelp","darkLayerMenuQuesList");
	$("#dialogQuesListHelp").verticalcenter();
});

$('#menuTestOverview').live('tap',function(event, ui){ 
		event.preventDefault();
	isNavigationTracked = true;
	skipOrSubmit('');
	$("#menuTest").toggle("fast");
	toggleMenuDisplay(false,"darkLayerMenuTest");
	
	changeMobilePage('#pageSelectQuestion');
});



$('#menuTestRemaining').live('tap',function(event, ui){ 
		event.preventDefault();
	$("#menuTest").toggle("fast");
	toggleMenuDisplay(false,"darkLayerMenuTest");
	showTimingToast();
});

$('#menuPauseExam').live('tap',function(event, ui){ 
		event.preventDefault();
	$("#menuTest").toggle("fast");
	toggleMenuDisplay(false,"darkLayerMenuTest");
	pauseExam('pageHome');
});

//zoomedImage taps

$('.scaledDnTest').live('tap',function(event, ui){

		var imgData = $(this).attr('src');	
		imgData = "<img class='fullImage' src='" + imgData + "' />";
		$("#theImageTest").html(imgData);
		$(this).css("border","3px dotted blue");
		$(".fullImage").css("border","3px dotted red");
		$(".fullImage").css("background-size","contain");
		
		var availH = $(window).innerHeight();
		var oriH = $('#dialogForZoomedImageInTest').height();
		
		if(oriH > availH  || oriH==0) 
		{
			$(".fullImage").css("height",$(window).innerHeight() * 0.80 );
		}
		
		ShowZoomedImage(true,"dialogForZoomedImageInTest","darkLayerForZoomedImageInTest");
		touchslider.createSlidePanel('#fullImageTest', 200, 15);
		$("#dialogForZoomedImageInTest").verticalcenter();

});

$('.scaledDnSelQues').live('tap',function(event, ui){
	
		var imgData = $(this).attr('src');	
		imgData = "<img class='fullImage' src='" + imgData + "' />";
		$("#theImageSelQues").html(imgData);
		$(this).css("border","3px dotted blue");
		$(".fullImage").css("border","3px dotted red");
		$(".fullImage").css("background-size","contain");
		
		var availH = $(window).innerHeight();
		var oriH = $('#dialogForZoomedImageInSelQues').height();
		
		if(oriH > availH  || oriH==0) 
		{
			$(".fullImage").css("height",$(window).innerHeight() * 0.80 );
		}
		
		ShowZoomedImage(true,"dialogForZoomedImageInSelQues","darkLayerForZoomedImageInSelQues");
		touchslider.createSlidePanel('#fullImageSelQues', 200, 15);
		$("#dialogForZoomedImageInSelQues").verticalcenter();

});

 

$('#btnCloseForZoomedImageInTest').live('tap',function(event, ui){ 
	event.preventDefault();
	ShowZoomedImage(false,"dialogForZoomedImageInTest","darkLayerForZoomedImageInTest");
});

$('#darkLayerForZoomedImageInTest').live('tap',function(event, ui){ 
	event.preventDefault(); 
	ShowZoomedImage(false,"dialogForZoomedImageInTest","darkLayerForZoomedImageInTest");
});

$('#btnCloseForZoomedImageInSelQues').live('tap',function(event, ui){ 
	event.preventDefault();
	ShowZoomedImage(false,"dialogForZoomedImageInSelQues","darkLayerForZoomedImageInSelQues");
});

$('#darkLayerForZoomedImageInSelQues').live('tap',function(event, ui){ 
	event.preventDefault();
	ShowZoomedImage(false,"dialogForZoomedImageInSelQues","darkLayerForZoomedImageInSelQues");
});

$('#btnCloseTestHelp').live('tap',function(event, ui){ 
		event.preventDefault();
	 ShowDialogHelp(false,"dialogTestHelp","darkLayerMenuTest");
});

$('#btnCloseMytestsHelp').live('tap',function(event, ui){ 
		event.preventDefault();
	 ShowDialogHelp(false,"dialogMytestsHelp","darkLayerMenuMytests");
});

$('#btnCloseQuesListHelp').live('tap',function(event, ui){ 
		event.preventDefault();
	 ShowDialogHelp(false,"dialogQuesListHelp","darkLayerMenuQuesList");
});

$('#darkLayerMenuMytests').live('tap',function(event, ui){ 
	event.preventDefault();
	$("#menuMyTests").hide();
	ShowDialogHelp(false,"dialogMytestsHelp","darkLayerMenuMytests");
});

$('#darkLayerMenuTest').live('tap',function(event, ui){ 
	event.preventDefault();
	$("#menuTest").hide();
	ShowDialogHelp(false,"dialogTestHelp","darkLayerMenuTest");
});

$('#darkLayerMenuQuesList').live('tap',function(event, ui){ 
	event.preventDefault();
   	$("#menuQuesList").hide();
	ShowDialogHelp(false,"dialogQuesListHelp","darkLayerMenuQuesList");
});

$( '#pageQuestionTest' ).live( 'pagehide',function(event, ui){

	timerQuestion.pause();
	
	if(!isNavigationTracked)
	{
		pauseExam('pageHome');
	}
});

// Reference No. block~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
$("#spnQuestionType").live('tap',function(event, ui){ 
		event.preventDefault();
	showAppToast('showWarningToast', getQuestionReferenceNo(), 3000);
});

//Block End~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

$('#divNextQuestion, #divPrevQuestion').live('tap',function(event, ui){ 
		event.preventDefault();
	var selOpt = $(this).attr('id');
	
	if (selOpt == 'divNextQuestion')
	{
		skipOrSubmit('N');	
	}
	else if (selOpt == 'divPrevQuestion')
	{
		skipOrSubmit('P');
	}
});
	
$('#btnSubmitAndScore,#btnContinue').live('tap',function(event, ui){ 
		event.preventDefault();			
	var selOpt = $(this).attr('id');
	if (selOpt == 'btnSubmitAndScore')
	{
		ShowDialogTest(false);
		stopExam();
	}
	else if (selOpt == 'btnContinue')
	{
		db.transaction(function (tx) {
			setPaperMode("P");
			tx.executeSql("UPDATE tbPaper SET mode=? WHERE paperId=?", ['P',getSessionPaperId()]);
		});
		 
		ShowDialogTest(false);
	}
});


