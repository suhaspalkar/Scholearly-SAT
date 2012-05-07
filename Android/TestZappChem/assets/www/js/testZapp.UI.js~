
if(document.location.hash == null || document.location.hash == ''){
    document.location.hash = "#pageSplash";    
/*    
	if(window.localStorage.getItem("LoggedUser")== null){
		document.location.hash = "#pageWelcome";
	}
	else{
		document.location.hash = "#pageHome";
	}
*/  
}
/*

$(function() {
	//$.mobile.autoInitialize = false;
	//initDatabase();  
})

*/

$('#pageSplash').live('pageinit', function () {
    $('#pageSplash').css('background', 'url(images/zapp/splash.png)')
    .css('background-position', 'center')
    .css('background-attachment', 'auto')
    .css('background-repeat', 'no-repeat')
    .css('background-size', 'cover');
    
   // initDatabase();    
});




$('#pageHome').live('pagebeforeshow', function () {
	document.location.hash = "#pageHome";
    setHomeScreen($('#pageHome'));
});

/*
$('#pageWelcome').live('pagebeforecreate', function () {


});

$('#pageWelcome').live('pagecreate', function () {
setWaterMark($('#pageWelcome')); 	
//initDatabase();
});


$('#pageWelcome').live('pagebeforeshow', function() {
    var targetPage = getLastPage();
    if (targetPage != undefined) {
        //changeMobilePage(targetPage);
    }
});
*/

$('#pageHome').live('pagecreate', function() {
   // setWaterMark($('#pageHome'));
   setHomeScreen($('#pageHome'));
});

$('#pageWelcome').live('pagecreate', function() {
  
   setWaterMark($('#pageWelcome'));

});



function setWaterMark(ele) {
   // $(ele).css('background', 'url(images/TZ-Background.png)')
   $(ele).css('background', 'url(images/zapp/bg.png)')
	.css('background-position', 'center')
	.css('background-attachment', 'auto')
	.css('background-repeat', 'no-repeat')
    .css('background-size', 'cover');
	handleOrientation();
}

function setHomeScreen(ele) {
    $(ele).css('background', 'url(images/zapp/bg.png)')
	.css('background-position', 'center')
	.css('background-attachment', 'auto')
	.css('background-repeat', 'no-repeat')
    .css('background-size', 'cover');
	/*
	 $('zapLogo').attr('src', 'url(images/zapp/zap.png)')
	.css('background-position', 'center')
	.css('background-attachment', 'auto')
	.css('background-repeat', 'repeat-y')
    .css('background-size', 'cover');
    */
    handleOrientation();
	
}

function scaleIt(orientation ) {   
    var scalePhotos = $('#zapLogo');   
	var secZapLogo	= $('#secZapLogo');  
    var winHeight = window.innerHeight;
   
	secZapLogo.css('background-position', '50% 30% ')
	.css('background-repeat','no-repeat');
 
	if (winHeight <= 320 ) {
		scalePhotos.css('width',  '80px'); 
        scalePhotos.css('padding-bottom', '0.5em');
		secZapLogo.css('background-size', '80px');
	}
         
    else if (winHeight > 320 && winHeight <= 600) {
		if (orientation == "portrait") {
			scalePhotos.css('width',  '80px'); 
			scalePhotos.css('padding-bottom', '0.5em');
			secZapLogo.css('background-size', '80px');
        }
        else if (orientation == "landscape") {
			scalePhotos.css('width', '80px');  
			scalePhotos.css('padding-bottom', '0.5em');
			secZapLogo.css('background-size', '80px');
        }
		else{
			scalePhotos.css('width', '80px');  
			scalePhotos.css('padding-bottom', '2em');
			secZapLogo.css('background-size', '80px');
		}
        
    } else if (winHeight > 600) {
        var booliPad = isiPad();	
           
		if (orientation == "portrait") {
            if(booliPad){
                scalePhotos.css('width', '240px');  
                scalePhotos.css('padding-bottom', '8em');
                secZapLogo.css('background-size', '240px');
                
            }else{
                scalePhotos.css('width', '120px');  
                scalePhotos.css('padding-bottom', '4em');
                secZapLogo.css('background-size', '120px');
            }
			
        }
        else if (orientation == "landscape") {
			scalePhotos.css('width', '120px');  
			scalePhotos.css('padding-bottom', '3em');
			secZapLogo.css('background-size', '120px');
        }
		else{
			scalePhotos.css('width', '80px');  
			scalePhotos.css('padding-bottom', '2em');
			secZapLogo.css('background-size', '80px');
		}
    } 

    
    try{
        var containerBL =  document.getElementById('containerBL'); 
        
        //$('zapLogo').css('background-position', 'center')
        //.css('background-attachment', 'auto')
        //.css('background-repeat', 'repeat-y')
        //.css('background-size', 'cover');
        
        unset(containerBL);        
    }catch(e){}
 

     
}

