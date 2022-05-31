$(".navbar-burger").click(function () {
    $('.navbar-menu').toggleClass('is-active');
});
$(".icon-has-child").click(function () {
    $(this).next().toggleClass('is-active');
});
$('.bloc-mech-container').click(function () {
    $('.modal-mech').addClass('is-active');
    $('body').addClass('is-stuck');
})
switchSideMenu = function (e) {
    if (e == 0) {
        $('.navbar-menu').removeClass('is-right-pos');
        $('.content-container-menu').removeClass('is-right-pos');
        $('.navbar-menu').addClass('is-left-pos');
        $('.content-container').addClass('is-right-pos');
    } else {
        $('.navbar-menu').removeClass('is-left-pos');
        $('.content-container').removeClass('is-left-pos');
        $('.navbar-menu').addClass('is-right-pos');
        $('.content-container').addClass('is-right-pos');
    }
}

function timeConverter(UNIX_timestamp) {
    var timestamp = UNIX_timestamp;
    var date = new Date(timestamp).toLocaleDateString("fr-EU");
    return date;
}

let traitType = {
    1: 'Divin',
    3: 'Infusé',
    8: 'Renforcé',
    9: 'Solide',
    10: 'Entrainement',
    12: 'Arcane',
    13: 'Assoiffé de sang',
    28: 'Trempe de nirn',
    23: 'Chargé',
    26: 'Infusé',
    31: 'Précis',
    30: 'Énergisé'

}

let enchantType = {
    22: 'Magie',
    35: 'Vigeur',
    12: 'Arme enflammé',
    24: 'Arme empoisonnée',
    5: 'Berserker',
    21: 'Augmente les dégâts des sorts',
    19: 'Augmente les dégâts physiques',
    23: 'Regen Magie',
    32: 'Affaiblissement'
}

let qualityEnchant = {
    1: 'white',
    2: '#8acc69',
    3: '#6fabd5',
    4: '#a335ee',
    5: '#e5cc80',
}

let qualityEquipment = {
    1: 'white',
    2: '#8acc69',
    3: '#6fabd5',
    4: '#a335ee',
    5: '#e5cc80',
}

function builderDataForChara(data, id) {
    let nameGear = data[id].name;
    let champLvlGear = data[id].championPoints;
    let qualityGear = qualityEquipment[data[id].quality];
    let traitGear = traitType[data[id].trait];
    let enchantGear = enchantType[data[id].enchantType];
    let enchantQuality = qualityEnchant[data[id].enchantQuality];
    if (data[id].id > 0) {
        return "<div class='flex justify-between w-full mb-2' style='text-transform: capitalize;color:" + qualityGear + "'>" + nameGear +
            (champLvlGear !== 160 ? ' - ' + champLvlGear : '') +
            "<div>" +
            "<span class='inline-block rounded text-gray-600 px-2 py-1 text-xs font-bold mr-3' style='background:" + enchantQuality + "'>" + enchantGear + "</span>" +
            "<span class='inline-block rounded text-gray-600 bg-gray-100 px-2 py-1 text-xs font-bold'>" + traitGear + "</span>" +
            "</div>" +
            "</div>";
    }
    return '';
}

function builderCompForChara(data, id) {
    let nameComp = data[id].name;
    let iconComp = data[id].abilityIcon;
    let pathIcon = "https://assets.rpglogs.com/img/eso/abilities/";
    if (data[id].name !== 'undefined') {
        return "<img style='width: 35px' src='" + pathIcon + iconComp + ".png'>";
    }
    return '';
}

function reportTarget(idReport) {
    fetch("https://www.esologs.com:443/v1/report/fights/" + idReport + "?api_key=b578a559d4215fb444928808da6976ec")
        .then((resp) => resp.json())
        .then(function (data) {
            let reportSign = idReport;
            $("#title-trial").append('<div class="text-4xl font-semibold text-center text-gray-800 dark:text-white">' + data.title + '</div>')
            let fights = data.fights;
            return fights.map(function (fight) {
                if (fight.boss > 0 && fight.kill) {
                    let idBoss = fight.boss;
                    let startBoss = fight.start_time;
                    let endBoss = fight.end_time;
                    let nameBoss = fight.name;
                    //onclick="preciseFight(\''+reportSign+'\',' + idBoss + ',' + startBoss + ',' + endBoss + ')"
                    $("#container-boss").append('<div id="boss-' + idBoss + '" class="item-container-boss">' +
                        '<button onclick="$(this).next().toggle()" style="position: sticky;top: 0" class="flex items-center justify-between w-full p-8 border-2 border-gray-100 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:border-gray-700 my-6">' +
                        '<p class="font-semibold text-gray-700 dark:text-white text-lg">' + nameBoss + '</p>' +
                        '<span class="text-gray-400 bg-gray-200 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 12H6" /></svg></span>' +
                        '</button>' +
                        '<div id="contentBoss-' + idBoss + '" class="px-4 text-sm text-gray-500 dark:text-gray-300 grid grid-cols-2 gap-4"></div>' +
                        '</div>');
                    preciseFight(reportSign, idBoss, startBoss, endBoss);
                }
            })
        })
        .catch(function (error) {
            console.log(error);
        });
}


