// Background color scheme (as defined in CSS)

var isGrid = false;
var goPage = "";

var catColor = new Array();
catColor["Alkali_Metal"] = "#fda149";
catColor["Alkaline_Earth_Metal"] = "#e6c828";
catColor["Transition_Metal"] = "#11acdf";
catColor["Post-transition_Metal"] = "#06ceda";
catColor["Metalloid"] = "#3abe88";
catColor["Halogen"] = "#037636";
catColor["Other"] = "#afdc15";
catColor["Nobel_Gas"] = "#044f29";
catColor["Lanthanoide"] = "#f79600";
catColor["Actinoid"] = "#f05a00";

// Events on 'Table' page

$(".ui-page-active #PTtabID .Element").live('tap', function(event, ui) {
    event.preventDefault();
    var an = $(this).attr('id').replace(/#an/, "");
    if ($("#hideQuickNavPT").hasClass("show")) {
        isGrid = true;
        changeMobilePage('#pageGrid');
        populateEtab(an);
    }
});


$('#pageTable').live('swiperight', function(event, ui) { moveTableLeft() });
$('#pageTable').live('swipeleft', function(event, ui) { moveTableRight() });

function moveTableLeft() {
    var x = $("#PTtabID").position();
    var wPos = $('#tableID').width(); // available width
    var wTab = $('#PTtabID').width(); // actual table width

    if ((x.left + (wPos / 2)) < 0) {
        $("#PTtabID").offset({ left: (x.left + (wPos / 2)), top: x.top });
    }
    else {
        $("#PTtabID").offset({ left: (0), top: x.top });
    }
}

function moveTableRight() {
    var x = $("#PTtabID").position();
    var wPos = $('#tableID').width(); // available width
    var wTab = $('#PTtabID').width(); // actual table width	

    if (x.left > -1 * (wTab - wPos - (wPos / 2))) {
        $("#PTtabID").offset({ left: (x.left - (wPos / 2)), top: x.top });
    }
    else {

        $("#PTtabID").offset({ left: (-1 * (wTab - wPos)), top: x.top });
    }
}

$('#pageTable').live('pagebeforehide', function(event, ui) {
    $("#PTtabID").offset({ left: (0) });
});

$('#pageTable').live('pagecreate', function(event, ui) {
    createTable();
});

$('#pageTable').live('pagebeforeshow', function(event, ui) {
    if (getActiveScreen() == 'pageTable') {
        showTestPT();
        setActiveScreen('');
    } else {
        showPT();
    }
});

// events on "Search" page

$('#pageSearch').live('pagebeforeshow', function(event, ui) {
    $('.ui-input-search input').attr("placeholder", "type here to filter...");

    if ($('#pageSearch').width() > 480) {
        //$('#listN name').css("color", "red");
        //$('#listN name').css("font-size", "150%");
    }
    else {
        //$('#listN name').css("color", "blue");
        //$('#listN name').css("font-size", "100%");
    }
});

// events on gridPage


$(".ui-page-active #gridID").live('swipeleft', function(event, ui) {
    var an = $(this).attr('id1');

    var r = elements[an][5] * 1;
    var c = elements[an][4] * 1;
    if (tab[r][c + 1] != undefined) {
        populateEtab(tab[r][c + 1]); 
    }
});

$(".ui-page-active #gridID").live('swiperight', function(event, ui) {
    var an = $(this).attr('id1');
    var r = elements[an][5] * 1;
    var c = elements[an][4] * 1;
    if (tab[r][c - 1] != undefined) {
        populateEtab(tab[r][c - 1]);
    }
});


// creating contents for gridPage

function populateEtab(an) {

    try {
        var r = elements[an][5] * 1;
        var c = elements[an][4] * 1;
        if (an >= 57 && an < 72) {
            c = 3;
        }
        if (an >= 89 && an < 104) {
            c = 3;
        }
        var elemShown = new Array();

        $('.prvRow').html(r - 1);
        $('.prvCol').html(c - 1);

        $('.curRow').html(r);
        $('.curCol').html(c);

        $('.nxtRow').html(r + 1);
        $('.nxtCol').html(c + 1);

        $("#gridID").attr("id1", an);

        populateEtabElem("#elemX", an);
        elemShown.push(tab[r][c]);

        if (tab[r - 1][c - 1] != undefined) {
            populateEtabElem("#elemA", tab[r - 1][c - 1]);
            elemShown.push(tab[r - 1][c - 1]);
        }
        else {
            removeEtabElem("#elemA");
        }

        if (tab[r - 1][c] != undefined) {
            populateEtabElem("#elemB", tab[r - 1][c]);
            elemShown.push(tab[r - 1][c]);
        }
        else {
            removeEtabElem("#elemB");
        }

        if (tab[r - 1][c + 1] != undefined) {
            populateEtabElem("#elemC", tab[r - 1][c + 1]);
            elemShown.push(tab[r - 1][c + 1]);
        }
        else {
            removeEtabElem("#elemC");
        }

        if (tab[r][c + 1] != undefined) {
            populateEtabElem("#elemD", tab[r][c + 1]);
            elemShown.push(tab[r][c + 1]);
        }
        else {
            removeEtabElem("#elemD");
        }

        if (tab[r + 1][c + 1] != undefined) {
            populateEtabElem("#elemE", tab[r + 1][c + 1]);
            elemShown.push(tab[r + 1][c + 1]);
        }
        else {
            removeEtabElem("#elemE");
        }

        if (tab[r + 1][c] != undefined) {
            populateEtabElem("#elemF", tab[r + 1][c]);
            elemShown.push(tab[r + 1][c]);
        }
        else {
            removeEtabElem("#elemF");
        }

        if (tab[r + 1][c - 1] != undefined) {
            populateEtabElem("#elemG", tab[r + 1][c - 1]);
            elemShown.push(tab[r + 1][c - 1]);
        }
        else {
            removeEtabElem("#elemG");
        }

        if (tab[r][c - 1] != undefined) {
            populateEtabElem("#elemH", tab[r][c - 1]);
            elemShown.push(tab[r][c - 1]);
        }
        else {
            removeEtabElem("#elemH");
        }


        // adding thumb PT in gridPage
        var tmpStr = "";
        tmpStr = $('#tableID').html();
        tmpStr = tmpStr.replace(/PTtabID/, "thumb");
        var tmpStr2 = "#an" + an;
        tmpStr = tmpStr.replace(tmpStr2, "selected");
        for (i in elemShown) {
            var tmpStr2 = "#an" + elemShown[i];
            tmpStr = tmpStr.replace(tmpStr2, "selected2");
        }
        $('#thumbLoc').html(tmpStr);

        // adjusting width of thumb PT on gridPage
		$("#thumb name").css("display","none");
        $("#thumb atomicwt").css("display","none");
        
        var fS = $('#pageGrid #thumb').css("font-size");
        fS = fS.replace(/px/, "");
        fS = fS * 1;
        while ($('#pageGrid #thumb').width() > $('#gridID').width()) {
            fS -= 1;
            $('#pageGrid #thumb').css("font-size", fS + "px");
        }
    } catch (ex) { }
}


function populateEtabElem(id, an) {
    $(id).removeClass();

    if (id == "#elemX") {
        $(id).html("<table border='0' width='100%'><tr><td align='right'><atomicno>" + elements[an][0] + "</atomicno></td></tr>"
		+ "<tr><td align='center' "
		+ "onclick='Load_learnElem(" + an + ")'"
		+ ">"
		+ "<acronym>" + elements[an][2] + "</name>"
		+ "<br/>" + "<name>" + elements[an][3] + "</name></td></tr><tr><td>&nbsp;</td></tr></table>");
    }
    else {
        $(id).html("<table border='0' width='100%'><tr><td align='right'><atomicno>" + elements[an][0] + "</atomicno></td></tr>"
		+ "<tr><td align='center' "
		+ "onclick='populateEtab(" + an + ")'"
		+ ">"
		+ "<acronym>" + elements[an][2] + "</name>"
		+ "<br/>" + "<name>" + elements[an][3] + "</name></td></tr><tr><td>&nbsp;</td></tr></table>");
    }
    $(id).addClass(elements[an][1]);
    $(id).addClass("othElem");
    $(id).attr("id1", an);
};


function removeEtabElem(id, an) {
    $(id).removeClass();
    $(id).html("<atomicno>" + " " + "</atomicno>"
		+ " " + "<acronym>" + " " + "</name>"
		+ "<br/>" + "<name>" + " " + "</name>");
    $(id).attr("id1", "xxx");
    $(id).addClass("othElem");
}

// events on "Search" page

$('.ui-page-active #thumbLoc #thumb .Element').live('tap', function(event, ui) {
    event.preventDefault();
    var an = $(this).attr('id').replace(/#an/, "");

    changeMobilePage('#pageGrid');
    populateEtab(an);
});


// events on learnPage

$('.ui-page-active #learnID #thumb .Element').live('tap', function(event, ui) {
    event.preventDefault();
    var an = $(this).attr('id').replace(/#an/, "");

    Load_learnElem(an);
});


$('#pageLearn').live('pagebeforeshow', function(event, ui) {
    if ($('#learnID').html() == "learnID") {
        Load_learnElem(1);
    }
});

function showhideNxtPrvElem(an) {
    if (ShowHideNxtPrv == 0) {
        showNxtPrvElem(an);
        ShowHideNxtPrv = true;
    }
    else {
        hideNxtPrvElem(an);
        ShowHideNxtPrv = false;
    }
};

function showNxtPrvElem(an) {
    var xxx = elements[an][1].replace(/.* /, "");
    learnPageBCol = catColor[xxx];

    var xxx = elements[(an + 1)][1].replace(/.* /, "");
    nxtElemBCol = catColor[xxx];

    var xxx = elements[(an - 1)][1].replace(/.* /, "");
    prvElemBCol = catColor[xxx];

    $('.nxtElem').css("background-color", nxtElemBCol);
    $('.prvElem').css("background-color", prvElemBCol);
    $('.nxtElem').css("color", nxtElemCol);
    $('.prvElem').css("color", prvElemCol);

    if (learnPageBCol == nxtElemBCol) {
        $('.nxtElem').css("border", ".1em solid white");
    }
    if (learnPageBCol == prvElemBCol) {
        $('.prvElem').css("border", ".1em solid white");
    }
};

function hideNxtPrvElem(an) {
    var xxx = elements[an][1].replace(/.* /, "");
    learnPageBCol = catColor[xxx];

    $('.nxtElem').css("color", learnPageBCol);
    $('.nxtElem').css("background-color", learnPageBCol);
    $('.prvElem').css("color", learnPageBCol);
    $('.prvElem').css("background-color", learnPageBCol);

    $('.nxtElem').css("border", "0 solid " + learnPageBCol + "");
    $('.prvElem').css("border", "0 solid " + learnPageBCol + "");

    learnPageBCol = $('.nxtElem').css("background-color");
};

$('#learnElem').live('swipeleft', function(event, ui) {
    var an = $(this).attr('nxtElem');
    Load_learnElem(an);
});


$('#learnElem').live('swiperight', function(event, ui) {
    var an = $(this).attr('prvElem');
    Load_learnElem(an);
});

// creating contents for learnPage

var nxtElemCol = "";
var prvElemCol = "";
var nxtElemBCol = "";
var prvElemBCol = "";
var nxtElemBorder = "";
var prvElemBorder = "";
var learnPageBCol = "";

var ShowHideNxtPrv = 0;

function Load_learnElem(lElem) {
    try {
        lElem = lElem * 1;
        var tmpStr = "";
        tmpStr += "<div id='learnElem'";
        tmpStr += " prvElem='" + (lElem - 1) + "'";
        tmpStr += " curEl='" + (lElem + 0) + "'";
        tmpStr += " nxtElem='" + (lElem + 1) + "'";
        tmpStr += " ";
        //tmpStr += "onclick='showhideNxtPrvElem(" + lElem + ")'";
        tmpStr += ">";

        tmpStr += "<table id='tabLearnElem' align='center' width='100%' cellspacing='20' cellpadding='2' class='";
        tmpStr += elements[lElem][1];
        tmpStr += "'>";
        //tmpStr += "<tr><td>&nbsp;</td></tr>";
        tmpStr += "<tr>";
        //tmpStr += "<td width='5%'>&nbsp;</td>";
        tmpStr += "<td align='center' width='30%' id='" + (lElem - 1) + "' class='prvElem Element ";
        tmpStr += elements[lElem - 1][1];
        tmpStr += "' ";
        tmpStr += "onclick='Load_learnElem(" + (lElem - 1) + ")'";
        tmpStr += ">";
        tmpStr += "<div align='right'><atomicno>" + elements[lElem - 1][0] + "</atomicno></div>";
        tmpStr += "" + "<acronym>" + elements[lElem - 1][2] + "</acronym>";
        tmpStr += "<br/>" + "<name>" + elements[lElem - 1][3] + "</name>";
        tmpStr += "<br/>&nbsp;"
        //tmpStr += "<div>&nbsp;</div>";
        tmpStr += "</td>";

        //tmpStr += "<td width='5%'>&nbsp;</td>";
        tmpStr += "<td align='center' width='30%' id='" + (lElem) + "' class='curElem Element ";
        tmpStr += elements[lElem][1] + "' ";

        tmpStr += ">";
        tmpStr += "<div align='right'><atomicno>" + elements[lElem][0] + "</atomicno></div>";
        tmpStr += "" + "<acronym>" + elements[lElem][2] + "</acronym>";
        tmpStr += "<br/>" + "<name>" + elements[lElem][3] + "</name>";
        tmpStr += "<br/>&nbsp;"
        //tmpStr += "<div>&nbsp;</div>";
        tmpStr += "</td>";

        //tmpStr += "<td width='5%'>&nbsp;</td>";	
        tmpStr += "<td align='center' width='30%' id='" + (lElem + 1) + "' class='nxtElem Element ";
        tmpStr += elements[lElem + 1][1];

        tmpStr += "' ";
        tmpStr += "onclick='Load_learnElem(" + (lElem + 1) + ")'";
        tmpStr += ">";
        tmpStr += "<div align='right'><atomicno>" + elements[lElem + 1][0] + "</atomicno></div>";
        tmpStr += "" + "<acronym>" + elements[lElem + 1][2] + "</acronym>";
        tmpStr += "<br/>" + "<name>" + elements[lElem + 1][3] + "</name>";
        tmpStr += "<br/>&nbsp;"
        //tmpStr += "<div>&nbsp;</div>";
        tmpStr += "</td>";

        //tmpStr += "<td width='5%'>&nbsp;</td>";
        tmpStr += "</tr>";
        tmpStr += "</table>";

        tmpStr += "<div id='elemInfo' class='Element ";
        tmpStr += elements[lElem][1] + "'";

        tmpStr += " onclick='showhideNxtPrvElem(" + lElem + ")'";

        tmpStr += ">";
        tmpStr += "" + elements[lElem][1].replace(/ /g, ": ").replace(/_/g, " ");
        tmpStr += "";
        tmpStr += "<table>";
        tmpStr += "<tr><td align='right'><lab>Group:</lab><td align='left'>" + elements[lElem][4] + "</td></tr>";
        tmpStr += "<tr><td align='right'><lab>Period:</lab><td align='left'>" + elements[lElem][5] + "</td></tr>";
        tmpStr += "<tr><td align='right'><lab>Atomic Weight:</lab><td align='left'>" + elements[lElem][6] + "</td></tr>";
        tmpStr += "<tr><td align='right'><lab>Density:</lab><td align='left'>" + elements[lElem][7] + " <lab> g/cc</lab></td></tr>";
        tmpStr += "<tr><td align='right'><lab>Melting Point:</lab><td align='left'>" + elements[lElem][8] + " <lab> K</lab></td></tr>";
        tmpStr += "<tr><td align='right'><lab>Boiling Point:</lab><td align='left'>" + elements[lElem][9] + " <lab> K</lab></td></tr>";
        tmpStr += "<tr><td align='right'><lab>Specific Heat:</lab><td align='left'>" + elements[lElem][10] + " <lab> J/g-K</lab></td></tr>";
        tmpStr += "<tr><td align='right'><lab>Electro Negativity:</lab><td align='left'>" + elements[lElem][11] + "</td></tr>";
        tmpStr += "</table>";

        tmpStr += "<br/>" + "<lab>Electronic Configuration</lab>";
        tmpStr += "<br/>" + electConfig1[lElem][1];

        tmpStr += "</div>";
        tmpStr += "</div>";

        // adding PT thumbnail on learnPage
        var tmpStr1 = "";
        tmpStr1 = $('#tableID').html();
        tmpStr1 = tmpStr1.replace(/PTtabID/, "thumb");
        var tmpStr2 = "#an" + lElem;
        tmpStr1 = tmpStr1.replace(tmpStr2, "selected");
        var tmpStr2 = new RegExp(elements[lElem][1], "g");
        var tmpStr3 = elements[lElem][1] + " catSel";
        tmpStr1 = tmpStr1.replace(tmpStr2, tmpStr3);
        tmpStr += "<hr/>" + tmpStr1;

        $('#learnID').html(tmpStr);

        if (isGrid == true) {
            goPage = "grid";
        } else {
            goPage = "search";
        }

        changeMobilePage('#pageLearn');

        ShowHideNxtPrv = 0;

        // adjusting width by reducing font
        var fS = $('#pageLearn name').css("font-size");
        fS = fS.replace(/px/, "");
        fS = fS * 1;

        var cS = $('#tabLearnElem').attr("cellspacing");
        cS = cS * 1;


        while ($('#tabLearnElem').width() > $('#pageLearn').width()) {
            fS -= 1;
            //$('#pageLearn #learnElem').append("<br/>" + fS + "//" + cS);		
            $('#pageLearn name').css("font-size", fS + "px");
            cS -= 4;
            $('#tabLearnElem').attr("cellspacing", cS);
        }


        hideNxtPrvElem(lElem);

        // adjusting thumb width by reducing font
        var fS = $('#pageLearn #thumb').css("font-size");
        fS = fS.replace(/px/, "");
        fS = fS * 1;
        while ($('#pageLearn #thumb').width() > $('#learnElem').width()) {
            fS -= 1;
            $('#pageLearn #thumb').css("font-size", fS + "px");
        }
    } catch (ex) { }
};

function showTestPT() {
    $('#PTtabID name').css("display", "none");

    hideElement('#hideQuickNavPT');
    hideElement('#ptFooter');

    $("#quickNavForPT").removeClass("compass");
    $("#quickNavForPT").addClass("hide");

    $('#PTtabID atomicwt').css("display", "inline");
}

function showPT() {

    showElement('#hideQuickNavPT');
    showElement('#ptFooter');

    $("#quickNavForPT").removeClass("hide");
    $("#quickNavForPT").addClass("compass");
}

//---- code for PT Navigation ----
$("#quickNavForPT").live('tap', function(event, ui) {
    event.preventDefault();
    if ($("#hideQuickNavPT").hasClass("show")) {
        $("#hideQuickNavPT").toggle("fast");
        toggleScreenEffectForPT('#darkLayerMenuPT');
    }
});

$("#hideQuickNavPT").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavPT").toggle("fast");
    if (isMenuSelected == false) {
        toggleScreenEffectForPT('#darkLayerMenuPT');
    }
    isMenuSelected = false;
});

$("#quickNavForPTGridPage").live('tap', function(event, ui) {
    event.preventDefault();
    ShowDialogHelpPTGridPage(true);
});

$("#hideQuickNavPTGridPage").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavPTGridPage").toggle("fast");
    ShowDialogHelpPTGridPage(true);
});