function unset(e) {
	try{
		e.style.right = '';
		e.style.bottom = '';
		e.style.left = '';
		e.style.top = '';	
	}catch(ex){}

    
}

var canDetect = "onorientationchange" in window;
var orientationTimer = 0;

$(window).bind(canDetect ? "orientationchange" : "resize", function(evt) {

    // given we can only really rely on width and height at this stage,              
    // calculate the orientation based on aspect ratio 
    clearTimeout(orientationTimer);
    orientationTimer = setTimeout(function() {
		handleOrientation(evt);
    });
	

//$("footer-pannel").bottom();

});

function handleOrientation(evt){
	var aspectRatio = 1;
	if (window.innerHeight !== 0) {
		aspectRatio = window.innerWidth / window.innerHeight;
	}
	// if determine the orientation based on aspect ratio 
	var orientation = aspectRatio <= 1 ? "portrait" : "landscape";
	// if the event type is an orientation change event, we can rely on the orientation angle 
	
	try{
		if (evt.type == "orientationchange") {
			if (window.orientation == 90 || window.orientation == -90 || window.orientation == 270) {
				orientation = "landscape";
			}
			else {
				orientation = "portrait";
			}
		}	
	}catch(ex){}


	if (orientation == "portrait") {
		$('meta[name="viewport"]').attr('content', 'height=device-height,width=device-width,initial-scale=1.0,maximum-scale=1.0, minimum-scale=1.0');
		scaleIt(orientation);
	}
	else if (orientation == "landscape") {
		$('meta[name="viewport"]').attr('content', 'height=device-width,width=device-height,initial-scale=1.0,maximum-scale=1.0, minimum-scale=1.0');
		scaleIt(orientation);
	}
}

function isDeviceOS(){
	var iPadAgent = isiPad();
	var iPhoneAgent = isiPhone();
	var iPodAgent = isiPod;
	var AndroidAgent = isAndroid();
 
	if(iPadAgent || iPodAgent || iPhoneAgent || AndroidAgent){
	    return true;
	}else{
		return false;
	}
}

function isAndroid() {
    var ua = navigator.userAgent;
    return ua.match(/Android/i) 
        || ua.match(/Dalvik/)
        || ua.match(/GINGERBREAD/)
        || ua.match(/Linux;.*Mobile Safari/)
        || ua.match(/Linux 1\..*AppleWebKit/);
};

 
function isiPad(){
	return navigator.userAgent.match(/iPad/i) != null; 
}

function isiPhone(){
	return navigator.userAgent.match(/iPhone/i) != null; 
}
function isiPod(){
	return navigator.userAgent.match(/iPod/i) != null;
}

$("#btnDropTable").live('tap', function(event, ui) {   
	event.preventDefault();
	 
	 // jButtonConfirm(message, title, ok button text , cancel button text, callback)
	jButtonConfirm("This will clear all application's data, including other user's data if any.<br/>Are you sure about clearing all data?", 'Clear all data?','YES',' NO ' , function(r) { 
		if (r){
			//startupPage = '#pageWelcome';
			//changeMobilePage('#pageWelcome');
			dropAllTables();
		} 
	});
});



//pageMyAccountRegistered page

$('#pageMyAccountRegistered').live('pagebeforeshow', function() {

    checkLoginStatus(function(currentLoginId) {

        if (currentLoginId == '' || currentLoginId == anonymous) {// if anonymous
            $('#pageMyAccountRegistered').find('#divRegisterUser').css("display", "none");
            $('#pageMyAccountRegistered').find('#divAnonymousUser').css("display", "inline");
        }
        else {//else if register
            $('#pageMyAccountRegistered').find('#divRegisterUser').css("display", "inline");
            $('#pageMyAccountRegistered').find('#divAnonymousUser').css("display", "none");
        }
    });
});