//'summary', 'damage-done', 'damage-taken', 'healing', 'casts', 'summons', 'buffs', 'debuffs', 'deaths', 'survivability', 'resources', 'resources-gains'.
function preciseFight(report, idBoss, start, end) {
    fetch("https://www.esologs.com:443/v1/report/tables/summary/" + report + "?start=" + start + "&end=" + end + "&api_key=b578a559d4215fb444928808da6976ec")
        .then((resp) => resp.json())
        .then(function (specifikFight) {
            let allGroup = specifikFight.composition;
            let allDamageDone = specifikFight.damageDone;
            let catchDD = specifikFight.playerDetails.dps;
            let catchHeal = specifikFight.playerDetails.healers;
            let catchTank = specifikFight.playerDetails.tanks;

            for (let i = 0; i < catchDD.length; i++) {
                let pathIconDD = "https://assets.rpglogs.com/img/eso/icons/actors.png?v=8";
                let classChara = catchDD[i].icon;
                let name = catchDD[i].name;
                let displayName = catchDD[i].displayName;
                let idChara = catchDD[i].id;
                let DDCharaGear = catchDD[i].combatantInfo.gear;
                let DDCharaComp = catchDD[i].combatantInfo.talents;
                $('#contentBoss-' + idBoss).append('<div id="' + displayName + '" class="block p-6 w-full rounded-lg border border-2 shadow-md bg-gray-800 border-gray-700">' +
                    '<div class="mb-2 text-sm font-bold tracking-tight text-gray-900 dark:text-white mb-6 flex items-center justify-between w-full">' +
                    '<div class="flex items-center"><img class="composition-icon sprite actor-sprite-' + classChara + ' mr-2" src="' + pathIconDD + '">' + name + ' - ' + displayName + ' - ' + classChara + '</div>' +
                    '</div>' +
                    //' - ' + displayName + ' - ' + classChara +
                    '<div id="content-' + idChara + '">' +
                    builderDataForChara(DDCharaGear, 0) +
                    builderDataForChara(DDCharaGear, 1) +
                    builderDataForChara(DDCharaGear, 2) +
                    builderDataForChara(DDCharaGear, 3) +
                    builderDataForChara(DDCharaGear, 4) +
                    builderDataForChara(DDCharaGear, 5) +
                    builderDataForChara(DDCharaGear, 6) +
                    builderDataForChara(DDCharaGear, 7) +
                    builderDataForChara(DDCharaGear, 8) +
                    builderDataForChara(DDCharaGear, 9) +
                    builderDataForChara(DDCharaGear, 10) +
                    builderDataForChara(DDCharaGear, 11) +
                    builderDataForChara(DDCharaGear, 12) +
                    builderDataForChara(DDCharaGear, 13) +
                    builderDataForChara(DDCharaGear, 14) +
                    builderDataForChara(DDCharaGear, 15) +
                    '<div class="flex justify-between w-full mt-6">' +
                    builderCompForChara(DDCharaComp, 0) +
                    builderCompForChara(DDCharaComp, 1) +
                    builderCompForChara(DDCharaComp, 2) +
                    builderCompForChara(DDCharaComp, 3) +
                    builderCompForChara(DDCharaComp, 4) +
                    builderCompForChara(DDCharaComp, 5) +
                    builderCompForChara(DDCharaComp, 6) +
                    builderCompForChara(DDCharaComp, 7) +
                    builderCompForChara(DDCharaComp, 8) +
                    builderCompForChara(DDCharaComp, 9) +
                    builderCompForChara(DDCharaComp, 10) +
                    builderCompForChara(DDCharaComp, 11) +
                    '</div>' +
                    '</div>' +
                    '</div>');

            }
            console.log(catchHeal.length);
            for (let i = 0; i < catchHeal.length; i++) {
                let pathIcon = "https://assets.rpglogs.com/img/eso/icons/actors.png?v=8";
                let classChara = catchHeal[i].icon;
                let name = catchHeal[i].name;
                let displayName = catchHeal[i].displayName;
                let idChara = catchHeal[i].id;
                let DDCharaGear = catchHeal[i].combatantInfo.gear;
                console.log(DDCharaGear);
                let DDCharaComp = catchHeal[i].combatantInfo.talents;
                $('#contentBoss-' + idBoss).append('<div id="' + displayName + '" class="block p-6 w-full rounded-lg border border-2  shadow-md bg-gray-800 border-gray-700">' +
                    '<div class="mb-2 text-sm font-bold tracking-tight text-gray-900 dark:text-white mb-6 flex items-center justify-between w-full">' +
                    '<div class="flex items-center"><img class="composition-icon sprite actor-sprite-' + classChara + ' mr-2" src="' + pathIcon + '">' + name + ' - ' + displayName + ' - ' + classChara + '</div>' +
                    '</div>' +
                    //' - ' + displayName + ' - ' + classChara +
                    '<div id="content-' + idChara + '">' +
                    builderDataForChara(DDCharaGear, 0) +
                    builderDataForChara(DDCharaGear, 1) +
                    builderDataForChara(DDCharaGear, 2) +
                    builderDataForChara(DDCharaGear, 3) +
                    builderDataForChara(DDCharaGear, 4) +
                    builderDataForChara(DDCharaGear, 5) +
                    builderDataForChara(DDCharaGear, 6) +
                    builderDataForChara(DDCharaGear, 7) +
                    builderDataForChara(DDCharaGear, 8) +
                    builderDataForChara(DDCharaGear, 9) +
                    builderDataForChara(DDCharaGear, 10) +
                    builderDataForChara(DDCharaGear, 11) +
                    builderDataForChara(DDCharaGear, 12) +
                    builderDataForChara(DDCharaGear, 13) +
                    builderDataForChara(DDCharaGear, 14) +
                    builderDataForChara(DDCharaGear, 15) +
                    '<div class="flex justify-between w-full mt-6">' +
                    builderCompForChara(DDCharaComp, 0) +
                    builderCompForChara(DDCharaComp, 1) +
                    builderCompForChara(DDCharaComp, 2) +
                    builderCompForChara(DDCharaComp, 3) +
                    builderCompForChara(DDCharaComp, 4) +
                    builderCompForChara(DDCharaComp, 5) +
                    builderCompForChara(DDCharaComp, 6) +
                    builderCompForChara(DDCharaComp, 7) +
                    builderCompForChara(DDCharaComp, 8) +
                    builderCompForChara(DDCharaComp, 9) +
                    builderCompForChara(DDCharaComp, 10) +
                    builderCompForChara(DDCharaComp, 11) +
                    '</div>' +
                    '</div>' +
                    '</div>');

            }

            for (let i = 0; i < catchTank.length; i++) {
                let pathIcon = "https://assets.rpglogs.com/img/eso/icons/actors.png?v=8";
                let classChara = catchTank[i].icon;
                let name = catchTank[i].name;
                let displayName = catchTank[i].displayName;
                let idChara = catchTank[i].id;
                let DDCharaGear = catchTank[i].combatantInfo.gear;
                let DDCharaComp = catchTank[i].combatantInfo.talents;
                $('#contentBoss-' + idBoss).append('<div id="' + displayName + '" class="block p-6 w-full rounded-lg border border-2 border-gray-100 shadow-md bg-gray-800 border-gray-700">' +
                    '<div class="mb-2 text-sm font-bold tracking-tight text-gray-900 dark:text-white mb-6 flex items-center justify-between w-full">' +
                    '<div class="flex items-center"><img class="composition-icon sprite actor-sprite-' + classChara + ' mr-2" src="' + pathIcon + '">' + name + ' - ' + displayName + ' - ' + classChara + '</div>' +
                    '</div>' +
                    //' - ' + displayName + ' - ' + classChara +
                    '<div id="content-' + idChara + '">' +
                    builderDataForChara(DDCharaGear, 0) +
                    builderDataForChara(DDCharaGear, 1) +
                    builderDataForChara(DDCharaGear, 2) +
                    builderDataForChara(DDCharaGear, 3) +
                    builderDataForChara(DDCharaGear, 4) +
                    builderDataForChara(DDCharaGear, 5) +
                    builderDataForChara(DDCharaGear, 6) +
                    builderDataForChara(DDCharaGear, 7) +
                    builderDataForChara(DDCharaGear, 8) +
                    builderDataForChara(DDCharaGear, 9) +
                    builderDataForChara(DDCharaGear, 10) +
                    builderDataForChara(DDCharaGear, 11) +
                    builderDataForChara(DDCharaGear, 12) +
                    builderDataForChara(DDCharaGear, 13) +
                    builderDataForChara(DDCharaGear, 14) +
                    builderDataForChara(DDCharaGear, 15) +
                    '<div class="flex justify-between w-full mt-6">' +
                    builderCompForChara(DDCharaComp, 0) +
                    builderCompForChara(DDCharaComp, 1) +
                    builderCompForChara(DDCharaComp, 2) +
                    builderCompForChara(DDCharaComp, 3) +
                    builderCompForChara(DDCharaComp, 4) +
                    builderCompForChara(DDCharaComp, 5) +
                    builderCompForChara(DDCharaComp, 6) +
                    builderCompForChara(DDCharaComp, 7) +
                    builderCompForChara(DDCharaComp, 8) +
                    builderCompForChara(DDCharaComp, 9) +
                    builderCompForChara(DDCharaComp, 10) +
                    builderCompForChara(DDCharaComp, 11) +
                    '</div>' +
                    '</div>' +
                    '</div>');

            }
            console.log(bigData);

        }).catch(function (error) {
    });
}

function tabsBoss(e, boss) {
    var i, tabcontent, tablinks;
    tabcontent = $('.tabs-content-right-aside');
    tablinks = $('.tabs-links');
    for (i = 0; i < tabcontent.length; i++) {
        $(tabcontent[i]).removeClass('is-active');
    }
    for (i = 0; i < tablinks.length; i++) {
        $(tablinks[i]).removeClass('is-active');
    }
    $('#' + boss).addClass('is-active');
    e.currentTarget.className += " is-active";
}
