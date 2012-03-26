var isQuestionReported = false;
var isAnswerReported = false;
var isRationaleReported = false;
var feedbackCaller = "General" // default & from settings = "General", from tests = "Test", from review test = "TestReview"

String.prototype.replaceAll = function(pcFrom, pcTo) {
    var i = this.indexOf(pcFrom);
    var c = this;

    while (i > -1) {
        c = c.replace(pcFrom, pcTo);
        i = c.indexOf(pcFrom);
    }
    return c;
}

Array.prototype.search = function(value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == value) {
            return true;
        }
    }
    return false;
}

function stringToXML(xml) {
    var xmlDoc;
    if (window.DOMParser) {
        var parser = new DOMParser();
        xmlDoc = parser.parseFromString(xml, "text/xml");
    }
    else // Internet Explorer
    {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xml);
    }
    return xmlDoc;
}

function showProgressDialog() {
    changeMobilePage('#pageLoading');
}

function networkState() {
    var status = navigator.onLine;
    if (!status) {
        $().toastmessage('showNoticeToast', 'Unable to connect to the server;<br>Please turn on WiFi or try again when 3G signal is available', 3000);
    }
    return status;
}

function toastServerError() {
    $().toastmessage('showNoticeToast', 'Server error occurred.<br>Please try again later', 3500);
}

function showElement(element) {
    $(element).removeClass("hide").addClass("show");
}

function hideElement(element) {
    $(element).removeClass("show").addClass("hide");
}

function showAppToast(type, message, time) {
    $('#divToast').css('display', 'block');
    $().toastmessage(type, message, time);
}

function getDateTime() {
    var dt = new Date();
    return dt.toString();
}

function parseDate(input) {
    var parts = input.match(/(\d+)/g);
    return new Date(parts[0], parts[1] - 1, parts[2]);
}

Date.prototype.format = function(format) {
    var returnStr = '';
    var replace = Date.replaceChars;
    for (var i = 0; i < format.length; i++) {
        var curChar = format.charAt(i);
        if (i - 1 >= 0 && format.charAt(i - 1) == "\\") {
            returnStr += curChar;
        }
        else if (replace[curChar]) {
            returnStr += replace[curChar].call(this);
        } else if (curChar != "\\") {
            returnStr += curChar;
        }
    }
    return returnStr;
};

