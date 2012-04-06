var tmpStr = "";

var tab = new Array(20);
for (var i = 0; i < 20; i++) {
    tab[i] = new Array(20);
}

var tabL = new Array(15);
var tabA = new Array(15);
var iL = 0, iA = 0;

var elemName = new Array(118);

var elemN = new Array(118);

$(document).ready(function() {
    populateTable();
    if ($('div').width() < 320) {
        populateList320();
    } else {
        populateList();
    }
});

function populateList() {

    for (elem = 1; elem < 119; elem++) {
        elemName[elements[elem][3]] = elem;
        elemN.push(elements[elem][3]);

        if (elements[elem][7] == "-") {
            elements[elem][7] = "<na>n.a.</na>";
        }
        if (elements[elem][8] == "-") {
            elements[elem][8] = "<na>n.a.</na>";
        }
        if (elements[elem][9] == "-") {
            elements[elem][9] = "<na>n.a.</na>";
        }
        if (elements[elem][10] == "-") {
            elements[elem][10] = "<na>n.a.</na>";
        }
        if (elements[elem][11] == "-") {
            elements[elem][11] = "<na>n.a.</na>";
        }

    }

    var temp1 = "";
    var listN = "";

    listN += "<ul id='listN' data-role='listview'  data-filter='true'>";
    listN += "<li>";
    listN += "<name>Name</name>";
    listN += " <atomicno>No.</atomicno>";
    listN += " <acronym>Sym</acronym>";
    listN += " <category>Category</category>";
    listN += " <grpprd>Group/Period</grpprd>";
    listN += "</li>";
    for (i in elemN.sort()) {
        try {
            var tmpCat = elements[elemName[elemN[i]]][1].replace(/.* /, "");
            tmpCat = tmpCat.replace(/_/g, " ");

            temp1 = temp1 + "//" + elemN[i] + "/" + elemName[elemN[i]];
            listN += "<li>";
            listN += "<a onclick='Load_learnElem(" + elemName[elemN[i]] + ")'>";
            listN += " <name>" + elemN[i] + "</name>";
            listN += " <atomicno>" + elemName[elemN[i]] + "</atomicno>";
            listN += " <acronym>" + elements[elemName[elemN[i]]][2] + "</acronym>";
            listN += " <category class='" + elements[elemName[elemN[i]]][1] + "'>" + tmpCat + "</category>";
            listN += " <grpprd>" + elements[elemName[elemN[i]]][4] + "";
            listN += "/" + elements[elemName[elemN[i]]][5] + "</grpprd>";

            listN += "</a>";
            listN += "</li>";
        } catch (ex) { }
    }
    listN += "</ul>";
    $('#searchID').html(listN);


};


function populateList320() {

    for (elem = 1; elem < 119; elem++) {
        elemName[elements[elem][3]] = elem;
        elemN.push(elements[elem][3]);

        if (elements[elem][7] == "-") {
            elements[elem][7] = "<na>n.a.</na>";
        }
        if (elements[elem][8] == "-") {
            elements[elem][8] = "<na>n.a.</na>";
        }
        if (elements[elem][9] == "-") {
            elements[elem][9] = "<na>n.a.</na>";
        }
        if (elements[elem][10] == "-") {
            elements[elem][10] = "<na>n.a.</na>";
        }
        if (elements[elem][11] == "-") {
            elements[elem][11] = "<na>n.a.</na>";
        }

    }

    var temp1 = "";
    var listN = "";

    listN += "<ul id='listN' data-role='listview'  data-filter='true'>";
    listN += "<li>";
    listN += "<name>Name</name>";
    listN += " <atomicno>No.</atomicno>";
    listN += " <acronym>Sym</acronym>";
    listN += " <category>Category</category>";
    listN += " <grpprd>Group/Period</grpprd>";
    listN += "</li>";
    for (i in elemN.sort()) {
        try {
            var tmpCat = elements[elemName[elemN[i]]][1].replace(/.* /, "");
            tmpCat = tmpCat.replace(/_/g, " ");

            temp1 = temp1 + "//" + elemN[i] + "/" + elemName[elemN[i]];
            listN += "<li>";
            listN += "<a onclick='Load_learnElem(" + elemName[elemN[i]] + ")'>";
            listN += " <name>" + elemN[i] + "</name>";
            listN += " <atomicno>" + elemName[elemN[i]] + "</atomicno>";
            listN += " <acronym>" + elements[elemName[elemN[i]]][2] + "</acronym>";
            listN += " <category>" + tmpCat + "</category>";
            listN += " <grpprd>" + elements[elemName[elemN[i]]][4] + "";
            listN += "/" + elements[elemName[elemN[i]]][5] + "</grpprd>";

            listN += "</a>";
            listN += "</li>";
        } catch (ex) { }
    }
    listN += "</ul>";
    $('#searchID').html(listN);


};


