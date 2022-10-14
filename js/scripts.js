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

function MoneyFormat(labelValue) {
    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9

        ? Math.abs(Number(labelValue)) / 1.0e+9 + "B"
        // Six Zeroes for Millions 
        : Math.abs(Number(labelValue)) >= 1.0e+6

            ? Math.abs(Number(labelValue)) / 1.0e+6 + "M"
            // Three Zeroes for Thousands
            : Math.abs(Number(labelValue)) >= 1.0e+3

                ? Math.abs(Number(labelValue)) / 1.0e+3 + "K"

                : Math.abs(Number(labelValue));

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
    30: 'Énergisé',
    32: 'Acéré',
    26: 'Infusé',
    14: 'Harmonieux',
    15: 'Sain',
    24: 'Décisif',
    25: 'Défenseur'
}

let enchantType = {
    3: 'Absorption de vigueur',
    22: 'Magie',
    35: 'Vigeur',
    12: 'Arme enflammé',
    24: 'Arme empoisonnée',
    5: 'Berserker',
    21: 'Augmente les dégâts des sorts',
    19: 'Augmente les dégâts physiques',
    23: 'Regen Magie',
    32: 'Affaiblissement',
    36: 'Régénération de vigueur',
    15: 'Arme Glaçé',
    2: 'Absorption de magie',
    16: 'Santé',
    26: 'Défense prismatique',
    17: 'Régénération de santé',
    28: 'Réduit l\'armure'
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

function builderDataForChara(data, idPerso, boss) {

    let nameGear = data.name;
    let champLvlGear = data.championPoints;
    let qualityGear = qualityEquipment[data.quality];
    let traitGear = traitType[data.trait];
    let enchantGear = enchantType[data.enchantType];
    let enchantQuality = qualityEnchant[data.enchantQuality];

    if (data.id > 0) {

        $('#contentBoss-' + boss + ' #content-' + idPerso).append("<div class='flex justify-between w-full mb-2' style='text-transform: capitalize;color:" + qualityGear + "'>" + nameGear +
            (champLvlGear > 160 ? ' - ' + champLvlGear : '') +
            "<div>" +
            "<span class='inline-block rounded text-gray-600 px-2 py-1 text-xs font-bold mr-3' style='background:" + enchantQuality + "'>" + enchantGear + "</span>" +
            "<span class='inline-block rounded text-gray-600 bg-gray-100 px-2 py-1 text-xs font-bold'>" + traitGear + "</span>" +
            "</div>" +
            "</div>");
    }
}

function builderCompForChara(data, id, boss) {
    let nameComp = data.name;
    let iconComp = data.abilityIcon;
    let pathIcon = "https://assets.rpglogs.com/img/eso/abilities/";
    if (data.name !== 'undefined') {
        $('#contentBoss-' + boss + ' #comp-' + id).append("<img style='width: 35px' src='" + pathIcon + iconComp + ".png'>")
    }
}

function reportTarget(idReport) {
    $(".input-container").remove();
    $("body").removeClass('overflow-hidden h-screen');
    $("body").append('<main class="container max-w-8xl px-6 py-10 mx-auto"><div id="title-trial"></div><div id="container-boss" class="mt-12"></div></main>');
    $('#title-trial').empty();
    $('#container-boss').empty();
    fetch("https://www.esologs.com:443/v1/report/fights/" + idReport + "?api_key=b578a559d4215fb444928808da6976ec")
        .then((resp) => resp.json())
        .then(function (data) {
            let reportSign = idReport;
            $("#title-trial").append('<div class="text-4xl font-semibold text-center text-gray-800 dark:text-white">' + data.title + '</div>');
            let fights = data.fights;
            let fightMap = {};
            for (let fight of fights) {
                if (fight.boss > 0 && fight.kill) {
                    fightMap[fight.id] = fight;
                    let idBoss = fightMap[fight.id].boss;
                    let startBoss = fightMap[fight.id].start_time;
                    let endBoss = fightMap[fight.id].end_time;
                    let nameBoss = fightMap[fight.id].name;
                    $("#container-boss").append('<div id="boss-' + idBoss + '" class="item-container-boss sticky top-0 items-center justify-between w-full p-4 border-2 bg-gray-800 border-gray-700 my-6"' +
                        ' data-report="' + reportSign + '" data-boss="' + idBoss + '" data-start="' + startBoss + '" data-end="' + endBoss + '">' +
                        '<p class="font-semibold text-gray-700 dark:text-white text-xl">' + nameBoss + '</p>' +
                        '<div class="role-container font-extrabold flex items-center gap-4 hidden"><div class="text-blue-500">TANK</div><div class="text-green-500">HEALER</div><div class="text-red-500">DPS</div></div>' +
                        '</div>');
                    //
                }
            }
        })
        .catch(function (error) {
            //console.log(error);
        });
}



//zxRhajDQt13gNVfq


//'summary', 'damage-done', 'damage-taken', 'healing', 'casts', 'summons', 'buffs', 'debuffs', 'deaths', 'survivability', 'resources', 'resources-gains'.
function preciseFight(report, idBoss, start, end) {
    $('.role-container').removeClass('hidden');
    $('#boss-' + idBoss).after('<div id="contentBoss-' + idBoss + '" class="px-4 text-sm text-gray-500 dark:text-gray-300 grid grid-cols-1 xl:grid-cols-2 gap-4"></div>');
    fetch("https://www.esologs.com:443/v1/report/tables/summary/" + report + "?start=" + start + "&end=" + end + "&api_key=b578a559d4215fb444928808da6976ec")
        .then((resp) => resp.json())
        .then(function (specifikFight) {
            // console.log(specifikFight);
            let allGroup = specifikFight.composition;
            let allDamageDone = specifikFight.damageDone;
            let pDetail = specifikFight.playerDetails;
            console.log(pDetail);
            let allGroupMap = {};
            let fullDamage = 0;

            for (let group of allGroup) {
                allGroupMap[group.id] = group;
            }

            for (let [key, value] of Object.entries(allGroup)) {
                allGroupMap[value.id]['role'] = value.specs[0].role;
            }

            for (let [key, value] of Object.entries(allDamageDone)) {
                allGroupMap[value.id]['dmgOutput'] = MoneyFormat(value.total);
                allGroupMap[value.id]['dmg'] = value.total;
                fullDamage = fullDamage += value.total;
            }

            for (let [key, data] of Object.entries(pDetail)) {
                for (let indexP in data) {
                    allGroupMap[data[indexP].id]['displayName'] = data[indexP].displayName;
                    allGroupMap[data[indexP].id]['icon'] = data[indexP].icon;
                    allGroupMap[data[indexP].id]['championPoints'] = data[indexP].maxItemLevel;
                    allGroupMap[data[indexP].id]['gear'] = data[indexP].combatantInfo.gear;
                    allGroupMap[data[indexP].id]['talents'] = data[indexP].combatantInfo.talents;
                }
            }
            for (let f = 1; f <= Object.keys(allGroupMap).length; f++) {
                let pathIconDD = "https://assets.rpglogs.com/img/eso/icons/actors.png?v=8";
                let dmgPerDD = allGroupMap[f].dmgOutput;
                let percentDmg = (allGroupMap[f].dmg * 100) / fullDamage;
                let classChara = allGroupMap[f].icon;
                let name = allGroupMap[f].name;
                let displayName = allGroupMap[f].displayName;
                let idChara = allGroupMap[f].id;
                let gear = allGroupMap[f].gear;
                let talents = allGroupMap[f].talents;
                $('#contentBoss-' + idBoss).append('<div id="' + displayName + '" class="' + allGroupMap[f].role + ' block p-6 w-full rounded-lg border border-4 shadow-md bg-gray-80 border-gray-800">' +
                    '<div class="mb-2 text-sm font-bold tracking-tight text-gray-900 dark:text-white mb-6 flex items-center justify-between w-full">' +
                    '<div class="flex items-center justify-between w-full"><div class="flex items-center justify-center"><img class="composition-icon sprite actor-sprite-' + classChara + ' mr-2" src="' + pathIconDD + '"><span>' + name + ' - ' + displayName + ' - ' + classChara + '</span></div><span>' + parseFloat(dmgPerDD).toPrecision(3) + dmgPerDD.replace(/[^B|M|K]/g, "") + ' / ' + percentDmg.toFixed(2) + '%</span></div>' +
                    '</div>' +
                    '<div id="content-' + idChara + '"></div>' +
                    '<div id="comp-' + idChara + '" class="flex justify-between w-full mt-6"></div>' +
                    '</div>' +
                    '</div>');

                for (let g in gear) {
                    let nameGear = gear[g].name;
                    let champLvlGear = gear[g].championPoints;
                    let qualityGear = qualityEquipment[gear[g].quality];
                    let traitGear = traitType[gear[g].trait];
                    let enchantGear = enchantType[gear[g].enchantType];
                    let enchantQuality = qualityEnchant[gear[g].enchantQuality];
                    if (gear[g].id > 0) {
                        $('#contentBoss-' + idBoss + ' #content-' + idChara).append("<div class='flex justify-between w-full mb-2' style='text-transform: capitalize;color:" + qualityGear + "'>" + nameGear +
                            (champLvlGear > 160 ? ' - ' + champLvlGear : '') +
                            "<div>" +
                            "<span class='inline-block rounded text-gray-600 px-2 py-1 text-xs font-bold mr-3' style='background:" + enchantQuality + "'>" + enchantGear + "</span>" +
                            "<span class='inline-block rounded text-gray-600 bg-gray-100 px-2 py-1 text-xs font-bold'>" + traitGear + "</span>" +
                            "</div>" +
                            "</div>");
                    }
                }

                for (let t in talents) {
                    builderCompForChara(talents[t], idChara, idBoss);
                }
            }

        }).catch(function (error) { });
}

$(document).on('click', '.item-container-boss', function () {
    let r = $(this).data('report');
    let idBoss = $(this).data('boss');
    let sB = $(this).data('start');
    let eB = $(this).data('end');
    preciseFight(r, idBoss, sB, eB);
})

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