Date.replaceChars = {
    shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

    // Day
    d: function() { return (this.getDate() < 10 ? '0' : '') + this.getDate(); },
    D: function() { return Date.replaceChars.shortDays[this.getDay()]; },
    // Month
	z: function() { return ((this.getMonth()+1) < 10 ? '0' : '') + (this.getMonth()+1); },
    M: function() { return Date.replaceChars.shortMonths[this.getMonth()]; },
    // Year
    Y: function() { return this.getFullYear(); },
	// Time
	A: function() { return this.getHours() < 12 ? 'AM' : 'PM'; },
	H: function() { return (this.getHours() < 10 ? '0' : '') + this.getHours(); },  //24 hrs
	h: function() { return ((this.getHours() % 12 || 12) < 10 ? '0' : '') + (this.getHours() % 12 || 12); }, //12 hrs
	m: function() { return (this.getMinutes() < 10 ? '0' : '') + this.getMinutes(); },
	s: function() { return (this.getSeconds() < 10 ? '0' : '') + this.getSeconds(); }

};

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function guid() {
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function getPrimaryKey() {
    var newPrimaryKey = S4() + getUserId() + getDateTime();
    newPrimaryKey = newPrimaryKey.replaceAll(" ", "").replaceAll(":", "");
    newPrimaryKey = newPrimaryKey.replace(/G.*/, "");
    return newPrimaryKey;
}

//method used to handle the zoomed inage dailog
function ShowZoomedImage(modal, imageDailog, layerId) {
    if (modal) {
        $("#" + layerId).show();
        $("#" + imageDailog).fadeIn(300);
    }
    else {
        $("#" + layerId).hide();
        $("#" + imageDailog).fadeOut(300);
    }
}

//method to adjust the image to fit to available size of the screen so that it can be later zoomed 
function adjustImage(source, sourceID, page, availWidth) {

    source = source.replace(/<img /g, "<IMG class='xxx' "); // to handle multiple images
    source = source.replace(/<img width='0' height='0' .>/, "");
    source = source.replace(/<img width='0' height='0' [\w]+\>/g, "");
    source = source.replace(/<img height='0' width='0'  [\w]+\>/g, "");
    var pattI = new RegExp("<IMG ");
    var avaW = availWidth;
	$(sourceID).html(source);
	
    while (pattI.test(source)) { // to handle multiple images

        source = source.replace(/<IMG /, "<img ");
        $(sourceID).html(source);

        var oriW = $('.xxx').width();
        var oriH = $('.xxx').height();
		if(oriW==0)
		{
			source = source.replace(/<img class='xxx' /, "<img class='scaledDn" + page + "' width='30px' height='20px' ");
		}else if(oriW > avaW) 
		{
            var imgScale = (avaW / oriW) * 100;
            var newW = avaW * 0.90;
            var newH = oriH * (newW / oriW) * 0.90;
            source = source.replace(/<img class='xxx' /, "<img class='scaledDn" + page + "' width='" + newW + "px' height='" + newH + "px' ");
        } else {
            source = source.replace(/<img class='xxx' /, "<img class='scaledNO" + page + "' ");
        }
        $(sourceID).html(source);
		
		$(".scaledNO" + page).css("border", "1px dotted green"); // no changes in image size
		$(".scaledDn" + page).css("border", "1px dotted red"); // image scaled down (proportionally) to fit into available width
    }
}

//method to highlight the previously submitted answer
//type: 0 = type A/C with textual options, 1 = type A/C with no textual options, 2 = type B
function highlightSubmitted(type, answer) {
    if (type == 0) {
        changeBtnColor('#btn' + answer, '#td' + answer + '1', '#td' + answer + '2');
    }
    else if (type == 1) {
        changeBtnColor2('#btn' + answer);
    }
    else if (type == 2) {
        var qAns = answer.split(",");
        $('#btnI' + qAns[0]).addClass("circle-buttonVisited");
        $('#btnII' + qAns[1]).addClass("circle-buttonVisited");
        if (qAns[2] == "CE") {
            $('#btnCE').addClass("circle-buttonVisited");
        } else {
            $('#btnNA').addClass("circle-buttonVisited");
        }
        areOptionsHighlighted = true;
    }
}

//method to change the btn color in Test and QOTD
function changeBtnColor(btnName, btnCol1, btnCol2) { // to change color of selected option button for Type A and C with textual options
    $(btnName).addClass("circle-buttonVisited");
    $(btnCol1).addClass("firstColumn-visited");
    $(btnCol2).addClass("questionAnswerColor-visited");
}

//method to change the btn color in Test and QOTD
function changeBtnColor2(btnName) { // to change color of selected option button for Type A and C with no textual options
    $(btnName).addClass("circle-buttonVisited");
}

//method to change the btn color in feedback
function changeBtnColorFeedback(btnName,modal) { // to change color of selected option button for Type A and C with no textual options
	if(modal){
    	$(btnName).addClass("circle-buttonVisited");
	}else{
		$(btnName).removeClass("circle-buttonVisited");
	}
}


//method to change the btn color in Test and QOTD
function changeBtnColorForTypeB(btnOne, btnTwo) { // change color of selected option button for Type B 
    if (areOptionsHighlighted) {
        $('#btnIT, btnIF, #btnIIT, #btnIIF, #btnCE, #btnC').removeClass("circle-buttonVisited");
        areOptionsHighlighted = false;
    }
    $(btnOne).removeClass("circle-buttonVisited");
    $(btnTwo).addClass("circle-buttonVisited");
}

function showLoader(message){
    try{
    	$.mobile.activePage.find('#my_disLayer').disLayer('show' );
    }catch(e){}

	if(message =='' || message==undefined){
		$.mobile.loadingMessage = "loading";
	}else{
		$.mobile.loadingMessage = message;
	}
	$.mobile.showPageLoadingMsg();
}

function hideLoader(){
	$.mobile.activePage.find('#my_disLayer').disLayer('hide' )
	$.mobile.hidePageLoadingMsg();	
	$.mobile.loadingMessage = "loading";
}

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop() + "px");
    this.css("left", (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft() + "px");
    return this;
}

