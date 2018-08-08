var foe;
var arc;

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

    document.getElementById('level').focus();
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

    if (level == null || level == "" || level < 2) {
        return;
    }

    select.selectedIndex = --level;

    displayLevel();
}

function displayLevel() {
    var select = document.getElementById('level');
    var level = select.options[select.selectedIndex].value;
    var bonus = document.getElementById('bonus').value;

    $.each(arc.levels, function (i, v) {
        if (v.level == level) {
            document.getElementById('research_points').innerText = v.research_points;
        }
    });

    $.each(arc.rewards, function (i, v) {
        if (v.level == level) {
            $.each(v.positions, function(i, v) {
                document.getElementById('p' + v.position + '_rp').innerText = v.research_points;
                document.getElementById('p' + v.position + '_rp2').innerText = v.research_points * parseFloat(bonus);
            });
        }
    });

    document.getElementById('rp_rest').innerText =
        parseInt(document.getElementById('research_points').innerText) -
        parseInt(document.getElementById('p1_rp').innerText) -
        parseInt(document.getElementById('p2_rp').innerText) -
        parseInt(document.getElementById('p3_rp').innerText) -
        parseInt(document.getElementById('p4_rp').innerText) -
        parseInt(document.getElementById('p5_rp').innerText);
    document.getElementById('rp2_rest').innerText =
        parseInt(document.getElementById('research_points').innerText) -
        parseInt(document.getElementById('p1_rp2').innerText) -
        parseInt(document.getElementById('p2_rp2').innerText) -
        parseInt(document.getElementById('p3_rp2').innerText) -
        parseInt(document.getElementById('p4_rp2').innerText) -
        parseInt(document.getElementById('p5_rp2').innerText);
    document.getElementById('rp2_advantage').innerText =
        parseInt(document.getElementById('rp_rest').innerText) -
        parseInt(document.getElementById('rp2_rest').innerText);

    document.getElementById('p12_rp2_safe').innerText =
        parseInt(document.getElementById('research_points').innerText) -
        parseInt(document.getElementById('p1_rp2').innerText) -
        2 * parseInt(document.getElementById('p2_rp2').innerText) + 1;
    document.getElementById('p123_rp2_safe').innerText =
        parseInt(document.getElementById('research_points').innerText) -
        parseInt(document.getElementById('p1_rp2').innerText) -
        parseInt(document.getElementById('p2_rp2').innerText) -
        2 * parseInt(document.getElementById('p3_rp2').innerText) + 1;
    document.getElementById('p1234_rp2_safe').innerText =
        parseInt(document.getElementById('research_points').innerText) -
        parseInt(document.getElementById('p1_rp2').innerText) -
        parseInt(document.getElementById('p2_rp2').innerText) -
        parseInt(document.getElementById('p3_rp2').innerText) -
        2 * parseInt(document.getElementById('p4_rp2').innerText) + 1;
    document.getElementById('p12345_rp2_safe').innerText =
        parseInt(document.getElementById('research_points').innerText) -
        parseInt(document.getElementById('p1_rp2').innerText) -
        parseInt(document.getElementById('p2_rp2').innerText) -
        parseInt(document.getElementById('p3_rp2').innerText) -
        parseInt(document.getElementById('p4_rp2').innerText) -
        2 * parseInt(document.getElementById('p5_rp2').innerText) + 1;
}