$("#quickNavForPTLearnPage").live('tap', function(event, ui) {
    event.preventDefault();
    ShowDialogHelpPTLearnPage(true);
});

$("#hideQuickNavPTLearnPage").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavPTLearnPage").toggle("fast");
    ShowDialogHelpPTLearnPage(true);

});

$("#quickNavForPTSearchPage").live('tap', function(event, ui) {
    event.preventDefault();
    ShowDialogHelpPTSearchPage(true);
});

$("#hideQuickNavPTSearchPage").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavPTSearchPage").toggle("fast");
    ShowDialogHelpPTSearchPage(true);

});

$("#darkLayerMenuPT").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavPT").hide();
    $("#darkLayerMenuPT").hide();
    HideDialogHelpPT();
});

$("#darkLayerMenuPTGridPage").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavPTGridPage").hide();
    $("#darkLayerMenuPTGridPage").hide();
    HideDialogHelpPTGridPage();
});

$("#darkLayerMenuPTLearnPage").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavPTLearnPage").hide();
    $("#darkLayerMenuPTLearnPage").hide();
    HideDialogHelpPTLearnPage();
});

$("#darkLayerMenuPTSearchPage").live('tap', function(event, ui) {
    event.preventDefault();
    $("#hideQuickNavPTSearchPage").hide();
    $("#darkLayerMenuPTSearchPage").hide();
    HideDialogHelpPTSearchPage();
});

$("#ptHelp").live('tap', function(event, ui) {
    ShowDialogHelpPT(true);
    isMenuSelected = true;
});

function toggleScreenEffectForPT(layer) {
    $(layer).css('display', $(layer).css('display') == 'none' ? 'block' : 'none');
}

function ShowDialogHelpPT(modal) { // to show toast/msgbox 
    $("#darkLayerMenuPT").show();
    $("#dialogPTHelp").fadeIn(300);

    if (modal) {
        $("#darkLayerMenuPT").unbind("click");
    } else {
        $("#darkLayerMenuPT").click(function(e) {
            HideDialogHelpPT();
        });
    }
}

function HideDialogHelpPT() { // to hide toast / msgbox
    $("#dialogPTHelp").fadeOut(300);
    $("#darkLayerMenuPT").hide();
}

$("#btnClosePTHelp").live('tap', function(event, ui) {
    HideDialogHelpPT();
});