jQuery.fn.verticalcenter = function () {
    this.css("position","absolute");
    this.css("top", (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop() + "px");
    return this;
}

jQuery.fn.bottom = function () {
    this.css("position","absolute");
    this.css("top", (($(window).height() - this.outerHeight()) / 3) + $(window).scrollTop() + "px");
    return this;
}

function replaceNullUndefined(str) {
    var retStr = '';
    if (str == null || str == undefined) {
        retStr = '';
    } else {
        retStr = str
    }
    return retStr;
}

/* Feedback Module */

//this method is used to create a new Paper Id value
function passQuestionDetailsToFeedback(questionDetails){
	var testQuestionText = $('#' + questionDetails).html();
	$('#divReportTestQuestion').html(', ' + testQuestionText);
}

//method called when user wants to report the question
function choiceQ(){
	if(isQuestionReported){
		changeBtnColorFeedback('#btnQ',false);
		isQuestionReported = false;
	}else{
		changeBtnColorFeedback('#btnQ',true);
		isQuestionReported = true;
	}
}

//method called when user wants to report the options
function choiceO(){
	if(isAnswerReported){
		changeBtnColorFeedback('#btnO',false);
		isAnswerReported = false;
	}else{
		changeBtnColorFeedback('#btnO',true);
		isAnswerReported = true;
	}	
}

//method called when user wants to report the Rationale
function choiceR(){
	if(isRationaleReported){
		changeBtnColorFeedback('#btnR',false);
		isRationaleReported = false;
	}else{
		changeBtnColorFeedback('#btnR',true);
		isRationaleReported = true;
	}	
}

// to manage the feedback screen in accordace to the page who has called it.
$('#pageFeedback').live('pagebeforeshow', function (event, ui) {
	var feedbackHeaderText;
	if(feedbackCaller == 'Test')
	{
		feedbackHeaderText = "Thanks for providing feedback on this question. Please check Q if there are issues with the question and A if there are issues with the answer.";
		$('#QuestionRow').show();
		$('#AnswerRow').show();
		$('#rationaleRow').hide();
	}
	else if(feedbackCaller == 'TestReview')
	{
		feedbackHeaderText = "Thanks for providing feedback on this question. Please check if Q if there are issues with the question, A if there are issues with the answer and R if there are issues with the rationale.";
		$('#QuestionRow').show();
		$('#AnswerRow').show();
		$('#rationaleRow').show();
	}
	else
	{
		feedbackHeaderText = "Thank you for trying this Free Beta App. Please provide as much information as possible to improve this App.";
		$('#QuestionRow').hide();
		$('#AnswerRow').hide();
		$('#rationaleRow').hide();
	}
	$('#feedbackHeaderText').html("" + feedbackHeaderText);
	try{		
		document.getElementById("txtReportDescription").value = "";
	}catch(e){}
});

//to handle the tap event of send feedback on Feedback Screen.
$('#btnSendFeedback').live('tap',function(event, ui){ 
	event.preventDefault();
	
	//temporary text~~~~~~~~~~~~~~~~~~~~~~
	/*var reportValues = "the Following data will be sent on server for verifying the issue, { TestId=" + currentTestId + ", UserId=" + getUserId() + ", QuestionID(UID)="+ getCurrentQuestionUid() + ", isQuestionReopted=" + isQuestionReported + ", isOptionsReported=" + isAnswerReported + ", Description=" + $("#txtReportDescription").val() + " }" ;*/
	
	var identifierText;
	var UIDtext, isQuestionReportedText, isAnswerReportedText, isRationaleReportedText;
	var feedbackDate = new Date();
	var dateTime = feedbackDate.format('M d Y h:mA');
	
	if(feedbackCaller == 'General'){
		identifierText = 'General';
		UIDtext = null;
		isQuestionReportedText = false;
		isAnswerReportedText = false;
		isRationaleReportedText = false;
	}
	else{
		identifierText = 'Test';
		UIDtext = getCurrentQuestionUid();
		isQuestionReportedText = isQuestionReported;
		isAnswerReportedText = isAnswerReported;
		isRationaleReportedText = isRationaleReported;
	}
	
	//the feeback API~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var feedback = {
				dateTime: dateTime,
				identifier: identifierText, //Test, General
				UID: UIDtext,//null
				isQuestionReported: isQuestionReportedText,//false
				isAnswerReported: isAnswerReportedText,
				isRationaleReported: isRationaleReportedText,
				description: $("#txtReportDescription").val()
		};
	
	var feedbackString = JSON.stringify(feedback);	
	sendFeedbackAPI(feedbackString);
	
	//console.log(JSON.stringify(feedback));
	try{
		document.getElementById("txtReportDescription").value = "";
	}catch(e){}
});

$('#menuReportQuestion').live('tap',function(event, ui){ 
	event.preventDefault();
	isNavigationTracked = true;
	skipOrSubmit('');
	setTimerState("stopped");
	$("#menuTest").toggle("fast");
	toggleMenuDisplay(false,"darkLayerMenuTest");
	feedbackCaller = "Test";
	
	try{
		$('#pageFeedback').page('destroy').page();
	}catch(e){}
	
	changeMobilePage('#pageFeedback');
	
	passQuestionDetailsToFeedback('spnQuestionType');
});


