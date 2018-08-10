var foe;
var arc;
var initialited = false;

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType('application/json');
    xobj.open('GET', 'foe.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

loadJSON(function(response) {
    foe = JSON.parse(response);

    $.each(foe.buildings.great, function(i, v) {
        if (v.name.en == 'Arc') {
            arc = v
        }
    });

    var select = document.getElementById('level');
    $.each(arc.levels, function(i, v) {
        var option = document.createElement('option');
        option.text = v.level;
        select.add(option);
    });

    initialized = true;

    document.getElementById('level').focus();
    displayLevel();
});

function nextLevel() {
    var select = document.getElementById('level');
    var level = select.options[select.selectedIndex].value;

    if (level == null || level == "") {
        level = 0;
    }

    select.selectedIndex = ++level;

    displayLevel();
}

function lastLevel() {
    var select = document.getElementById('level');
    var level = select.options[select.selectedIndex].value;

    if (level == null || level == "" || level == 0) {
        return;
    }

    select.selectedIndex = --level;

    displayLevel();
}

function getLevelData(level) {
    var result = {};

    result.level = level;
    $.each(arc.levels, function (i, v) {
        if (v.level == level) {
            result['rp'] = v.research_points
            result['guild_goods'] = v.guild_goods
            result['bonus'] = v.bonus
        }
    });

    result['p1'] = {};
    result['p2'] = {};
    result['p3'] = {};
    result['p4'] = {};
    result['p5'] = {};
    $.each(arc.rewards, function (i, v) {
        if (v.level == level) {
            $.each(v.positions, function(i, v) {
                result['p' + v.position]['rp'] = v.research_points;
                result['p' + v.position]['medals'] = v.medals;
                result['p' + v.position]['bp'] = v.blueprints;
            });
        }
    });

    return result;
}

function displayLevel() {
    if (! initialized) {
        return;
    }

    var select = document.getElementById('level');
    var level = parseInt(select.options[select.selectedIndex].value);
    var bonus = parseFloat(document.getElementById('bonus').value);

    var data = getLevelData(level + 1);

    data.p1.rp2 = data.p1.rp * bonus;
    data.p2.rp2 = data.p2.rp * bonus;
    data.p3.rp2 = data.p3.rp * bonus;
    data.p4.rp2 = data.p4.rp * bonus;
    data.p5.rp2 = data.p5.rp * bonus;

    data.rp_rest = data.rp - data.p1.rp - data.p2.rp - data.p3.rp - data.p4.rp - data.p5.rp;
    data.rp2_rest = data.rp - data.p1.rp2 - data.p2.rp2 - data.p3.rp2 - data.p4.rp2 - data.p5.rp2;

    document.getElementById('level1').innerText = data.level;
    document.getElementById('research_points').innerText = data.rp;

    document.getElementById('p1_rp2').innerText = data.p1.rp2;
    document.getElementById('p2_rp2').innerText = data.p2.rp2;
    document.getElementById('p3_rp2').innerText = data.p3.rp2;
    document.getElementById('p4_rp2').innerText = data.p4.rp2;
    document.getElementById('p5_rp2').innerText = data.p5.rp2;

    data.p1.safe = data.rp - 2 * data.p1.rp2 + 1;
    if (data.p1.safe < 0) data.p1.safe = 0;

    data.p2.safe = data.rp - data.p1.rp2 - 2 * data.p2.rp2 + 1 - data.p1.safe;
    if (data.p2.safe < 0) data.p2.safe = 0;

    data.p3.safe = data.rp - data.p1.rp2 - data.p2.rp2 - 2 * data.p3.rp2 + 1 - data.p1.safe - data.p2.safe;
    if (data.p3.safe < 0) data.p3.safe = 0;

    data.p4.safe = data.rp - data.p1.rp2 - data.p2.rp2 - data.p3.rp2 - 2 * data.p4.rp2 + 1 - data.p1.safe - data.p2.safe - data.p3.safe;
    if (data.p4.safe < 0) data.p4.safe = 0;

    data.p5.safe = data.rp - data.p1.rp2 - data.p2.rp2 - data.p3.rp2 - data.p4.rp2 - 2 * data.p5.rp2 + 1 - data.p1.safe - data.p2.safe - data.p3.safe - data.p4.safe;
    if (data.p5.safe < 0) data.p5.safe = 0;

    data.safe_rest = data.rp - data.p1.rp2 - data.p1.safe - data.p2.rp2 - data.p2.safe - data.p3.rp2 - data.p3.safe - data.p4.rp2 - data.p4.safe - data.p5.rp2 - data.p5.safe;
    if (data.safe_rest < 0) data.safe_rest = 0;

    document.getElementById('rp2_rest').innerText = data.rp2_rest;
    document.getElementById('rp2_advantage').innerText = data.rp_rest - data.rp2_rest;

    document.getElementById('p1_rp2_safe').innerText = '+' + data.p1.safe;
    document.getElementById('p12_rp2_safe').innerText = '+' + data.p2.safe;
    document.getElementById('p123_rp2_safe').innerText = '+' + data.p3.safe;
    document.getElementById('p1234_rp2_safe').innerText = '+' + data.p4.safe;
    document.getElementById('p12345_rp2_safe').innerText = '+' + data.p5.safe;
    document.getElementById('p12345_rp2_rest').innerText = '+' + data.safe_rest;

    document.getElementById('p1_rp').innerText = data.p1.rp;
    document.getElementById('p1_medals').innerText = data.p1.medals;
    document.getElementById('p1_bp').innerText = data.p1.bp;

    document.getElementById('p2_rp').innerText = data.p2.rp;
    document.getElementById('p2_medals').innerText = data.p2.medals;
    document.getElementById('p2_bp').innerText = data.p2.bp;

    document.getElementById('p3_rp').innerText = data.p3.rp;
    document.getElementById('p3_medals').innerText = data.p3.medals;
    document.getElementById('p3_bp').innerText = data.p3.bp;

    document.getElementById('p4_rp').innerText = data.p4.rp;
    document.getElementById('p4_medals').innerText = data.p4.medals;
    document.getElementById('p4_bp').innerText = data.p4.bp;

    document.getElementById('p5_rp').innerText = data.p5.rp;
    document.getElementById('p5_medals').innerText = data.p5.medals;
    document.getElementById('p5_bp').innerText = data.p5.bp;
}

function showInfo(level) {
    var infos = document.getElementsByClassName("info" + level);
    for (var i = 0; i < infos.length; ++i) {
        var info = infos[i];
        var button = document.getElementById("button" + level)
        if (info.style.display === "none") {
            info.style.display = "table-row";
            button.value = "hide"
        } else {
            info.style.display = "none";
            button.value = "show"
        }
    }
}