function ShowDialogHelpPTGridPage(modal) { // to show toast/msgbox 
    $("#darkLayerMenuPTGridPage").show();
    $("#dialogPTHelpGridPage").fadeIn(300);

    if (modal) {
        $("#darkLayerMenuPTGridPage").unbind("click");
    } else {
        $("#darkLayerMenuPTGridPage").click(function(e) {
            HideDialogHelpPTGridPage();
        });
    }
}

function HideDialogHelpPTGridPage() { // to hide toast / msgbox
    $("#dialogPTHelpGridPage").fadeOut(300);
    $("#darkLayerMenuPTGridPage").hide();
}

$("#btnClosePTHelpGridPage").live('tap', function(event, ui) {
    HideDialogHelpPTGridPage();
});

function ShowDialogHelpPTLearnPage(modal) { // to show toast/msgbox 
    $("#darkLayerMenuPTLearnPage").show();
    $("#dialogPTHelpLearnPage").fadeIn(300);

    if (modal) {
        $("#darkLayerMenuPTLearnPage").unbind("click");
    } else {
        $("#darkLayerMenuPTLearnPage").click(function(e) {
            HideDialogHelpPTLearnPage();
        });
    }
}

function HideDialogHelpPTLearnPage() { // to hide toast / msgbox
    $("#dialogPTHelpLearnPage").fadeOut(300);
    $("#darkLayerMenuPTLearnPage").hide();
}

$("#btnClosePTHelpLearnPage").live('tap', function(event, ui) {
    HideDialogHelpPTLearnPage();
});

function ShowDialogHelpPTSearchPage(modal) { // to show toast/msgbox 
    $("#darkLayerMenuPTSearchPage").show();
    $("#dialogPTHelpSearchPage").fadeIn(300);

    if (modal) {
        $("#darkLayerMenuPTSearchPage").unbind("click");
    } else {
        $("#darkLayerMenuPTSearchPage").click(function(e) {
            HideDialogHelpPTSearchPage();
        });
    }
}

function HideDialogHelpPTSearchPage() { // to hide toast / msgbox
    $("#dialogPTHelpSearchPage").fadeOut(300);
    $("#darkLayerMenuPTSearchPage").hide();
}

$("#btnClosePTHelpSearchPage").live('tap', function(event, ui) {
    HideDialogHelpPTSearchPage();
});

$("#displayElemName").live('tap', function(event, ui) {
    isMenuSelected = true;
    if ($('#elmName').hasClass("hide")) {
        $('#PTtabID name').css("display", "inline");

        $('#elmName').removeClass("hide");
        $('#elmName').addClass("show");
    } else {

        $('#PTtabID name').css("display", "none");

        $('#elmName').removeClass("show");
        $('#elmName').addClass("hide");
    }
    toggleScreenEffectForPT('#darkLayerMenuPT');
});


$("#displayAtWt").live('tap', function(event, ui) {
    isMenuSelected = true;
    if ($('#elmWt').hasClass("hide")) {
        $('#PTtabID atomicwt').css("display", "inline");

        $('#elmWt').removeClass("hide");
        $('#elmWt').addClass("show");
    } else {
        $('#PTtabID atomicwt').css("display", "none");

        $('#elmWt').removeClass("show");
        $('#elmWt').addClass("hide");
    }
    toggleScreenEffectForPT('#darkLayerMenuPT');
});