$('#menuReportQuestionReview').live('tap',function(event, ui){ 
	event.preventDefault();
	toggleScreenEffectForProgress('#darkLayerMenuReviewQuestion');
	feedbackCaller = "TestReview";
	
	try{
		$('#pageFeedback').page('destroy').page();
	}catch(e){}
	
	changeMobilePage('#pageFeedback');
	passQuestionDetailsToFeedback('spnReviewQuestionType');
});

$('#btnFeedback').live('tap',function(event, ui){ 
	event.preventDefault();
	feedbackCaller = "General"
	
	try{
		$('#pageFeedback').page('destroy').page();
	}catch(e){}
	
	changeMobilePage('#pageFeedback');
	$('#divReportTestQuestion').html('');
});

$('#feedbackBackButton').live('tap',function(event, ui){ 
	event.preventDefault();
	if(feedbackCaller == 'Test')
	{
		setTimerState("running");
		update_clock('countdown_div', getRemainingTime());
		updateCompletionTimer(completedTime);
		goBack('#pageQuestionTest');
	}
	else if(feedbackCaller == 'TestReview')
	{
		goBack('#pageReviewQuestion');
	}
	else if(feedbackCaller == 'General')
	{
		goBack('#pageMyAccountRegistered');
	}
});

// to clear the selected values by user
$('#pageFeedback').live('pagebeforehide', function (event, ui) {
	$('#btnQ, #btnO, #btnR').removeClass("circle-buttonVisited");
	isQuestionReported = false;
	isAnswerReported = false;
	isRationaleReported = false;
});

// to clear the selected values by user
$('#pageFeedback').live('pagecreate', function (event, ui) {
	$('#txtReportDescription').css('height','50px');
});

/* end of feebcak section*/

function appendTestItem(test){
	var htmlCode = "<div align=center class=statusBox onclick='setTestAndNavigate("+ test.testId + ")'> <table width=100%><tr><td width=15% align=center rowspan=2><div class=imgGear>&nbsp;</div></td>";
				htmlCode += "<td><div onclick='setTestAndNavigate("+ test.testId + ")'> " +
											"<table width=100%><tr>";
					var paperId = "newTest";
					var formatedTime = formatTimeDisplay(test.timeLimit*1);
					htmlCode += "<td>"+ test.testName +"</td><td align=right>85 (" + formatedTime + ")</td></tr>"; 
					
					htmlCode += "<tr><td colspan=2><div id='p" + test.testId + "' style='display:none;'>" + paperId + "</div><div id='t" + test.testId + "' style='display:none;'>" + test.testName + "</div><div class='meter-wrap'>" +
								"<div class='meter-value' style='width:0%;'>" +
									 
								" </div>" +
								"</div></td></tr></table></div></td><td rowspan=2 width=5%></td></tr></table></div>";
	htmlCode += "<hr class=hrStyle>";
			
	$('#divMyTestList').append(htmlCode);
		
}


// disable layer plugin
(function($, undefined ) {

$.widget( "mobile.disLayer", $.mobile.widget, {
	options: {
		initSelector: ":jqmData(role='disLayer')"
	},
	_create: function(){
		var $el = this.element;
		$el.addClass('ui-disLayer');
		$el.hide();
	},
 
	show: function() {
		var $el = this.element;
		$el.css('top', '0px');
		$el.css('left',  '0px')	;	
		$el.show();
	},
	hide:function(){
		var $el = this.element;
		$el.hide();
	}
});


  
//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
	$( $.mobile.disLayer.prototype.options.initSelector, e.target ).disLayer();
});
	
})( jQuery );