function populateTable() {

    for (elem = 1; elem < 119; elem++) {

        var patt1 = new RegExp('\\[');
        if (patt1.test(elements[elem][6])) {
        }
        else {
            elements[elem][6] = elements[elem][6].replace(/\(.*\)/, "");
            //elements[elem][6] = Math.round(elements[elem][6]*100)/100;
        }

        if (elements[elem][4] != "3-1" && elements[elem][4] != "3-2") {
            tab[elements[elem][5]][elements[elem][4]] = elem;
        }
        else if (elements[elem][4] == "3-1") {
            tabL[iL] = elem;
            iL++;
            tab[elements[elem][5]][3] = "57";
        }
        else if (elements[elem][4] == "3-2") {
            tabA[iA] = elem;
            iA++;
            tab[elements[elem][5]][3] = "89";
        }
    }
    var tmpStr = "<table id='PTtabID'>";
    tmpStr += "<tr class='grpRow'>";
    tmpStr += "<td width='5%' >&nbsp;</td>";
    for (c = 1; c <= 18; c++) {
        tmpStr += "<th class='grp ";
        tmpStr += " col" + c;
        tmpStr += "' width='5%' id='" + c + "'>" + c + "</th>";
    }
    tmpStr += "<td width='5%' >&nbsp;</td>";
    tmpStr += "</tr>";

    for (r = 1; r <= 7; r++) {
        tmpStr += "<tr height=width>";
        tmpStr += "<th class='prd'>" + r + "</th>";
        for (c = 1; c <= 18; c++) {
            if (tab[r][c] == undefined) {
                tmpStr += "<td>" + "&nbsp;" + "</td>";
            }
            else {
                var atwt = Math.round(elements[tab[r][c]][6] * 100) / 100;
                tmpStr += "<td class='Element ";
                tmpStr += elements[tab[r][c]][1] + " col";
                tmpStr += c + "' ";
                tmpStr += "id='#an" + tab[r][c];
                tmpStr += "'>";
                tmpStr += "<div align='right'><atomicno>" + tab[r][c] + "</atomicno></div>";
                tmpStr += "<acronym>" + elements[tab[r][c]][2] + "</acronym>";
                tmpStr += "<name><br/>" + elements[tab[r][c]][3] + "</name>";
                tmpStr += "<atomicwt><br/>" + atwt + "</atomicwt>";
                tmpStr += "</td>";
            }
        }
        tmpStr += "<th class='prd'>" + r + "</th>";
        tmpStr += "</tr>";
    }

    tmpStr += "<tr  class='grpRow'>";
    tmpStr += "<td>" + "&nbsp;" + "</td>";
    for (c = 1; c <= 18; c++) {
        tmpStr += "<th class='grp ";
        tmpStr += " col" + c;
        tmpStr += "' width='5%'>" + c + "</th>";
    }
    tmpStr += "</tr>";

    tmpStr += "<tr class='blankRow'>";
    tmpStr += "<td>&nbsp;</td>";
    tmpStr += "<td colspan='18'>&nbsp;</td>";
    tmpStr += "</tr>";

    tmpStr += "<tr class='grpRow'>";
    tmpStr += "<td>&nbsp;</td>";
    tmpStr += "<td colspan='3'>&nbsp;</td>";
    for (e in tabL) {
        tmpStr += "<th class='grp'>3</th>"; ;
    }
    tmpStr += "</tr>";

    tmpStr += "<tr>";
    tmpStr += "<td>&nbsp;</td>";
    tmpStr += "<td colspan='2'>&nbsp;</td>";
    tmpStr += "<th class='prd' align='right'>6</th>";
    for (e in tabL) {
        try {
            c = 3;
            r = 6;
            var atwt = Math.round(elements[tabL[e]][6] * 100) / 100;
            tmpStr += "<td class='Element ";
            tmpStr += elements[tabL[e]][1] + " col";
            tmpStr += c + "' ";
            tmpStr += "id='#an" + tabL[e];
            tmpStr += "'>";
            tmpStr += "<atomicno>" + tabL[e] + "<br/></atomicno>";
            tmpStr += "<acronym>" + elements[tabL[e]][2] + "</acronym>";
            tmpStr += "<name><br/>" + elements[tabL[e]][3] + "</name>";
            tmpStr += "<atomicwt><br/>" + atwt + "</atomicwt>";
            tmpStr += "</td>";
        } catch (ex) { }
    }
    tmpStr += "<th class='prd' align='left'>6</th>";
    tmpStr += "</tr>";

    tmpStr += "<tr>";
    tmpStr += "<td>&nbsp;</td>";
    tmpStr += "<td colspan='2'>&nbsp;</td>";
    tmpStr += "<th class='prd' align='right'>7</th>";
    for (e in tabA) {
        try {
            c = 3;
            r = 7;
            var atwt = Math.round(elements[tabA[e]][6] * 100) / 100;
            tmpStr += "<td class='Element ";
            tmpStr += elements[tabA[e]][1] + " col";
            tmpStr += c + "' ";
            tmpStr += "id='#an" + tabA[e];
            tmpStr += "'>";
            tmpStr += "<atomicno>" + tabA[e] + "<br/></atomicno>";
            tmpStr += "<acronym>" + elements[tabA[e]][2] + "</acronym>";
            tmpStr += "<name><br/>" + elements[tabA[e]][3] + "</name>";
            tmpStr += "<atomicwt><br/>" + atwt + "</atomicwt>";
            tmpStr += "</td>";
        } catch (ex) { }

    }
    tmpStr += "<th class='prd' align='left'>7</th>";
    tmpStr += "</tr>";

    tmpStr += "<tr class='grpRow'>";
    tmpStr += "<td>&nbsp;</td>";
    tmpStr += "<td colspan='3'>&nbsp;</td>";
    for (e in tabL) {
        tmpStr += "<th class='grp'>3</th>"; ;
    }
    tmpStr += "</tr>";
    tmpStr += "</table>";

    $('#tableID').html(tmpStr);
}