function populateSearchList() {

    var searchCode;

    searchCode = "<ul id='listN' data-role='listview' data-filter='true' align='left'><li><name>Name</name> <atomicno>No.</atomicno> <acronym>Sym</acronym>";
    searchCode = searchCode + "<category>Category</category> <grpprd>Group/Period</grpprd></li><li><a onclick='Load_learnElem(89)'> <name>Actinium</name> <atomicno>89</atomicno>";
    searchCode = searchCode + "<acronym>Ac</acronym> <category class='Metal Inner_Transition_Metal Actinoid'>Actinoid</category> <grpprd>3-2/7</grpprd></a></li><li>";
    searchCode = searchCode + "<a onclick='Load_learnElem(13)'> <name>Aluminium</name> <atomicno>13</atomicno> <acronym>Al</acronym>";
    searchCode = searchCode + "<category class='Metal Post-transition_Metal'>Post-transition Metal</category> <grpprd>13/3</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(95)'> <name>Americium</name> <atomicno>95</atomicno> <acronym>Am</acronym>";
    searchCode = searchCode + "<category class='Metal Inner_Transition_Metal Actinoid'>Actinoid</category> <grpprd>3-2/7</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(51)'> <name>Antimony</name> <atomicno>51</atomicno> <acronym>Sb</acronym>";
    searchCode = searchCode + "<category class='Metalloid'>Metalloid</category> <grpprd>15/5</grpprd></a></li><li><a onclick='Load_learnElem(18)'>";
    searchCode = searchCode + "<name>Argon</name> <atomicno>18</atomicno> <acronym>Ar</acronym> <category class='Nonmetal Nobel_Gas'>Nobel Gas</category>";
    searchCode = searchCode + "<grpprd>18/3</grpprd></a></li><li><a onclick='Load_learnElem(33)'> <name>Arsenic</name> <atomicno>33</atomicno> <acronym>As</acronym>";
    searchCode = searchCode + "<category class='Metalloid'>Metalloid</category> <grpprd>15/4</grpprd></a></li><li><a onclick='Load_learnElem(85)'><name>Astatine</name>";
    searchCode = searchCode + "<atomicno>85</atomicno> <acronym>At</acronym> <category class='Nonmetal Halogen'>Halogen</category> <grpprd>17/6</grpprd></a>";
    searchCode = searchCode + "</li><li><a onclick='Load_learnElem(56)'> <name>Barium</name> <atomicno>56</atomicno> <acronym>Ba</acronym>";
    searchCode = searchCode + "<category class='Metal Alkaline_Earth_Metal'>Alkaline Earth Metal</category> <grpprd>2/6</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(97)'> <name>Berkelium</name> <atomicno>97</atomicno> <acronym>Bk</acronym>";
    searchCode = searchCode + "<category class='Metal Inner_Transition_Metal Actinoid'>Actinoid</category> <grpprd>3-2/7</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(4)'> <name>Beryllium</name> <atomicno>4</atomicno> <acronym>Be</acronym>";
    searchCode = searchCode + "<category class='Metal Alkaline_Earth_Metal'>Alkaline Earth Metal</category> <grpprd>2/2</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(83)'> <name>Bismuth</name> <atomicno>83</atomicno> <acronym>Bi</acronym>";
    searchCode = searchCode + "<category class='Metal Post-transition_Metal'>Post-transition Metal</category> <grpprd>15/6</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(107)'> <name>Bohrium</name> <atomicno>107</atomicno> <acronym>Bh</acronym>";
    searchCode = searchCode + "<category class='Metal Transition_Metal'>Transition Metal</category> <grpprd>7/7</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(5)'> <name>Boron</name> <atomicno>5</atomicno> <acronym>B</acronym>";
    searchCode = searchCode + "<category class='Metalloid'>Metalloid</category> <grpprd>13/2</grpprd></a></li><li><a onclick='Load_learnElem(35)'>";
    searchCode = searchCode + "<name>Bromine</name> <atomicno>35</atomicno> <acronym>Br</acronym> <category class='Nonmetal Halogen'>Halogen</category>";
    searchCode = searchCode + "<grpprd>17/4</grpprd></a></li><li><a onclick='Load_learnElem(48)'> <name>Cadmium</name> <atomicno>48</atomicno> <acronym>Cd</acronym>";
    searchCode = searchCode + "<category class='Metal Transition_Metal'>Transition Metal</category><grpprd>12/5</grpprd></a></li><li><a onclick='Load_learnElem(55)'>";
    searchCode = searchCode + "<name>Caesium</name> <atomicno>55</atomicno> <acronym>Cs</acronym> <category class='Metal Alkali_Metal'>Alkali Metal</category>";
    searchCode = searchCode + "<grpprd>1/6</grpprd></a></li><li><a onclick='Load_learnElem(20)'> <name>Calcium</name> <atomicno>20</atomicno> <acronym>Ca</acronym>";
    searchCode = searchCode + "<category class='Metal Alkaline_Earth_Metal'>Alkaline Earth Metal</category> <grpprd>2/4</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(98)'> <name>Californium</name> <atomicno>98</atomicno> <acronym>Cf</acronym>";
    searchCode = searchCode + "<category class='Metal Inner_Transition_Metal Actinoid'>Actinoid</category> <grpprd>3-2/7</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(6)'> <name>Carbon</name> <atomicno>6</atomicno> <acronym>C</acronym>";
    searchCode = searchCode + "<category class='Nonmetal Other'>Other</category><grpprd>14/2</grpprd></a></li><li><a onclick='Load_learnElem(58)'><name>Cerium</name>";
    searchCode = searchCode + "<atomicno>58</atomicno> <acronym>Ce</acronym><category class='Metal Inner_Transition_Metal Lanthanoide'>Lanthanoide</category>";
    searchCode = searchCode + "<grpprd>3-1/6</grpprd></a></li><li><a onclick='Load_learnElem(17)'> <name>Chlorine</name> <atomicno>17</atomicno><acronym>Cl</acronym>";
    searchCode = searchCode + "<category class='Nonmetal Halogen'>Halogen</category> <grpprd>17/3</grpprd></a></li><li><a onclick='Load_learnElem(24)'>";
    searchCode = searchCode + "<name>Chromium</name> <atomicno>24</atomicno><acronym>Cr</acronym><category class='Metal Transition_Metal'>Transition Metal</category>";
    searchCode = searchCode + "<grpprd>6/4</grpprd></a></li><li><a onclick='Load_learnElem(27)'> <name>Cobalt</name> <atomicno>27</atomicno> <acronym>Co</acronym>";
    searchCode = searchCode + "<category class='Metal Transition_Metal'>Transition Metal</category><grpprd>9/4</grpprd></a></li><li><a onclick='Load_learnElem(112)'>";
    searchCode = searchCode + "<name>Copernicium</name> <atomicno>112</atomicno> <acronym>Cn</acronym> <category class='Metal Transition_Metal'>Transition Metal";
    searchCode = searchCode + "</category> <grpprd>12/7</grpprd></a></li><li><a onclick='Load_learnElem(29)'> <name>Copper</name> <atomicno>29</atomicno>";
    searchCode = searchCode + "<acronym>Cu</acronym> <category class='Metal Transition_Metal'>Transition Metal</category> <grpprd>11/4</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(96)'> <name>Curium</name> <atomicno>96</atomicno> <acronym>Cm</acronym>";
    searchCode = searchCode + "<category class='Metal Inner_Transition_Metal Actinoid'>Actinoid</category> <grpprd>3-2/7</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(110)'> <name>Darmstadtium</name> <atomicno>110</atomicno> <acronym>Ds</acronym>";
    searchCode = searchCode + "<category class='Metal Transition_Metal'>Transition Metal</category> <grpprd>10/7</grpprd></a></li><li><a onclick='Load_learnElem(105)'>";
    searchCode = searchCode + "<name>Dubnium</name> <atomicno>105</atomicno><acronym>Db</acronym><category class='Metal Transition_Metal'>Transition Metal</category>";
    searchCode = searchCode + "<grpprd>5/7</grpprd></a></li><li><a onclick='Load_learnElem(66)'><name>Dysprosium</name> <atomicno>66</atomicno> <acronym>Dy</acronym>";
    searchCode = searchCode + "<category class='Metal Inner_Transition_Metal Lanthanoide'>Lanthanoide</category> <grpprd>3-1/6</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(99)'> <name>Einsteinium</name> <atomicno>99</atomicno> <acronym>Es</acronym>";
    searchCode = searchCode + "<category class='Metal Inner_Transition_Metal Actinoid'>Actinoid</category> <grpprd>3-2/7</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(68)'> <name>Erbium</name> <atomicno>68</atomicno> <acronym>Er</acronym>";
    searchCode = searchCode + "<category class='Metal Inner_Transition_Metal Lanthanoide'>Lanthanoide</category> <grpprd>3-1/6</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(63)'> <name>Europium</name> <atomicno>63</atomicno> <acronym>Eu</acronym>";
    searchCode = searchCode + "<category class='Metal Inner_Transition_Metal Lanthanoide'>Lanthanoide</category> <grpprd>3-1/6</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(100)'> <name>Fermium</name> <atomicno>100</atomicno> <acronym>Fm</acronym>";
    searchCode = searchCode + "<category class='Metal Inner_Transition_Metal Actinoid'>Actinoid</category> <grpprd>3-2/7</grpprd></a></li>"
    searchCode = searchCode + "<li><a onclick='Load_learnElem(9)'> <name>Fluorine</name> <atomicno>9</atomicno> <acronym>F</acronym>";
    searchCode = searchCode + "<category class='Nonmetal Halogen'>Halogen</category> <grpprd>17/2</grpprd></a></li><li><a onclick='Load_learnElem(87)'>";
    searchCode = searchCode + "<name>Francium</name> <atomicno>87</atomicno> <acronym>Fr</acronym> <category class='Metal Alkali_Metal'>Alkali Metal</category> ";
    searchCode = searchCode + "<grpprd>1/7</grpprd></a></li><li><a onclick='Load_learnElem(64)'> <name>Gadolinium</name> <atomicno>64</atomicno> <acronym>Gd</acronym>";
    searchCode = searchCode + " <category class='Metal Inner_Transition_Metal Lanthanoide'>Lanthanoide</category> <grpprd>3-1/6</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(31)'> <name>Gallium</name> <atomicno>31</atomicno> <acronym>Ga</acronym>";
    searchCode = searchCode + "<category class='Metal Post-transition_Metal'>Post-transition Metal</category> <grpprd>13/4</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(32)'> <name>Germanium</name> <atomicno>32</atomicno> <acronym>Ge</acronym>";
    searchCode = searchCode + "<category class='Metalloid'>Metalloid</category> <grpprd>14/4</grpprd></a></li><li><a onclick='Load_learnElem(79)'>";
    searchCode = searchCode + "<name>Gold</name> <atomicno>79</atomicno> <acronym>Au</acronym> <category class='Metal Transition_Metal'>Transition Metal</category>";
    searchCode = searchCode + " <grpprd>11/6</grpprd></a></li><li><a onclick='Load_learnElem(72)'> <name>Hafnium</name> <atomicno>72</atomicno> <acronym>Hf</acronym>";
    searchCode = searchCode + "<category class='Metal Transition_Metal'>Transition Metal</category> <grpprd>4/6</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(108)'> <name>Hassium</name> <atomicno>108</atomicno> <acronym>Hs</acronym>";
    searchCode = searchCode + "<category class='Metal Transition_Metal'>Transition Metal</category> <grpprd>8/7</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(2)'> <name>Helium</name> <atomicno>2</atomicno> <acronym>He</acronym>";
    searchCode = searchCode + "<category class='Nonmetal Nobel_Gas'>Nobel Gas</category> <grpprd>18/1</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(67)'> <name>Holmium</name> <atomicno>67</atomicno> <acronym>Ho</acronym>";
    searchCode = searchCode + "<category class='Metal Inner_Transition_Metal Lanthanoide'>Lanthanoide</category> <grpprd>3-1/6</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(1)'> <name>Hydrogen</name> <atomicno>1</atomicno> <acronym>H</acronym>";
    searchCode = searchCode + "<category class='Nonmetal Other'>Other</category> <grpprd>1/1</grpprd></a></li><li><a onclick='Load_learnElem(49)'><name>Indium</name> ";
    searchCode = searchCode + "<atomicno>49</atomicno> <acronym>In</acronym> <category class='Metal Post-transition_Metal'>Post-transition Metal</category>";
    searchCode = searchCode + "<grpprd>13/5</grpprd></a></li><li><a onclick='Load_learnElem(53)'> <name>Iodine</name> <atomicno>53</atomicno><acronym>I</acronym> ";
    searchCode = searchCode + "<category class='Nonmetal Halogen'>Halogen</category> <grpprd>17/5</grpprd></a></li><li><a onclick='Load_learnElem(77)'>";
    searchCode = searchCode + "<name>Iridium</name> <atomicno>77</atomicno> <acronym>Ir</acronym> <category class='Metal Transition_Metal'>Transition Metal</category>";
    searchCode = searchCode + " <grpprd>9/6</grpprd></a></li><li><a onclick='Load_learnElem(26)'> <name>Iron</name> <atomicno>26</atomicno> <acronym>Fe</acronym>";
    searchCode = searchCode + "<category class='Metal Transition_Metal'>Transition Metal</category> <grpprd>8/4</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(36)'> <name>Krypton</name> <atomicno>36</atomicno> <acronym>Kr</acronym>";
    searchCode = searchCode + "<category class='Nonmetal Nobel_Gas'>Nobel Gas</category> <grpprd>18/4</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(57)'><name>Lanthanum</name> <atomicno>57</atomicno> <acronym>La</acronym>";
    searchCode = searchCode + "<category class='Metal Inner_Transition_Metal Lanthanoide'>Lanthanoide</category> <grpprd>3-1/6</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(103)'> <name>Lawrencium</name> <atomicno>103</atomicno> <acronym>Lr</acronym>";
    searchCode = searchCode + "<category class='Metal Inner_Transition_Metal Actinoid'>Actinoid</category> <grpprd>3-2/7</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(82)'> <name>Lead</name> <atomicno>82</atomicno> <acronym>Pb</acronym>";
    searchCode = searchCode + "<category class='Metal Post-transition_Metal'>Post-transition Metal</category> <grpprd>14/6</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(3)'> <name>Lithium</name> <atomicno>3</atomicno> <acronym>Li</acronym>";
    searchCode = searchCode + "<category class='Metal Alkali_Metal'>Alkali Metal</category> <grpprd>1/2</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(71)'> <name>Lutetium</name> <atomicno>71</atomicno> <acronym>Lu</acronym>";
    searchCode = searchCode + "<category class='Metal Inner_Transition_Metal Lanthanoide'>Lanthanoide</category> <grpprd>3-1/6</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(12)'> <name>Magnesium</name> <atomicno>12</atomicno> <acronym>Mg</acronym>";
    searchCode = searchCode + "<category class='Metal Alkaline_Earth_Metal'>Alkaline Earth Metal</category> <grpprd>2/3</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(25)'> <name>Manganese</name> <atomicno>25</atomicno> <acronym>Mn</acronym>";
    searchCode = searchCode + "<category class='Metal Transition_Metal'>Transition Metal</category> <grpprd>7/4</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(109)'> <name>Meitnerium</name> <atomicno>109</atomicno> <acronym>Mt</acronym>";
    searchCode = searchCode + "<category class='Metal Transition_Metal'>Transition Metal</category> <grpprd>9/7</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(101)'> <name>Mendelevium</name> <atomicno>101</atomicno> <acronym>Md</acronym>";
    searchCode = searchCode + "<category class='Metal Inner_Transition_Metal Actinoid'>Actinoid</category> <grpprd>3-2/7</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(80)'> <name>Mercury</name> <atomicno>80</atomicno> <acronym>Hg</acronym>";
    searchCode = searchCode + "<category class='Metal Transition_Metal'>Transition Metal</category> <grpprd>12/6</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(42)'> <name>Molybdenum</name> <atomicno>42</atomicno> <acronym>Mo</acronym>";
    searchCode = searchCode + "<category class='Metal Transition_Metal'>Transition Metal</category> <grpprd>6/5</grpprd></a></li><li><a onclick='Load_learnElem(60)'>";
    searchCode = searchCode + "<name>Neodymium</name> <atomicno>60</atomicno> <acronym>Nd</acronym> <category class='Metal Inner_Transition_Metal Lanthanoide'>";
    searchCode = searchCode + "Lanthanoide</category> <grpprd>3-1/6</grpprd></a></li><li><a onclick='Load_learnElem(10)'> <name>Neon</name> <atomicno>10</atomicno>";
    searchCode = searchCode + " <acronym>Ne</acronym> <category class='Nonmetal Nobel_Gas'>Nobel Gas</category> <grpprd>18/2</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(93)'> <name>Neptunium</name> <atomicno>93</atomicno> <acronym>Np</acronym>";
    searchCode = searchCode + "<category class='Metal Inner_Transition_Metal Actinoid'>Actinoid</category> <grpprd>3-2/7</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(28)'> <name>Nickel</name> <atomicno>28</atomicno> <acronym>Ni</acronym>";
    searchCode = searchCode + "<category class='Metal Transition_Metal'>Transition Metal</category> <grpprd>10/4</grpprd></a></li><li><a onclick='Load_learnElem(41)'>";
    searchCode = searchCode + "<name>Niobium</name> <atomicno>41</atomicno> <acronym>Nb</acronym> <category class='Metal Transition_Metal'>Transition Metal</category>";
    searchCode = searchCode + "<grpprd>5/5</grpprd></a></li><li><a onclick='Load_learnElem(7)'> <name>Nitrogen</name> <atomicno>7</atomicno> <acronym>N</acronym>";
    searchCode = searchCode + "<category class='Nonmetal Other'>Other</category> <grpprd>15/2</grpprd></a></li><li><a onclick='Load_learnElem(102)'>";
    searchCode = searchCode + "<name>Nobelium</name> <atomicno>102</atomicno> <acronym>No</acronym> <category class='Metal Inner_Transition_Metal Actinoid'>Actinoid";
    searchCode = searchCode + "</category> <grpprd>3-2/7</grpprd></a></li><li><a onclick='Load_learnElem(76)'> <name>Osmium</name> <atomicno>76</atomicno>";
    searchCode = searchCode + "<acronym>Os</acronym> <category class='Metal Transition_Metal'>Transition Metal</category> <grpprd>8/6</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(8)'> <name>Oxygen</name> <atomicno>8</atomicno> <acronym>O</acronym> <category class='Nonmetal Other'>";
    searchCode = searchCode + "Other</category> <grpprd>16/2</grpprd></a></li><li><a onclick='Load_learnElem(46)'> <name>Palladium</name> <atomicno>46</atomicno>";
    searchCode = searchCode + "<acronym>Pd</acronym> <category class='Metal Transition_Metal'>Transition Metal</category> <grpprd>10/5</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(15)'> <name>Phosphorus</name> <atomicno>15</atomicno> <acronym>P</acronym>";
    searchCode = searchCode + "<category class='Nonmetal Other'>Other</category> <grpprd>15/3</grpprd></a></li><li><a onclick='Load_learnElem(78)'>";
    searchCode = searchCode + "<name>Platinum</name> <atomicno>78</atomicno> <acronym>Pt</acronym> <category class='Metal Transition_Metal'>Transition Metal</category>";
    searchCode = searchCode + " <grpprd>10/6</grpprd></a></li><li><a onclick='Load_learnElem(94)'> <name>Plutonium</name> <atomicno>94</atomicno> <acronym>Pu</acronym>";
    searchCode = searchCode + " <category class='Metal Inner_Transition_Metal Actinoid'>Actinoid</category> <grpprd>3-2/7</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(84)'> <name>Polonium</name> <atomicno>84</atomicno> <acronym>Po</acronym> <category class='Metalloid'>";
    searchCode = searchCode + "Metalloid</category> <grpprd>16/6</grpprd></a></li><li><a onclick='Load_learnElem(19)'> <name>Potassium</name> <atomicno>19</atomicno>";
    searchCode = searchCode + "<acronym>K</acronym> <category class='Metal Alkali_Metal'>Alkali Metal</category> <grpprd>1/4</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(59)'> <name>Praseodymium</name> <atomicno>59</atomicno> <acronym>Pr</acronym>";
    searchCode = searchCode + "<category class='Metal Inner_Transition_Metal Lanthanoide'>Lanthanoide</category> <grpprd>3-1/6</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(61)'> <name>Promethium</name> <atomicno>61</atomicno> <acronym>Pm</acronym>";
    searchCode = searchCode + "<category class='Metal Inner_Transition_Metal Lanthanoide'>Lanthanoide</category> <grpprd>3-1/6</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(91)'> <name>Protactinium</name> <atomicno>91</atomicno> <acronym>Pa</acronym>";
    searchCode = searchCode + "<category class='Metal Inner_Transition_Metal Actinoid'>Actinoid</category> <grpprd>3-2/7</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(88)'> <name>Radium</name> <atomicno>88</atomicno> <acronym>Ra</acronym>";
    searchCode = searchCode + "<category class='Metal Alkaline_Earth_Metal'>Alkaline Earth Metal</category> <grpprd>2/7</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(86)'> <name>Radon</name> <atomicno>86</atomicno> <acronym>Rn</acronym>";
    searchCode = searchCode + "<category class='Nonmetal Nobel_Gas'>Nobel Gas</category> <grpprd>18/6</grpprd></a></li><li><a onclick='Load_learnElem(75)'>";
    searchCode = searchCode + "<name>Rhenium</name> <atomicno>75</atomicno> <acronym>Re</acronym> <category class='Metal Transition_Metal'>Transition Metal</category>";
    searchCode = searchCode + "<grpprd>7/6</grpprd></a></li><li><a onclick='Load_learnElem(45)'> <name>Rhodium</name> <atomicno>45</atomicno> <acronym>Rh</acronym>";
    searchCode = searchCode + "<category class='Metal Transition_Metal'>Transition Metal</category> <grpprd>9/5</grpprd></a></li><li><a onclick='Load_learnElem(111)'> ";
    searchCode = searchCode + "<name>Roentgenium</name> <atomicno>111</atomicno> <acronym>Rg</acronym> <category class='Metal Transition_Metal'>Transition Metal";
    searchCode = searchCode + "</category> <grpprd>11/7</grpprd></a></li><li><a onclick='Load_learnElem(37)'> <name>Rubidium</name> <atomicno>37</atomicno>";
    searchCode = searchCode + "<acronym>Rb</acronym> <category class='Metal Alkali_Metal'>Alkali Metal</category> <grpprd>1/5</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(44)'> <name>Ruthenium</name> <atomicno>44</atomicno> <acronym>Ru</acronym>";
    searchCode = searchCode + "<category class='Metal Transition_Metal'>Transition Metal</category> <grpprd>8/5</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(104)'> <name>Rutherfordium</name> <atomicno>104</atomicno> <acronym>Rf</acronym>";
    searchCode = searchCode + "<category class='Metal Transition_Metal'>Transition Metal</category> <grpprd>4/7</grpprd></a></li><li><a onclick='Load_learnElem(62)'>";
    searchCode = searchCode + " <name>Samarium</name> <atomicno>62</atomicno> <acronym>Sm</acronym> <category class='Metal Inner_Transition_Metal Lanthanoide'>";
    searchCode = searchCode + "Lanthanoide</category> <grpprd>3-1/6</grpprd></a></li><li><a onclick='Load_learnElem(21)'> <name>Scandium</name>";
    searchCode = searchCode + "<atomicno>21</atomicno> <acronym>Sc</acronym> <category class='Metal Transition_Metal'>Transition Metal</category>";
    searchCode = searchCode + "<grpprd>3/4</grpprd></a></li><li><a onclick='Load_learnElem(106)'> <name>Seaborgium</name> <atomicno>106</atomicno>";
    searchCode = searchCode + "<acronym>Sg</acronym> <category class='Metal Transition_Metal'>Transition Metal</category> <grpprd>6/7</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(34)'> <name>Selenium</name> <atomicno>34</atomicno> <acronym>Se</acronym>";
    searchCode = searchCode + "<category class='Nonmetal Other'>Other</category> <grpprd>16/4</grpprd></a></li><li><a onclick='Load_learnElem(14)'>";
    searchCode = searchCode + "<name>Silicon</name> <atomicno>14</atomicno> <acronym>Si</acronym> <category class='Metalloid'>Metalloid</category>";
    searchCode = searchCode + "<grpprd>14/3</grpprd></a></li><li><a onclick='Load_learnElem(47)'> <name>Silver</name> <atomicno>47</atomicno> <acronym>Ag</acronym>";
    searchCode = searchCode + "<category class='Metal Transition_Metal'>Transition Metal</category> <grpprd>11/5</grpprd></a></li><li><a onclick='Load_learnElem(11)'>";
    searchCode = searchCode + " <name>Sodium</name> <atomicno>11</atomicno> <acronym>Na</acronym> <category class='Metal Alkali_Metal'>Alkali Metal</category> <grpprd>1/3</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(38)'> <name>Strontium</name> <atomicno>38</atomicno> <acronym>Sr</acronym>";
    searchCode = searchCode + "<category class='Metal Alkaline_Earth_Metal'>Alkaline Earth Metal</category> <grpprd>2/5</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(16)'> <name>Sulfur</name> <atomicno>16</atomicno> <acronym>S</acronym> <category class='Nonmetal Other'>";
    searchCode = searchCode + "Other</category> <grpprd>16/3</grpprd></a></li><li><a onclick='Load_learnElem(73)'> <name>Tantalum</name> <atomicno>73</atomicno> ";
    searchCode = searchCode + "<acronym>Ta</acronym> <category class='Metal Transition_Metal'>Transition Metal</category> <grpprd>5/6</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(43)'> <name>Technetium</name> <atomicno>43</atomicno> <acronym>Tc</acronym>";
    searchCode = searchCode + "<category class='Metal Transition_Metal'>Transition Metal</category> <grpprd>7/5</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(52)'> <name>Tellurium</name> <atomicno>52</atomicno> <acronym>Te</acronym><category class='Metalloid'>";
    searchCode = searchCode + "Metalloid</category> <grpprd>16/5</grpprd></a></li><li><a onclick='Load_learnElem(65)'> <name>Terbium</name> <atomicno>65</atomicno>";
    searchCode = searchCode + " <acronym>Tb</acronym> <category class='Metal Inner_Transition_Metal Lanthanoide'>Lanthanoide</category> <grpprd>3-1/6</grpprd></a>";
    searchCode = searchCode + "</li><li><a onclick='Load_learnElem(81)'> <name>Thallium</name> <atomicno>81</atomicno> <acronym>Tl</acronym> ";
    searchCode = searchCode + "<category class='Metal Post-transition_Metal'>Post-transition Metal</category> <grpprd>13/6</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(90)'> <name>Thorium</name> <atomicno>90</atomicno> <acronym>Th</acronym> <category class='Metal Inner_Transition_Metal Actinoid'>Actinoid</category>";
    searchCode = searchCode + "<grpprd>3-2/7</grpprd></a></li><li><a onclick='Load_learnElem(69)'> <name>Thulium</name> <atomicno>69</atomicno> <acronym>Tm</acronym>";
    searchCode = searchCode + "<category class='Metal Inner_Transition_Metal Lanthanoide'>Lanthanoide</category> <grpprd>3-1/6</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(50)'> <name>Tin</name> <atomicno>50</atomicno> <acronym>Sn</acronym>";
    searchCode = searchCode + "<category class='Metal Post-transition_Metal'>Post-transition Metal</category> <grpprd>14/5</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(22)'> <name>Titanium</name> <atomicno>22</atomicno> <acronym>Ti</acronym>";
    searchCode = searchCode + "<category class='Metal Transition_Metal'>Transition Metal</category> <grpprd>4/4</grpprd></a></li><li><a onclick='Load_learnElem(74)'>";
    searchCode = searchCode + " <name>Tungsten</name> <atomicno>74</atomicno> <acronym>W</acronym> <category class='Metal Transition_Metal'>Transition Metal</category>";
    searchCode = searchCode + " <grpprd>6/6</grpprd></a></li><li><a onclick='Load_learnElem(116)'> <name>Ununhexium</name> <atomicno>116</atomicno>";
    searchCode = searchCode + "<acronym>Uuh</acronym> <category class='Metal Post-transition_Metal'>Post-transition Metal</category> <grpprd>16/7</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(118)'> <name>Ununoctium</name> <atomicno>118</atomicno> <acronym>Uuo</acronym>";
    searchCode = searchCode + "<category class='Nonmetal Nobel_Gas'>Nobel Gas</category> <grpprd>18/7</grpprd></a></li><li><a onclick='Load_learnElem(115)'>";
    searchCode = searchCode + "<name>Ununpentium</name> <atomicno>115</atomicno> <acronym>Uup</acronym> <category class='Metal Post-transition_Metal'>Post-transition Metal</category>";
    searchCode = searchCode + " <grpprd>15/7</grpprd></a></li><li><a onclick='Load_learnElem(114)'> <name>Ununquadium</name> <atomicno>114</atomicno>";
    searchCode = searchCode + " <acronym>Uuq</acronym> <category class='Metal Post-transition_Metal'>Post-transition Metal</category> <grpprd>14/7</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(117)'> <name>Ununseptium</name> <atomicno>117</atomicno> <acronym>Uus</acronym>";
    searchCode = searchCode + "<category class='Nonmetal Halogen'>Halogen</category> <grpprd>17/7</grpprd></a></li><li><a onclick='Load_learnElem(113)'> <name>";
    searchCode = searchCode + "Ununtrium</name> <atomicno>113</atomicno> <acronym>Uut</acronym> <category class='Metal Post-transition_Metal'>Post-transition Metal";
    searchCode = searchCode + "</category> <grpprd>13/7</grpprd></a></li><li><a onclick='Load_learnElem(92)'> <name>Uranium</name> <atomicno>92</atomicno>";
    searchCode = searchCode + "<acronym>U</acronym> <category class='Metal Inner_Transition_Metal Actinoid'>Actinoid</category> <grpprd>3-2/7</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(23)'> <name>Vanadium</name> <atomicno>23</atomicno> <acronym>V</acronym>";
    searchCode = searchCode + "<category class='Metal Transition_Metal'>Transition Metal</category> <grpprd>5/4</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(54)'> <name>Xenon</name> <atomicno>54</atomicno> <acronym>Xe</acronym>";
    searchCode = searchCode + "<category class='Nonmetal Nobel_Gas'>Nobel Gas</category> <grpprd>18/5</grpprd></a></li><li><a onclick='Load_learnElem(70)'>";
    searchCode = searchCode + "<name>Ytterbium</name> <atomicno>70</atomicno> <acronym>Yb</acronym>";
    searchCode = searchCode + "<category class='Metal Inner_Transition_Metal Lanthanoide'>Lanthanoide</category> <grpprd>3-1/6</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(39)'> <name>Yttrium</name> <atomicno>39</atomicno> <acronym>Y</acronym>";
    searchCode = searchCode + "<category class='Metal Transition_Metal'>Transition Metal</category> <grpprd>3/5</grpprd></a></li>";
    searchCode = searchCode + "<li><a onclick='Load_learnElem(30)'> <name>Zinc</name> <atomicno>30</atomicno> <acronym>Zn</acronym> <category class='Metal Transition_Metal'>Transition Metal</category>";
    searchCode = searchCode + " <grpprd>12/4</grpprd></a></li><li><a onclick='Load_learnElem(40)'> <name>Zirconium</name> <atomicno>40</atomicno>";
    searchCode = searchCode + "<acronym>Zr</acronym> <category class='Metal Transition_Metal'>Transition Metal</category> <grpprd>4/5</grpprd></a></li></ul>";

    $("#searchID").html(searchCode);
}