$('#btnRegisterAnonymousUser').live('tap', function(event, ui) {
    event.preventDefault();
	
	$('#pageWelcome').find('#divProgress').css("display", "none");
	$('#pageWelcome').find('#divWelcomeForm').css("display", "inline");
	
    changeMobilePage('#pageWelcome');

});


// ------------ Backup List Page ----------------
var backupJSON;
function showBackupList(Backup){
	backupJSON = Backup;
	try{
		$('#pageBackupList').page('destroy').page();
	}catch(e){}
	changeMobilePage('#pageBackupList');
}

$("#pageBackupList").live("pagecreate", function (event, ui) {
	createBackupList();
});


function createBackupList() {
	var backupList = '<div data-role="collapsible-set">';
	if ($.isArray(backupJSON)){		
		for(var i = 0; i < backupJSON.length; i++){
			backupList += generateBackUpList( backupJSON[i] , i);
		}
	}else{
		backupList += generateBackUpList( backupJSON ,0);
	}
	
	backupList += "</div>";
	$("#backupList").html(backupList);
}

function generateBackUpList( backup ,i){
	var backupList ="";
	var testDetails = backup.testDetails;
	if (testDetails != undefined){
		var dt = backup.DateTime.split('(')[0].trim();
		var listItem = {
			DateTime : dt,
			deviceId : backup.deviceId
		};
				
		var param = JSON.stringify(listItem).replaceAll('"','&quot;');
		
		var strCollapsible = (i==0) ? "data-collapsed='false'" : "";
		 
		backupList += "<div data-role= 'collapsible'  "+ strCollapsible +" data-theme='f' >" +
					"<h3>" + backup.DateTime + "</h3>" + 
					"<div align='left' style='padding-left:1cm;'>Device : "+ backup.deviceName +"</div>"+					   
					"<div align= 'center' >" + 
					"<div id = 'btnBckRestore'" + i + " class = 'buttons orange auto-margin' "+
					" style='width:50%' onclick= \"callRestoreAPI('" + param  + "');return false;\"> Restore </div>" +
					"<div id='backupSummary" + i + "' width='100%'>";
						
		backupList += "<hr class=hrStyle>";
		
		var isArray = $.isArray(testDetails);
		if(isArray){
			for(var j=0; j < testDetails.length; j++){
				backupList +=  listItemStr(testDetails[j]);
			}
		}
		else{ 
			backupList +=  listItemStr(testDetails);
		}
		backupList +=  "</div> </div> </div>";
	}
	
	return backupList;
}


function listItemStr(testDetails){
	var backupList = "<div align=center class=statusBox> <table width=100%><tr><td width=15% align=center rowspan=2><img src='images/icon_questions_gray.png' class='listIcon'></td>";
	backupList += "<td><div> " +
				  "<table width=100%><tr>";
	backupList += "<td>"+ testDetails.TestName +"</td><td align=right>" + testDetails.Status + "% Completed</td></tr>"; 
			
	backupList += "<tr><td colspan=2><div class='meter-wrap'>" +
						"<div class='meter-value' style='width:"+ testDetails.Status +"%'> </div>" +
						"</div></td></tr></table></div></td><td rowspan=2 width=5%></td></tr></table></div>";
	
	backupList += "<hr class=hrStyle>";
	
	return backupList;
}

/* Info Block */
$('#infoIcon').live('tap', function(event, ui) {
    event.preventDefault();
	toggleMenuDisplay(true,"darkLayerHome");
	ShowDialogHelp(true,"dialogInfo","darkLayerHome");

});

$('#btnCloseInfo').live('tap', function(event, ui) {
    event.preventDefault();
	ShowDialogHelp(false,"dialogInfo","darkLayerHome");
});

$('#darkLayerHome').live('tap', function(event, ui) {
    event.preventDefault();
	ShowDialogHelp(false,"dialogInfo","darkLayerHome");s
});

var app_version = "1";
var app_release_no = "1.0.19";

/* Info block End */
$("#pageAbout").live("pagecreate", function (event, ui) {
	$("#spnVersion").html(app_release_no);
	$("#spnEmail").html(getRegisterTo());
	$("#spnDeviceName").html(getDeviceName());
	 
});

 
$("#pageMyTest").live("pagebeforeshow", function (event, ui) {
    $("#btnGetMoreTests").css("display","inline");
});


$('#pageFeedback').live('pagehide', function (e) {
    $.removeData(e.target, 'page');
}); 


