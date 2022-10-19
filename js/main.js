let fightMap = {};


$('.nav-item').click(function(){
    let target = $(this).data('nav');
    $('.bloc-main').addClass('!hidden');
    $('.bloc-main#'+target).removeClass('!hidden');
});

function showBossTeam(id){
    $('#fights').addClass('!hidden');
    $('#teams').removeClass('!hidden');
    $('.group-container').addClass('hidden');
    $('#group-'+id).removeClass('hidden');
}

function builderContentMain(title,id){
    $("#" + id).append('<h2 id="title-'+id+'" class="text-4xl font-extrabold uppercase h-16 bg-white flex items-center px-5">'+title+'</h2>'+
    '<div id="container-'+id+'" class="overflow-auto h-full flex items-center justify-center"></div>');
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
    $('#fights').removeClass('!hidden');
    builderContentMain('Boss','fights');
    fetch("https://www.esologs.com:443/v1/report/fights/" + idReport + "?api_key=b578a559d4215fb444928808da6976ec")
        .then((resp) => resp.json())
        .then(function (data) {
            let reportSign = idReport;
            let fights = data.fights;
            for (let fight of fights) {
                if (fight.boss > 0 && fight.kill) {
                    fightMap[fight.id] = fight;
                    console.log(fight);
                    let idBoss = fightMap[fight.id].boss;
                    let startBoss = fightMap[fight.id].start_time;
                    let endBoss = fightMap[fight.id].end_time;
                    let nameBoss = fightMap[fight.id].name;
                    $('#container-fights').append('<div class="boss-item h-full w-full text-white text-4xl font-extrabold flex items-center justify-center" onclick="showBossTeam('+idBoss+')" >'+nameBoss+'</div>');
                    $('#teams').append('<div id="group-'+idBoss+'" class="group-container hidden"></div>');
                    /*<div class="buff-container flex !hidden" id="buff-' + idBoss + '"></div>*/
                    builderContentMain(nameBoss,nameBoss);
                    // $("#teams").append('<div id="boss-' + idBoss + '" class="item-container-boss sticky top-0 items-center justify-between w-full p-4 border-2 bg-gray-800 border-gray-700 my-6"' +
                    //     ' data-report="' + reportSign + '" data-boss="' + idBoss + '" data-start="' + startBoss + '" data-end="' + endBoss + '">' +
                    //     '<div class="flex items-center justify-between"><p class="font-semibold text-gray-700 dark:text-white text-xl">' + nameBoss + '</p>' +
                    //     '<div class="role-container font-extrabold flex items-center gap-4 hidden h-10"><div class="text-blue-500 h-full"><img class="h-full" src="./img/icon/tank.webp"></div><div class="text-green-500 h-full"><img class="h-full" src="./img/icon/heal.webp"></div><div class="text-red-500 h-full"><img class="h-full" src="./img/icon/dps.webp"></div></div></div>' +
                    //     '</di>');
                   /*for (let [k, v] of Object.entries(buffs)) {   
                        $('#buff-'+idBoss).append('<div><img class="h-8" src="'+v.pathImg+'" ></div>');
                    }*/
                    preciseFight(reportSign, idBoss, startBoss, endBoss, nameBoss);
                }
            }
        })
        .catch(function (error) {
            //console.log(error);
        });
}

//'summary', 'damage-done', 'damage-taken', 'healing', 'casts', 'summons', 'buffs', 'debuffs', 'deaths', 'survivability', 'resources', 'resources-gains'.
function preciseFight(report, idBoss, start, end, nameBoss) {
    let allGroupMap = {};
    $('.role-container').removeClass('hidden');
    $('.buff-container').removeClass('!hidden');
    $('#group-' + idBoss).append('<h2 class="text-4xl font-extrabold uppercase h-16 bg-white flex items-center px-5">Fight - '+nameBoss+'</h2><div class="overflow-auto h-[calc(100vh-4rem)]"><div id="contentBoss-' + idBoss + '" class="p-6 text-sm text-gray-500 dark:text-gray-300 grid grid-cols-1 xl:grid-cols-2 gap-4 overflow-auto h-full"></div></div>');
    fetch("https://www.esologs.com:443/v1/report/tables/summary/" + report + "?start=" + start + "&end=" + end + "&api_key=b578a559d4215fb444928808da6976ec")
        .then((resp) => resp.json())
        .then(function (specifikFight) {
            let allGroup = specifikFight.composition;
            let allDamageDone = specifikFight.damageDone;
            let pDetail = specifikFight.playerDetails;
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

            for (let [k, v] of Object.entries(buffs)) {   
                fetch("https://www.esologs.com:443/v1/report/tables/buffs/" + report + "?start=" + start + "&end=" + end + "&abilityid="+v.code+"&api_key=b578a559d4215fb444928808da6976ec")
                .then((response) => response.json())
                .then(function(buffsTable){
                    for (let [key, value] of Object.entries(buffsTable['auras'])) {
                        allGroupMap[value.id]['uptime' + k] = value.totalUptime;
                    }    
                }).catch(function (error) { });
            }
        });
}