//-------------- Messagebox Pluggin -------------
(function($) {
	
	$.alerts = {
		
		// These properties can be read/written by accessing $.alerts.propertyName from your scripts at any time
		
		verticalOffset: -75,                // vertical offset of the dialog from center screen, in pixels
		horizontalOffset: 0,                // horizontal offset of the dialog from center screen, in pixels/
		repositionOnResize: true,           // re-centers the dialog on window resize
		overlayOpacity: .01,                // transparency level of overlay
		overlayColor: '#FFF',               // base color of overlay
		okButton: '&nbsp;OK&nbsp;',         // text for the OK button
		cancelButton: '&nbsp;Cancel&nbsp;', // text for the Cancel button
		dialogClass: null,                  // if specified, this class will be applied to all dialogs
		
		// Public methods
		
		confirm: function(message, title, callback) {
			if( title == null ) title = 'Confirm';
			$.alerts._show(title, message, null, 'confirm', function(result) {
				if( callback ) callback(result);
			});
		},
		
		// Private methods
		
		_show: function(title, msg, value, type, callback) {
			
			$.alerts._hide();
			$.alerts._overlay('show');
			
			$("BODY").append(
			  '<div id="popup_container">' +
			    '<h1 id="popup_title"></h1>' +
			    '<div id="popup_content">' +
			      '<div id="popup_message"></div>' +
				'</div>' +
			  '</div>');
			
			if( $.alerts.dialogClass ) $("#popup_container").addClass($.alerts.dialogClass);
			
			// IE6 Fix
			var pos = ($.browser.msie && parseInt($.browser.version) <= 6 ) ? 'absolute' : 'fixed'; 
			
			$("#popup_container").css({
				position: pos,
				zIndex: 99999,
				padding: 0,
				margin: 0
			});
			
			$("#popup_title").text(title);
			$("#popup_content").addClass(type);
			$("#popup_message").text(msg);
			$("#popup_message").html( $("#popup_message").text().replace(/\n/g, '<br />') );
			
			$("#popup_container").css({
				minWidth: $("#popup_container").outerWidth(),
				maxWidth: $("#popup_container").outerWidth()
			});
			
			$.alerts._reposition();
			$.alerts._maintainPosition(true);
			
			switch( type ) {
				case 'confirm':
					$("#popup_message").after('<div id="popup_panel"><strong><table width="90%"><tr><td align="center"><div id="popup_ok" class="buttons orange">' + $.alerts.okButton + '</div></td><td align="center"><div id="popup_cancel" class="buttons orange">' +$.alerts.cancelButton + '</div></td></tr></table></strong></div>');
					
					$("#popup_ok").bind("tap", function(event, ui) {
					event.preventDefault();
						$.alerts._hide();
						if( callback ) callback(true);
					});
					
					$("#popup_cancel").bind("tap", function(event, ui) {
					event.preventDefault();
						$.alerts._hide();
						if( callback ) callback(false);
					});
					
				break;
			}
		},
		
		_hide: function() {
			$("#popup_container").remove();
			$.alerts._overlay('hide');
			$.alerts._maintainPosition(false);
		},
		
		_overlay: function(status) {
			switch( status ) {
				case 'show':
					$.alerts._overlay('hide');
					$("BODY").append('<div id="popup_overlay"></div>');
					$("#popup_overlay").css({
						position: 'absolute',
						zIndex: 99998,
						top: '0px',
						left: '0px',
						width: '100%',
						height: $(document).height(),
						background: $.alerts.overlayColor,
						opacity: $.alerts.overlayOpacity
					});
				break;
				case 'hide':
					$("#popup_overlay").remove();
				break;
			}
		},
		
		_reposition: function() {
			var top = (($(window).height() / 2) - ($("#popup_container").outerHeight() / 2)) + $.alerts.verticalOffset;
			var left = (($(window).width() / 2) - ($("#popup_container").outerWidth() / 2)) + $.alerts.horizontalOffset;
			if( top < 0 ) top = 0;
			if( left < 0 ) left = 0;
			
			// IE6 fix
			if( $.browser.msie && parseInt($.browser.version) <= 6 ) top = top + $(window).scrollTop();
			
			$("#popup_container").css({
				top: top + 'px',
				left: left + 'px'
			});
			$("#popup_overlay").height( $(document).height() );
		},
		
		_maintainPosition: function(status) {
			if( $.alerts.repositionOnResize ) {
				switch(status) {
					case true:
						$(window).bind('resize', $.alerts._reposition);
					break;
					case false:
						$(window).unbind('resize', $.alerts._reposition);
					break;
				}
			}
		}
		
	}
	
	// Shortuct functions
	
	jButtonConfirm = function(message, title, okButton, cancelButton, callback) {
		if (okButton == null || okButton =='' || okButton == undefined){
			$.alerts.okButton = '&nbsp;OK&nbsp;';
		}else{
			$.alerts.okButton = '&nbsp;' +okButton+ '&nbsp;';
		}
		
		if (cancelButton == null || cancelButton =='' || cancelButton == undefined){
			$.alerts.cancelButton = '&nbsp;Cancel&nbsp;';
		}else{
			$.alerts.cancelButton = '&nbsp;' +cancelButton+ '&nbsp;';
		}
 
		$.alerts.confirm(message, title, callback);
	};

})(jQuery);