$("#searchElemName").live('tap', function(event, ui) {
    isGrid = false;
    changeMobilePage('#pageSearch');
    toggleScreenEffectForPT('#darkLayerMenuPT');
    isMenuSelected = true;
});

$("#pageSearch").live('pagecreate', function(event, ui) {
    populateSearchList();
});


function createTable() {

    var tableCode = '<table id="PTtabID"><tbody><tr class="grpRow"><td width="5%">&nbsp;</td><th class="grp  col1" width="5%" id="1">1</th><th class="grp  col2" width="5%" id="2">2</th><th class="grp  col3" width="5%" id="3">3</th><th class="grp  col4" width="5%" id="4">4</th><th class="grp  col5" width="5%" id="5">5</th><th class="grp  col6" width="5%" id="6">6</th><th class="grp  col7" width="5%" id="7">7</th><th class="grp  col8" width="5%" id="8">8</th><th class="grp  col9" width="5%" id="9">9</th><th class="grp  col10" width="5%" id="10">10</th><th class="grp  col11" width="5%" id="11">11</th><th class="grp  col12" width="5%" id="12">12</th><th class="grp  col13" width="5%" id="13">13</th><th class="grp  col14" width="5%" id="14">14</th><th class="grp  col15" width="5%" id="15">15</th><th class="grp  col16" width="5%" id="16">16</th><th class="grp  col17" width="5%" id="17">17</th><th class="grp  col18" width="5%" id="18">18</th><td width="5%">&nbsp;</td></tr><tr height="width"><th class="prd">1</th><td class="Element Nonmetal Other col1" id="#an1"><div align="right"><atomicno>1</atomicno></div><acronym>H</acronym><name><br>Hydrogen</name><atomicwt><br>1.01</atomicwt></td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td class="Element Nonmetal Nobel_Gas col18" id="#an2"><div align="right"><atomicno>2</atomicno></div><acronym>He</acronym><name><br>Helium</name><atomicwt><br>4</atomicwt></td><th class="prd">1</th></tr><tr height="width"><th class="prd">2</th><td class="Element Metal Alkali_Metal col1" id="#an3"><div align="right"><atomicno>3</atomicno></div><acronym>Li</acronym><name><br>Lithium</name><atomicwt><br>6.94</atomicwt></td><td class="Element Metal Alkaline_Earth_Metal col2" id="#an4"><div align="right"><atomicno>4</atomicno></div><acronym>Be</acronym><name><br>Beryllium</name><atomicwt><br>9.01</atomicwt></td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td class="Element Metalloid col13" id="#an5"><div align="right"><atomicno>5</atomicno></div><acronym>B</acronym><name><br>Boron</name><atomicwt><br>10.81</atomicwt></td><td class="Element Nonmetal Other col14" id="#an6"><div align="right"><atomicno>6</atomicno></div><acronym>C</acronym><name><br>Carbon</name><atomicwt><br>12.01</atomicwt></td><td class="Element Nonmetal Other col15" id="#an7"><div align="right"><atomicno>7</atomicno></div><acronym>N</acronym><name><br>Nitrogen</name><atomicwt><br>14.01</atomicwt></td><td class="Element Nonmetal Other col16" id="#an8"><div align="right"><atomicno>8</atomicno></div><acronym>O</acronym><name><br>Oxygen</name><atomicwt><br>16</atomicwt></td><td class="Element Nonmetal Halogen col17" id="#an9"><div align="right"><atomicno>9</atomicno></div><acronym>F</acronym><name><br>Fluorine</name><atomicwt><br>19</atomicwt></td><td class="Element Nonmetal Nobel_Gas col18" id="#an10"><div align="right"><atomicno>10</atomicno></div><acronym>Ne</acronym><name><br>Neon</name><atomicwt><br>20.18</atomicwt></td><th class="prd">2</th></tr><tr height="width"><th class="prd">3</th><td class="Element Metal Alkali_Metal col1" id="#an11"><div align="right"><atomicno>11</atomicno></div><acronym>Na</acronym><name><br>Sodium</name><atomicwt><br>22.99</atomicwt></td><td class="Element Metal Alkaline_Earth_Metal col2" id="#an12"><div align="right"><atomicno>12</atomicno></div><acronym>Mg</acronym><name><br>Magnesium</name><atomicwt><br>24.31</atomicwt></td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td class="Element Metal Post-transition_Metal col13" id="#an13"><div align="right"><atomicno>13</atomicno></div><acronym>Al</acronym><name><br>Aluminium</name><atomicwt><br>26.98</atomicwt></td><td class="Element Metalloid col14" id="#an14"><div align="right"><atomicno>14</atomicno></div><acronym>Si</acronym><name><br>Silicon</name><atomicwt><br>28.09</atomicwt></td><td class="Element Nonmetal Other col15" id="#an15"><div align="right"><atomicno>15</atomicno></div><acronym>P</acronym><name><br>Phosphorus</name><atomicwt><br>30.97</atomicwt></td><td class="Element Nonmetal Other col16" id="#an16"><div align="right"><atomicno>16</atomicno></div><acronym>S</acronym><name><br>Sulfur</name><atomicwt><br>32.07</atomicwt></td><td class="Element Nonmetal Halogen col17" id="#an17"><div align="right"><atomicno>17</atomicno></div><acronym>Cl</acronym><name><br>Chlorine</name><atomicwt><br>35.45</atomicwt></td><td class="Element Nonmetal Nobel_Gas col18" id="#an18"><div align="right"><atomicno>18</atomicno></div><acronym>Ar</acronym><name><br>Argon</name><atomicwt><br>39.95</atomicwt></td><th class="prd">3</th></tr><tr height="width"><th class="prd">4</th><td class="Element Metal Alkali_Metal col1" id="#an19"><div align="right"><atomicno>19</atomicno></div><acronym>K</acronym><name><br>Potassium</name><atomicwt><br>39.1</atomicwt></td><td class="Element Metal Alkaline_Earth_Metal col2" id="#an20"><div align="right"><atomicno>20</atomicno></div><acronym>Ca</acronym><name><br>Calcium</name><atomicwt><br>40.08</atomicwt></td><td class="Element Metal Transition_Metal col3" id="#an21"><div align="right"><atomicno>21</atomicno></div><acronym>Sc</acronym><name><br>Scandium</name><atomicwt><br>44.96</atomicwt></td><td class="Element Metal Transition_Metal col4" id="#an22"><div align="right"><atomicno>22</atomicno></div><acronym>Ti</acronym><name><br>Titanium</name><atomicwt><br>47.87</atomicwt></td><td class="Element Metal Transition_Metal col5" id="#an23"><div align="right"><atomicno>23</atomicno></div><acronym>V</acronym><name><br>Vanadium</name><atomicwt><br>50.94</atomicwt></td><td class="Element Metal Transition_Metal col6" id="#an24"><div align="right"><atomicno>24</atomicno></div><acronym>Cr</acronym><name><br>Chromium</name><atomicwt><br>52</atomicwt></td><td class="Element Metal Transition_Metal col7" id="#an25"><div align="right"><atomicno>25</atomicno></div><acronym>Mn</acronym><name><br>Manganese</name><atomicwt><br>54.94</atomicwt></td><td class="Element Metal Transition_Metal col8" id="#an26"><div align="right"><atomicno>26</atomicno></div><acronym>Fe</acronym><name><br>Iron</name><atomicwt><br>55.85</atomicwt></td><td class="Element Metal Transition_Metal col9" id="#an27"><div align="right"><atomicno>27</atomicno></div><acronym>Co</acronym><name><br>Cobalt</name><atomicwt><br>58.93</atomicwt></td><td class="Element Metal Transition_Metal col10" id="#an28"><div align="right"><atomicno>28</atomicno></div><acronym>Ni</acronym><name><br>Nickel</name><atomicwt><br>58.69</atomicwt></td><td class="Element Metal Transition_Metal col11" id="#an29"><div align="right"><atomicno>29</atomicno></div><acronym>Cu</acronym><name><br>Copper</name><atomicwt><br>63.55</atomicwt></td><td class="Element Metal Transition_Metal col12" id="#an30"><div align="right"><atomicno>30</atomicno></div><acronym>Zn</acronym><name><br>Zinc</name><atomicwt><br>65.38</atomicwt></td><td class="Element Metal Post-transition_Metal col13" id="#an31"><div align="right"><atomicno>31</atomicno></div><acronym>Ga</acronym><name><br>Gallium</name><atomicwt><br>69.72</atomicwt></td><td class="Element Metalloid col14" id="#an32"><div align="right"><atomicno>32</atomicno></div><acronym>Ge</acronym><name><br>Germanium</name><atomicwt><br>72.64</atomicwt></td><td class="Element Metalloid col15" id="#an33"><div align="right"><atomicno>33</atomicno></div><acronym>As</acronym><name><br>Arsenic</name><atomicwt><br>74.92</atomicwt></td><td class="Element Nonmetal Other col16" id="#an34"><div align="right"><atomicno>34</atomicno></div><acronym>Se</acronym><name><br>Selenium</name><atomicwt><br>78.96</atomicwt></td><td class="Element Nonmetal Halogen col17" id="#an35"><div align="right"><atomicno>35</atomicno></div><acronym>Br</acronym><name><br>Bromine</name><atomicwt><br>79.9</atomicwt></td><td class="Element Nonmetal Nobel_Gas col18" id="#an36"><div align="right"><atomicno>36</atomicno></div><acronym>Kr</acronym><name><br>Krypton</name><atomicwt><br>83.8</atomicwt></td><th class="prd">4</th></tr><tr height="width"><th class="prd">5</th><td class="Element Metal Alkali_Metal col1" id="#an37"><div align="right"><atomicno>37</atomicno></div><acronym>Rb</acronym><name><br>Rubidium</name><atomicwt><br>85.47</atomicwt></td><td class="Element Metal Alkaline_Earth_Metal col2" id="#an38"><div align="right"><atomicno>38</atomicno></div><acronym>Sr</acronym><name><br>Strontium</name><atomicwt><br>87.62</atomicwt></td><td class="Element Metal Transition_Metal col3" id="#an39"><div align="right"><atomicno>39</atomicno></div><acronym>Y</acronym><name><br>Yttrium</name><atomicwt><br>88.91</atomicwt></td><td class="Element Metal Transition_Metal col4" id="#an40"><div align="right"><atomicno>40</atomicno></div><acronym>Zr</acronym><name><br>Zirconium</name><atomicwt><br>91.22</atomicwt></td><td class="Element Metal Transition_Metal col5" id="#an41"><div align="right"><atomicno>41</atomicno></div><acronym>Nb</acronym><name><br>Niobium</name><atomicwt><br>92.91</atomicwt></td><td class="Element Metal Transition_Metal col6" id="#an42"><div align="right"><atomicno>42</atomicno></div><acronym>Mo</acronym><name><br>Molybdenum</name><atomicwt><br>95.96</atomicwt></td><td class="Element Metal Transition_Metal col7" id="#an43"><div align="right"><atomicno>43</atomicno></div><acronym>Tc</acronym><name><br>Technetium</name><atomicwt><br>[98]</atomicwt></td><td class="Element Metal Transition_Metal col8" id="#an44"><div align="right"><atomicno>44</atomicno></div><acronym>Ru</acronym><name><br>Ruthenium</name><atomicwt><br>101.07</atomicwt></td><td class="Element Metal Transition_Metal col9" id="#an45"><div align="right"><atomicno>45</atomicno></div><acronym>Rh</acronym><name><br>Rhodium</name><atomicwt><br>102.91</atomicwt></td><td class="Element Metal Transition_Metal col10" id="#an46"><div align="right"><atomicno>46</atomicno></div><acronym>Pd</acronym><name><br>Palladium</name><atomicwt><br>106.42</atomicwt></td><td class="Element Metal Transition_Metal col11" id="#an47"><div align="right"><atomicno>47</atomicno></div><acronym>Ag</acronym><name><br>Silver</name><atomicwt><br>107.87</atomicwt></td><td class="Element Metal Transition_Metal col12" id="#an48"><div align="right"><atomicno>48</atomicno></div><acronym>Cd</acronym><name><br>Cadmium</name><atomicwt><br>112.41</atomicwt></td><td class="Element Metal Post-transition_Metal col13" id="#an49"><div align="right"><atomicno>49</atomicno></div><acronym>In</acronym><name><br>Indium</name><atomicwt><br>114.82</atomicwt></td><td class="Element Metal Post-transition_Metal col14" id="#an50"><div align="right"><atomicno>50</atomicno></div><acronym>Sn</acronym><name><br>Tin</name><atomicwt><br>118.71</atomicwt></td><td class="Element Metalloid col15" id="#an51"><div align="right"><atomicno>51</atomicno></div><acronym>Sb</acronym><name><br>Antimony</name><atomicwt><br>121.76</atomicwt></td><td class="Element Metalloid col16" id="#an52"><div align="right"><atomicno>52</atomicno></div><acronym>Te</acronym><name><br>Tellurium</name><atomicwt><br>127.6</atomicwt></td><td class="Element Nonmetal Halogen col17" id="#an53"><div align="right"><atomicno>53</atomicno></div><acronym>I</acronym><name><br>Iodine</name><atomicwt><br>126.9</atomicwt></td><td class="Element Nonmetal Nobel_Gas col18" id="#an54"><div align="right"><atomicno>54</atomicno></div><acronym>Xe</acronym><name><br>Xenon</name><atomicwt><br>131.29</atomicwt></td><th class="prd">5</th></tr><tr height="width"><th class="prd">6</th><td class="Element Metal Alkali_Metal col1" id="#an55"><div align="right"><atomicno>55</atomicno></div><acronym>Cs</acronym><name><br>Caesium</name><atomicwt><br>132.91</atomicwt></td><td class="Element Metal Alkaline_Earth_Metal col2" id="#an56"><div align="right"><atomicno>56</atomicno></div><acronym>Ba</acronym><name><br>Barium</name><atomicwt><br>137.33</atomicwt></td><td class="Element Metal Inner_Transition_Metal Lanthanoide col3" id="#an57"><div align="right"><atomicno>57</atomicno></div><acronym>La</acronym><name><br>Lanthanum</name><atomicwt><br>138.91</atomicwt></td><td class="Element Metal Transition_Metal col4" id="#an72"><div align="right"><atomicno>72</atomicno></div><acronym>Hf</acronym><name><br>Hafnium</name><atomicwt><br>178.49</atomicwt></td><td class="Element Metal Transition_Metal col5" id="#an73"><div align="right"><atomicno>73</atomicno></div><acronym>Ta</acronym><name><br>Tantalum</name><atomicwt><br>180.95</atomicwt></td><td class="Element Metal Transition_Metal col6" id="#an74"><div align="right"><atomicno>74</atomicno></div><acronym>W</acronym><name><br>Tungsten</name><atomicwt><br>183.84</atomicwt></td><td class="Element Metal Transition_Metal col7" id="#an75"><div align="right"><atomicno>75</atomicno></div><acronym>Re</acronym><name><br>Rhenium</name><atomicwt><br>186.21</atomicwt></td><td class="Element Metal Transition_Metal col8" id="#an76"><div align="right"><atomicno>76</atomicno></div><acronym>Os</acronym><name><br>Osmium</name><atomicwt><br>190.23</atomicwt></td><td class="Element Metal Transition_Metal col9" id="#an77"><div align="right"><atomicno>77</atomicno></div><acronym>Ir</acronym><name><br>Iridium</name><atomicwt><br>192.22</atomicwt></td><td class="Element Metal Transition_Metal col10" id="#an78"><div align="right"><atomicno>78</atomicno></div><acronym>Pt</acronym><name><br>Platinum</name><atomicwt><br>195.08</atomicwt></td><td class="Element Metal Transition_Metal col11" id="#an79"><div align="right"><atomicno>79</atomicno></div><acronym>Au</acronym><name><br>Gold</name><atomicwt><br>196.97</atomicwt></td><td class="Element Metal Transition_Metal col12" id="#an80"><div align="right"><atomicno>80</atomicno></div><acronym>Hg</acronym><name><br>Mercury</name><atomicwt><br>200.59</atomicwt></td><td class="Element Metal Post-transition_Metal col13" id="#an81"><div align="right"><atomicno>81</atomicno></div><acronym>Tl</acronym><name><br>Thallium</name><atomicwt><br>204.38</atomicwt></td><td class="Element Metal Post-transition_Metal col14" id="#an82"><div align="right"><atomicno>82</atomicno></div><acronym>Pb</acronym><name><br>Lead</name><atomicwt><br>207.2</atomicwt></td><td class="Element Metal Post-transition_Metal col15" id="#an83"><div align="right"><atomicno>83</atomicno></div><acronym>Bi</acronym><name><br>Bismuth</name><atomicwt><br>208.98</atomicwt></td><td class="Element Metalloid col16" id="#an84"><div align="right"><atomicno>84</atomicno></div><acronym>Po</acronym><name><br>Polonium</name><atomicwt><br>[210]</atomicwt></td><td class="Element Nonmetal Halogen col17" id="#an85"><div align="right"><atomicno>85</atomicno></div><acronym>At</acronym><name><br>Astatine</name><atomicwt><br>[210]</atomicwt></td><td class="Element Nonmetal Nobel_Gas col18" id="#an86"><div align="right"><atomicno>86</atomicno></div><acronym>Rn</acronym><name><br>Radon</name><atomicwt><br>[222]</atomicwt></td><th class="prd">6</th></tr><tr height="width"><th class="prd">7</th><td class="Element Metal Alkali_Metal col1" id="#an87"><div align="right"><atomicno>87</atomicno></div><acronym>Fr</acronym><name><br>Francium</name><atomicwt><br>[223]</atomicwt></td><td class="Element Metal Alkaline_Earth_Metal col2" id="#an88"><div align="right"><atomicno>88</atomicno></div><acronym>Ra</acronym><name><br>Radium</name><atomicwt><br>[226]</atomicwt></td><td class="Element Metal Inner_Transition_Metal Actinoid col3" id="#an89"><div align="right"><atomicno>89</atomicno></div><acronym>Ac</acronym><name><br>Actinium</name><atomicwt><br>[227]</atomicwt></td><td class="Element Metal Transition_Metal col4" id="#an104"><div align="right"><atomicno>104</atomicno></div><acronym>Rf</acronym><name><br>Rutherfordium</name><atomicwt><br>[261]</atomicwt></td><td class="Element Metal Transition_Metal col5" id="#an105"><div align="right"><atomicno>105</atomicno></div><acronym>Db</acronym><name><br>Dubnium</name><atomicwt><br>[262]</atomicwt></td><td class="Element Metal Transition_Metal col6" id="#an106"><div align="right"><atomicno>106</atomicno></div><acronym>Sg</acronym><name><br>Seaborgium</name><atomicwt><br>[266]</atomicwt></td><td class="Element Metal Transition_Metal col7" id="#an107"><div align="right"><atomicno>107</atomicno></div><acronym>Bh</acronym><name><br>Bohrium</name><atomicwt><br>[264]</atomicwt></td><td class="Element Metal Transition_Metal col8" id="#an108"><div align="right"><atomicno>108</atomicno></div><acronym>Hs</acronym><name><br>Hassium</name><atomicwt><br>[267]</atomicwt></td><td class="Element Metal Transition_Metal col9" id="#an109"><div align="right"><atomicno>109</atomicno></div><acronym>Mt</acronym><name><br>Meitnerium</name><atomicwt><br>[268]</atomicwt></td><td class="Element Metal Transition_Metal col10" id="#an110"><div align="right"><atomicno>110</atomicno></div><acronym>Ds</acronym><name><br>Darmstadtium</name><atomicwt><br>[271]</atomicwt></td><td class="Element Metal Transition_Metal col11" id="#an111"><div align="right"><atomicno>111</atomicno></div><acronym>Rg</acronym><name><br>Roentgenium</name><atomicwt><br>[272]</atomicwt></td><td class="Element Metal Transition_Metal col12" id="#an112"><div align="right"><atomicno>112</atomicno></div><acronym>Cn</acronym><name><br>Copernicium</name><atomicwt><br>[285]</atomicwt></td><td class="Element Metal Post-transition_Metal col13" id="#an113"><div align="right"><atomicno>113</atomicno></div><acronym>Uut</acronym><name><br>Ununtrium</name><atomicwt><br>[284]</atomicwt></td><td class="Element Metal Post-transition_Metal col14" id="#an114"><div align="right"><atomicno>114</atomicno></div><acronym>Uuq</acronym><name><br>Ununquadium</name><atomicwt><br>[289]</atomicwt></td><td class="Element Metal Post-transition_Metal col15" id="#an115"><div align="right"><atomicno>115</atomicno></div><acronym>Uup</acronym><name><br>Ununpentium</name><atomicwt><br>[288]</atomicwt></td><td class="Element Metal Post-transition_Metal col16" id="#an116"><div align="right"><atomicno>116</atomicno></div><acronym>Uuh</acronym><name><br>Ununhexium</name><atomicwt><br>[292]</atomicwt></td><td class="Element Nonmetal Halogen col17" id="#an117"><div align="right"><atomicno>117</atomicno></div><acronym>Uus</acronym><name><br>Ununseptium</name><atomicwt><br>[295]</atomicwt></td><td class="Element Nonmetal Nobel_Gas col18" id="#an118"><div align="right"><atomicno>118</atomicno></div><acronym>Uuo</acronym><name><br>Ununoctium</name><atomicwt><br>[294]</atomicwt></td><th class="prd">7</th></tr><tr class="grpRow"><td>&nbsp;</td><th class="grp  col1" width="5%">1</th><th class="grp  col2" width="5%">2</th><th class="grp  col3" width="5%">3</th><th class="grp  col4" width="5%">4</th><th class="grp  col5" width="5%">5</th><th class="grp  col6" width="5%">6</th><th class="grp  col7" width="5%">7</th><th class="grp  col8" width="5%">8</th><th class="grp  col9" width="5%">9</th><th class="grp  col10" width="5%">10</th><th class="grp  col11" width="5%">11</th><th class="grp  col12" width="5%">12</th><th class="grp  col13" width="5%">13</th><th class="grp  col14" width="5%">14</th><th class="grp  col15" width="5%">15</th><th class="grp  col16" width="5%">16</th><th class="grp  col17" width="5%">17</th><th class="grp  col18" width="5%">18</th></tr><tr class="blankRow"><td>&nbsp;</td><td colspan="18">&nbsp;</td></tr><tr class="grpRow"><td>&nbsp;</td><td colspan="3">&nbsp;</td><th class="grp">3</th><th class="grp">3</th><th class="grp">3</th><th class="grp">3</th><th class="grp">3</th><th class="grp">3</th><th class="grp">3</th><th class="grp">3</th><th class="grp">3</th><th class="grp">3</th><th class="grp">3</th><th class="grp">3</th><th class="grp">3</th><th class="grp">3</th><th class="grp">3</th></tr><tr><td>&nbsp;</td><td colspan="2">&nbsp;</td><th class="prd" align="right">6</th><td class="Element Metal Inner_Transition_Metal Lanthanoide col3" id="#an57"><atomicno>57<br></atomicno><acronym>La</acronym><name><br>Lanthanum</name><atomicwt><br>138.91</atomicwt></td><td class="Element Metal Inner_Transition_Metal Lanthanoide col3" id="#an58"><atomicno>58<br></atomicno><acronym>Ce</acronym><name><br>Cerium</name><atomicwt><br>140.12</atomicwt></td><td class="Element Metal Inner_Transition_Metal Lanthanoide col3" id="#an59"><atomicno>59<br></atomicno><acronym>Pr</acronym><name><br>Praseodymium</name><atomicwt><br>140.91</atomicwt></td><td class="Element Metal Inner_Transition_Metal Lanthanoide col3" id="#an60"><atomicno>60<br></atomicno><acronym>Nd</acronym><name><br>Neodymium</name><atomicwt><br>144.24</atomicwt></td><td class="Element Metal Inner_Transition_Metal Lanthanoide col3" id="#an61"><atomicno>61<br></atomicno><acronym>Pm</acronym><name><br>Promethium</name><atomicwt><br>[145]</atomicwt></td><td class="Element Metal Inner_Transition_Metal Lanthanoide col3" id="#an62"><atomicno>62<br></atomicno><acronym>Sm</acronym><name><br>Samarium</name><atomicwt><br>150.36</atomicwt></td><td class="Element Metal Inner_Transition_Metal Lanthanoide col3" id="#an63"><atomicno>63<br></atomicno><acronym>Eu</acronym><name><br>Europium</name><atomicwt><br>151.96</atomicwt></td><td class="Element Metal Inner_Transition_Metal Lanthanoide col3" id="#an64"><atomicno>64<br></atomicno><acronym>Gd</acronym><name><br>Gadolinium</name><atomicwt><br>157.25</atomicwt></td><td class="Element Metal Inner_Transition_Metal Lanthanoide col3" id="#an65"><atomicno>65<br></atomicno><acronym>Tb</acronym><name><br>Terbium</name><atomicwt><br>158.93</atomicwt></td><td class="Element Metal Inner_Transition_Metal Lanthanoide col3" id="#an66"><atomicno>66<br></atomicno><acronym>Dy</acronym><name><br>Dysprosium</name><atomicwt><br>162.5</atomicwt></td><td class="Element Metal Inner_Transition_Metal Lanthanoide col3" id="#an67"><atomicno>67<br></atomicno><acronym>Ho</acronym><name><br>Holmium</name><atomicwt><br>164.93</atomicwt></td><td class="Element Metal Inner_Transition_Metal Lanthanoide col3" id="#an68"><atomicno>68<br></atomicno><acronym>Er</acronym><name><br>Erbium</name><atomicwt><br>167.26</atomicwt></td><td class="Element Metal Inner_Transition_Metal Lanthanoide col3" id="#an69"><atomicno>69<br></atomicno><acronym>Tm</acronym><name><br>Thulium</name><atomicwt><br>168.93</atomicwt></td><td class="Element Metal Inner_Transition_Metal Lanthanoide col3" id="#an70"><atomicno>70<br></atomicno><acronym>Yb</acronym><name><br>Ytterbium</name><atomicwt><br>173.05</atomicwt></td><td class="Element Metal Inner_Transition_Metal Lanthanoide col3" id="#an71"><atomicno>71<br></atomicno><acronym>Lu</acronym><name><br>Lutetium</name><atomicwt><br>174.97</atomicwt></td><th class="prd" align="left">6</th></tr><tr><td>&nbsp;</td><td colspan="2">&nbsp;</td><th class="prd" align="right">7</th><td class="Element Metal Inner_Transition_Metal Actinoid col3" id="#an89"><atomicno>89<br></atomicno><acronym>Ac</acronym><name><br>Actinium</name><atomicwt><br>[227]</atomicwt></td><td class="Element Metal Inner_Transition_Metal Actinoid col3" id="#an90"><atomicno>90<br></atomicno><acronym>Th</acronym><name><br>Thorium</name><atomicwt><br>232.04</atomicwt></td><td class="Element Metal Inner_Transition_Metal Actinoid col3" id="#an91"><atomicno>91<br></atomicno><acronym>Pa</acronym><name><br>Protactinium</name><atomicwt><br>231.04</atomicwt></td><td class="Element Metal Inner_Transition_Metal Actinoid col3" id="#an92"><atomicno>92<br></atomicno><acronym>U</acronym><name><br>Uranium</name><atomicwt><br>238.03</atomicwt></td><td class="Element Metal Inner_Transition_Metal Actinoid col3" id="#an93"><atomicno>93<br></atomicno><acronym>Np</acronym><name><br>Neptunium</name><atomicwt><br>[237]</atomicwt></td><td class="Element Metal Inner_Transition_Metal Actinoid col3" id="#an94"><atomicno>94<br></atomicno><acronym>Pu</acronym><name><br>Plutonium</name><atomicwt><br>[244]</atomicwt></td><td class="Element Metal Inner_Transition_Metal Actinoid col3" id="#an95"><atomicno>95<br></atomicno><acronym>Am</acronym><name><br>Americium</name><atomicwt><br>[243]</atomicwt></td><td class="Element Metal Inner_Transition_Metal Actinoid col3" id="#an96"><atomicno>96<br></atomicno><acronym>Cm</acronym><name><br>Curium</name><atomicwt><br>[247]</atomicwt></td><td class="Element Metal Inner_Transition_Metal Actinoid col3" id="#an97"><atomicno>97<br></atomicno><acronym>Bk</acronym><name><br>Berkelium</name><atomicwt><br>[247]</atomicwt></td><td class="Element Metal Inner_Transition_Metal Actinoid col3" id="#an98"><atomicno>98<br></atomicno><acronym>Cf</acronym><name><br>Californium</name><atomicwt><br>[251]</atomicwt></td><td class="Element Metal Inner_Transition_Metal Actinoid col3" id="#an99"><atomicno>99<br></atomicno><acronym>Es</acronym><name><br>Einsteinium</name><atomicwt><br>[252]</atomicwt></td><td class="Element Metal Inner_Transition_Metal Actinoid col3" id="#an100"><atomicno>100<br></atomicno><acronym>Fm</acronym><name><br>Fermium</name><atomicwt><br>[257]</atomicwt></td><td class="Element Metal Inner_Transition_Metal Actinoid col3" id="#an101"><atomicno>101<br></atomicno><acronym>Md</acronym><name><br>Mendelevium</name><atomicwt><br>[258]</atomicwt></td><td class="Element Metal Inner_Transition_Metal Actinoid col3" id="#an102"><atomicno>102<br></atomicno><acronym>No</acronym><name><br>Nobelium</name><atomicwt><br>[259]</atomicwt></td><td class="Element Metal Inner_Transition_Metal Actinoid col3" id="#an103"><atomicno>103<br></atomicno><acronym>Lr</acronym><name><br>Lawrencium</name><atomicwt><br>[262]</atomicwt></td><th class="prd" align="left">7</th></tr><tr class="grpRow"><td>&nbsp;</td><td colspan="3">&nbsp;</td><th class="grp">3</th><th class="grp">3</th><th class="grp">3</th><th class="grp">3</th><th class="grp">3</th><th class="grp">3</th><th class="grp">3</th><th class="grp">3</th><th class="grp">3</th><th class="grp">3</th><th class="grp">3</th><th class="grp">3</th><th class="grp">3</th><th class="grp">3</th><th class="grp">3</th></tr></tbody></table>'

    $("#tableID").html(tableCode);

}
