//https://assets.rpglogs.com/img/eso/maps/craglorn/helracitadel_base.jpg

//Link pour map

$('.nav-item').click(function () {
    let target = $(this).data('nav');
    $('.bloc-main').addClass('!hidden');
    $('.bloc-main#' + target).removeClass('!hidden');
});

$(".role-item").click(function(){
    if($(this).hasClass('is-active')){
        $('.role-item').removeClass('is-active bg-white')
        $(".group-container .item-group").removeClass('hidden block');
        return;
    }
    let role = $(this).attr('id');
    $('.role-item').removeClass('is-active bg-white');
    $(this).addClass('is-active bg-white');
    $(".group-container .item-group").addClass('hidden');
    $(".group-container").find('.item-group[data-role="'+role+'"]').removeClass('hidden');
    $(".group-container").find('.item-group[data-role="'+role+'"]').addClass('block');
})

function showBossTeam(id, name) {
    $('.title-container').html('<div onclick="showBossContainer()" class="block h-10 w-10 rounded-lg bg-gray-200 text-black text-xs h-12 w-12 flex items-center justify-center mr-4 cursor-pointer  hover:bg-gray-300"><</div> Fight - ' + name);
    $('#fights').addClass('!hidden');
    $('#teams').removeClass('!hidden');
    $('.group-container').addClass('hidden');
    $('#group-' + id).removeClass('hidden');
}

$('#gear').click(function(){
    $('.gear-container').toggleClass('!hidden');
    $(this).toggleClass('bg-white !text-black');
})
$('#spell').click(function(){
    $('.spell-container').toggleClass('!hidden');
    $(this).toggleClass('bg-white !text-black');
})
$('#buff').click(function(){
    $('.buff-container').toggleClass('!hidden');
    $(this).toggleClass('bg-white !text-black');
})
$('#damage').click(function(){
    $('.damage-container').toggleClass('!hidden');
    $(this).toggleClass('bg-white !text-black');
})
$('#cpm').click(function(){
    $('.cpm-container').toggleClass('!hidden');
    $(this).toggleClass('bg-white !text-black');
})

function builderContentMain(title, id) {
    $(".title-container").html(title);
    $("#" + id).append('<div id="container-' + id + '" class="overflow-auto h-full flex items-center justify-center"></div>');
}

function buildGearForChara(data, idPerso, boss) {
    let nameGear = data.name;
    let champLvlGear = data.championPoints;
    let qualityGear = qualityEquipment[data.quality];
    let traitGear = traitType[data.trait];
    let enchantGear = enchantType[data.enchantType];
    let enchantQuality = qualityEnchant[data.enchantQuality];
    if (data.id > 0) {
        $('#group-' + boss + ' #gear-' + idPerso).append("<div class='flex justify-between w-full mb-2 text-xs' style='text-transform: capitalize;color:" + qualityGear + "'>" + nameGear +
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
        $('#group-' + boss + ' #spell-' + id).append("<img style='width: 40px' src='" + pathIcon + iconComp + ".png'>")
    }
}

function buildBuffForChara(data, dataPick ,idChara, idBoss) {
   // console.log(data, dataPick);
    $('#group-' + idBoss + ' #buff-' + idChara).append("<img style='width: 35px' src='.png'>")
}


function showBossContainer() {
    $('.title-container').html('Fights');
    $('.bloc-main').addClass('!hidden');
    $('.bloc-main#fights').removeClass('!hidden');
}

let fightMap = {};
let buffsArray = {};

function reportTarget(idReport) {
    fetch("https://www.esologs.com:443/v1/report/fights/"+idReport+"?api_key=b578a559d4215fb444928808da6976ec")
        .then((response) => response.json())
        .then((data) => {
            let nameTrial = data.title;
            let startTrial = data.start;
            let endTrial = data.end;
            let reportSign = idReport;
            let durationTrial = timestampWithoutMillisecond(endTrial) - timestampWithoutMillisecond(startTrial);
            $('.title-container').html(nameTrial + ' - ' + timeConverter(timestampWithoutMillisecond(startTrial)) + ' - ' + timeDuration(durationTrial));
            $(".input-container").remove();
            $('#fights').removeClass('!hidden');
            builderContentMain('Fights', 'fights');
            for (let fight of data.fights) {
                if(fight.boss > 0 && fight.kill){
                    let idBoss = fight.boss;
                    let nameBoss = fight.name;
                    let startBoss = fight.start_time;
                    let endBoss = fight.end_time;
                    let durationBoss = timeDuration(timestampWithoutMillisecond(endBoss) - timestampWithoutMillisecond(startBoss));
                    $('#container-fights').append('<div class="boss-item h-full w-full text-white text-4xl font-extrabold flex items-center justify-center flex-col hover:bg-white/20 cursor-pointer text-center" onclick="showBossTeam(' + idBoss + ',\'' + nameBoss + '\')" ><img class="h-24 mb-4 rounded-lg" src="https://assets.rpglogs.com/img/eso/bosses/'+idBoss+'-icon.png"/>' + nameBoss + '<br>'+durationBoss+'</div>');
                    $('.boss-container-nav').append('<div class="flex items-center justify-center h-16 w-16 hover:bg-gray-100 cursor-pointer group relative" onclick="showBossTeam(' + idBoss + ',\'' + nameBoss + '\')" ><img class="h-10 w-10 rounded-lg overflow-hidden" src="https://assets.rpglogs.com/img/eso/bosses/'+idBoss+'-icon.png"/><span class="absolute left-full top-1/2 ml-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white w-max opacity-0 group-hover:opacity-100 hidden group-hover:block">'+nameBoss+'</span></div>');
                    $('#teams').append('<div id="group-' + idBoss + '" class="group-container hidden grid grid-cols-1 xl:grid-cols-2  gap-4 p-6 overflow-auto h-[calc(100vh-8rem)]"></div>');
                    preciseFight(reportSign, idBoss, startBoss, endBoss, nameBoss);
                }
            }
        })
        .catch((error) => {
            console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
        });
}


/*for (let [k, v] of Object.entries(buffs)) {   
    $('#buff-'+idBoss).append('<div><img class="h-8" src="'+v.pathImg+'" ></div>');
}*/
let allGroupMap = {};

//'summary', 'damage-done', 'damage-taken', 'healing', 'casts', 'summons', 'buffs', 'debuffs', 'deaths', 'survivability', 'resources', 'resources-gains'.
function preciseFight(report, idBoss, start, end, nameBoss) {
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
                    allGroupMap[data[indexP].id]['buffs'] = {};
                }
            }
            for (let [k, v] of Object.entries(buffsTab)) {   
                fetch("https://www.esologs.com:443/v1/report/tables/buffs/" + report + "?start=" + start + "&end=" + end + "&abilityid="+v.code+"&api_key=b578a559d4215fb444928808da6976ec")
                .then((response) => response.json())
                .then(function(buffsTable){
                    for (let [key, value] of Object.entries(buffsTable['auras'])) {
                        allGroupMap[value.id]['uptime' + k] = value.totalUptime;
                    }    
                }).catch(function (error) { });
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
                let buffs = allGroupMap[f].buffs;
                $('#group-' + idBoss).append('<div id="' + displayName + '" class="item-group flex justify-center flex-col p-6 rounded-lg border border-4 shadow-md bg-gray-80 border-gray-800" data-role="' + allGroupMap[f].role + '">' +
                    '<div class="text-sm font-bold tracking-tight text-gray-900 dark:text-white flex items-center justify-between w-full">' +
                    '<div class="flex items-center justify-between w-full"><div class="flex items-center justify-center"><img class="composition-icon sprite actor-sprite-' + classChara + ' mr-2" src="' + pathIconDD + '"><span>' + name + ' - ' + displayName + ' - ' + classChara + '</span></div><span>' + parseFloat(dmgPerDD).toPrecision(3) + dmgPerDD.replace(/[^B|M|K]/g, "") + ' / ' + percentDmg.toFixed(2) + '%</span></div>' +
                    '</div>' +
                    '<div id="gear-' + idChara + '" class="gear-container mt-6 !hidden"></div>' +
                    '<div id="spell-' + idChara + '" class="spell-container mt-6  flex justify-between w-full !hidden"></div>' +
                    '<div id="buff-' + idChara + '" class="buff-container mt-6  !hidden"></div>' +
                    '<div id="damage-' + idChara + '" class="damage-container mt-6  !hidden"></div>' +
                    '<div id="cpm-' + idChara + '" class="cpm-container mt-6  !hidden"></div>' +
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
                        buildGearForChara( gear[g],idChara, idBoss );
                    }
                }
                for (let t in talents) {
                    builderCompForChara(talents[t], idChara, idBoss);
                }
            }
        });
        console.log(allGroupMap);
}


