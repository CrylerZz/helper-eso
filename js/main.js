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

function showBossTeam(idFight,idBoss, name) {
    $('.title-container .title-item').html('<div onclick="showBossContainer()" class="block h-8 sm:h-10 w-8 sm:w-10 rounded-lg bg-gray-200 text-black  flex items-center justify-center mr-4 cursor-pointer  hover:bg-gray-300"><</div><span class="uppercase font-extrabold text-[14px] sm:text-sm">' + name + '</span>');
    $('#fights-content').addClass('!hidden');
    $('#group-content').removeClass('!hidden');
    $('.group-container').addClass('hidden');
    $('#group-' + idFight + '-' + idBoss).removeClass('hidden');

   // $('#user-content').addClass('hidden');
}

function showUserTeam(id, name) {
    $('#input-content').addClass('hidden');
    $('.title-container .title-item').html('<div onclick="showBossContainer()" class="block h-10 w-10 rounded-lg bg-gray-200 text-black text-xs flex items-center justify-center mr-4 cursor-pointer  hover:bg-gray-300"><</div><span class="uppercase font-extrabold">Users</span>');
    $('#fights-content').addClass('!hidden');
    $('#group-content').addClass('!hidden');
    //$('#user-content').removeClass('hidden');
    //$('.user-container').addClass('hidden');
    $('#user-' + id).removeClass('!hidden');
}

$('#gear').click(function(){
    $('.gear-container').toggleClass('!hidden');
    $(this).toggleClass('bg-white !text-black');
})

$('#spell').click(function(){
    $('.spell-container').toggleClass('!hidden');
    $(this).toggleClass('bg-white !text-black');
})

function buildGearForChara(data, target) {
    //If undefined, it is a equiped poison
    if(data.setName !== undefined){
        let nameGear = data.name;
        let setName = data.setName;
        setName.toLowerCase().replace(/'/g,"").replace(/é/g,"e").replace(/â/g,"a").replace(/ê/g,"e").replace(/î/g,"i").replace(/è/g,"e").replace(/ /g,"-");    
        let champLvlGear = data.championPoints;
        let qualityGear = qualityEquipment[data.quality];
        let traitGear = traitType[data.trait];
        let enchantGear = enchantType[data.enchantType];
        let enchantQuality = qualityEnchant[data.enchantQuality];
        if (data.id > 0) {
            $(target).append("<div class='flex items-center justify-between w-full mb-2 text-xs flex-wrap' style='text-transform: capitalize;color:" + qualityGear + "'>"+
                "<a href='https://eso-hub.com/en/sets/"+setName+"' class='hover:text-gray-200' target='_blank'>" + nameGear +"</a>" + (champLvlGear > 160 ? ' - ' + champLvlGear : '') +
                "<div>" +
                "<span class='inline-block rounded px-2 py-1 text-xs font-bold mr-3 text-white' style='background:" + enchantQuality + "'>" + enchantGear + "</span>" +
                "<span class='inline-block rounded text-gray-600 bg-gray-100 px-2 py-1 text-xs font-bold'>" + traitGear + "</span>" +
                "</div>" +
                "</div>");
        }
    }

}

function builderCompForChara(data, id, boss,target) {
    let nameComp = data.name;
    let iconComp = data.abilityIcon;
    let pathIcon = "https://assets.rpglogs.com/img/eso/abilities/";
    if (data.name !== 'undefined') {
        $(target).append("<div class='relative group flex items-center justify-center'>"+
            "<img class='h-12 rounded border-2 border-gray-600' src='" + pathIcon + iconComp + ".png'>"+
            "<div class='hidden absolute bottom-14 bg-gray-900 border-2 border-gray-600 text-xs p-2 w-max rounded group-hover:flex'>"+nameComp+"</div>"+
        "</div>")
    }
}

function showBossContainer() {
    $('.title-container .title-item').html('');
    $('.bloc-main').addClass('!hidden');
    $('#fights-content').removeClass('!hidden');
}

function buildContainerNav4Boss(id, name){
    return '<div class="boss-nav-container boss-'+id+'">'+
        '<div class="title-boss-nav flex items-center gap-4 h-16 px-4 bg-gray-800">'+
            '<img class="h-8 w-8 rounded-lg overflow-hidden" src="https://assets.rpglogs.com/img/eso/bosses/'+id+'-icon.png"/>'+
            '<span class="text-sm text-white font-extrabold">'+name+'</span>'+
        '</div>'+
        '<div class="fight-boss-nav"></div>'+
    '</div>';
}

function buildFightNav4Boss(idFight, idBoss, killed, nameBoss){
    if(killed > 0){
        return '<div id="fight-'+idFight+'" onclick="showBossTeam(' + idFight +','+ idBoss + ',\'' + nameBoss + '\')" class="bg-green-600 hover:bg-green-500 flex items-center gap-2  cursor-pointer h-10 text-white text-sm font-extrabold px-4">Killed</div>';
    }else{
        return '<div id="fight-'+idFight+'" onclick="showBossTeam(' + idFight +','+ idBoss + ',\'' + nameBoss + '\')" class="hover:bg-gray-700 flex items-center gap-2  cursor-pointer h-10 text-white text-sm font-extrabold px-4">Wipe</div>';
    }
}

let fightMap = {};
let trashMap = {}
let buffsArray = {};
let ApiKey = "b578a559d4215fb444928808da6976ec";




async function reportTargetedSummary(idReport,idFight,idBoss, start, end, ApiKey){
    $('#input-content').remove();
    $('body').append('<div class="loader fixed inset-0 bg-white text-black text-6xl font-extrabold uppercase flex items-center justify-center">LOADING</div>');
    return fetch("https://www.esologs.com:443/v1/report/tables/summary/" + idReport + "?start=" + start + "&end=" + end + "&api_key="+ApiKey)
    .then((response)=>response.json())
    .then((responseJson)=>{
            let summary = responseJson;

            let allGroup = summary.composition;
            let allDamageDone = summary.damageDone;
            let pDetail = summary.playerDetails;
            let fullDamage = 0;
            for (let group of allGroup) {
                allGroupMap[group.id] = group;
            }
            for (let [key, value] of Object.entries(allGroup)) {
                for (let u in value) {
                     allGroupMap[value.id]['role'] = value[u].role;
                
                }
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
                    allGroupMap[data[indexP].id]['buffs'] = [];
                }
            }
            for (const p in allGroupMap) {
                let pathIconDD = "https://assets.rpglogs.com/img/eso/icons/actors.png?v=8";
                let id = allGroupMap[p].id;
                let dmgOutput = allGroupMap[p].dmgOutput;
                let role = allGroupMap[p].role;
                let percentDmg = (allGroupMap[p].dmg * 100) / fullDamage;
                let icon = allGroupMap[p].icon;
                let name = allGroupMap[p].name;
                let displayName = allGroupMap[p].displayName;
                let idChara = allGroupMap[p].id;
                let cpm = allGroupMap[p].cpm;
                $('#group-'+idFight+'-'+idBoss).append('<div id="' + displayName + '" class="item-group flex justify-center flex-col p-2 sm:p-6 sm:rounded-lg border border-0 sm:border-4 shadow-md bg-gray-800 border-gray-800" data-role="' + role + '">' +
                    '<div class="text-sm font-bold tracking-tight text-gray-900 dark:text-white flex items-center justify-between flex-col w-full">' +
                        '<div class="flex items-center justify-between w-full"><div class="flex items-center justify-center">'+
                            '<img class="composition-icon sprite rounded actor-sprite-' + icon + ' mr-2" src="' + pathIconDD + '">'+
                            '<div class="flex items-center justify-center flex-row flex-wrap gap-2 text-[12px] sm:text-base">'+
                                '<p class="text-white hidden sm:block">' + name +'</p>'+
                                '<p class="text-white">' + displayName +'</p>'+
                                '<p class="text-white">' + icon + '</p>'+
                            '</div>'+
                        '</div>'+
                        '<span class="text-white text-xs sm:text-base hidden sm:block">' + parseFloat(dmgOutput).toPrecision(3) + dmgOutput.replace(/[^B|M|K]/g, "") + ' / ' + percentDmg.toFixed(2) + '%</span>'+
                    '</div>' +
                    '<div id="gear-' + id + '-' +idFight+'-'+idBoss+'" class="gear-container mt-2 sm:mt-6 w-full !hidden"></div>' +
                    '<div id="spell-' + id + '-' +idFight+'-'+idBoss+'" class="spell-container mt-6  flex justify-between w-full !hidden"></div>' +
                '</div>');
                for (let g in allGroupMap[p].gear) {
                    if (allGroupMap[p].gear[g].id > 0) {
                        buildGearForChara( allGroupMap[p].gear[g],'#group-' + idFight + '-' + idBoss + ' #gear-' + allGroupMap[p].id+'-' + idFight + '-' + idBoss );
                    }
                }
                for (let t in allGroupMap[p].talents) {
                    builderCompForChara(allGroupMap[p].talents[t], allGroupMap[p].id, idBoss, '#group-' + idFight + '-' + idBoss + ' #spell-' + allGroupMap[p].id+'-' + idFight + '-' + idBoss );
                }
            }   

    });
}

async function reportTarget(idReport) {
    const response = await fetch("https://www.esologs.com:443/v1/report/fights/"+idReport+"?api_key="+ApiKey);
    const data = await response.json();
    return data;
}



//reportTargetedSummary(idReport, startBoss, endBoss, ApiKey)


function bossIsKilled(idFight,idBoss,nameBoss,durationBoss,killedBossInfo, idBoss){
    if(killedBossInfo !== false && idBoss > 0){
        return $('#boss-container-'+idBoss+' .container-item-boss').append('<div class="boss-item lg:col-span-2 xl:col-span-3 p-4 bg-green-500 border-2 border-green-500 h-16 w-full font-extrabold flex items-center justify-between rounded-lg gap-5 cursor-pointer text-center order-1" onclick="showBossTeam(' + idFight +','+ idBoss + ',\'' + nameBoss + '\')">'+
            '<div class="flex items-center justify-center gap-4 text-white">Kill - '+durationBoss+'</div>'+
                '<div class="flex items-center justify-center gap-10 uppercase font-extrabold">'+
                '<div class="border-2 border-green-500 text-green-500 bg-gray-800 rounded-lg text-sm px-4 h-9 flex items-center justify-center hover:bg-white hover:text-black" >Show</div>'+
            '</div>'+
        '</div>');
    }
}
function bossIsNotKilled(idFight,idBoss,nameBoss,durationBoss,killedBossInfo, idBoss){
    if(killedBossInfo == false && idBoss > 0){
        $('#boss-container-'+idBoss+' .container-item-boss').append('<div class="boss-item p-4 border-2 border-red-400 h-16 w-full font-extrabold flex items-center justify-between rounded-lg gap-5 cursor-pointer text-center order-2"  onclick="showBossTeam(' + idFight +','+ idBoss + ',\'' + nameBoss + '\')">'+
            '<div class="flex items-center justify-center gap-4 text-red-400">Wipe - '+durationBoss+'</div>'+
            '<div class="flex items-center justify-center gap-10 uppercase font-extrabold">'+
            '<div class="border-2 border-white rounded-lg text-sm px-4 h-9 flex items-center justify-center hover:bg-white hover:text-black">Show</div>'+
        '</div>'+
        '</div>');
    }
}
function isTrash(idFight,idBoss,nameBoss,durationBoss, idBoss){
    if(idBoss <= 0){
        $('#boss-container-'+idBoss+' .container-item-boss').append('<div class="boss-item p-4 border-2 border-gray-200 h-16 w-full font-extrabold flex items-center justify-between rounded-lg gap-5 cursor-pointer text-center" >'+
            '<div class="flex items-center justify-center gap-4 text-gray-400">'+nameBoss+' - '+durationBoss+'</div>'+
            '<div class="flex items-center justify-center gap-10 uppercase font-extrabold"><div class="border-2 border-white rounded-lg text-sm px-4 h-10 flex items-center justify-center hover:bg-white hover:text-black" onclick="showBossTeam(' + idFight +','+ idBoss + ',\'' + nameBoss + '\')">Show</div>'+
        '</div>'+
        '</div>');
    }
}
function buildParentFightContainer(idBoss, nameBoss){
    if($('#boss-container-'+idBoss).length == 0){
        $('#fights-content').append('<div id="boss-container-'+idBoss+'" class=" font-extrabold text-white flex flex-col '+ (idBoss == 0 ? "order-[1000]" : "order-1" )+' ">'+
        '<div class="bg-gray-800 p-4 flex items-center p-4 gap-4"><img class="h-12 w-12 rounded-lg border-2 border-gray-700 text-xl" src="https://assets.rpglogs.com/img/eso/bosses/'+idBoss+'-icon.png"/>'+ (idBoss == 0 ? "Trashs" : nameBoss )+'</div>'+
        '<div class="p-4 container-item-boss grid lg:grid-cols-2 xl:grid-cols-3 gap-4"></div>'+
        '</div>');
    }
}

let allGroupMap = {};

async function sendRequest(urlLog){
    $('.rightLink').append('<a class="" target="_blank" href="'+urlLog+'"><img class="w-9 mx-auto" src="https://assets.rpglogs.com/img/eso/favicon.png?v=2"/></a>')
    let explodeUrlLog = urlLog.split('https://www.esologs.com/reports/');
    let idReport = explodeUrlLog[1];
    await reportTarget(idReport).then(fullReport => {
        console.log(fullReport);
        let nameTrial = fullReport.title;
        let startTrial = fullReport.start;
        let endTrial = fullReport.end;
        let durationTrial = timestampWithoutMillisecond(endTrial) - timestampWithoutMillisecond(startTrial);
        $('.title-container .title-item').html(nameTrial + ' - ' + timeConverter(timestampWithoutMillisecond(startTrial)) + ' - ' + timeDuration(durationTrial));
        $("#input-content").remove();
        $('#fights-content').removeClass('!hidden');
        for (let fight of fullReport.fights) {
            let idFight = fight.id;
            let idBoss = fight.boss;
            let nameBoss = fight.name;
            let killedBossInfo = (fight.kill !== undefined ? fight.kill : 'Trash' );
            let startBoss = fight.start_time;
            let endBoss = fight.end_time;
            let duration = timeDuration(timestampWithoutMillisecond(endBoss) - timestampWithoutMillisecond(startBoss));

            $('.boss-'+idBoss+' .fight-boss-nav').append(buildFightNav4Boss(idFight, idBoss, killedBossInfo, nameBoss));
            $('#group-content').append('<div id="group-'+idFight+'-' + idBoss + '" class="group-container hidden grid grid-cols-1 xl:grid-cols-2 auto-rows-min gap-2 sm:gap-4 p-0 sm:p-6 overflow-auto h-[calc(100vh-8rem)]"></div>');

            if($('.boss-'+idBoss).length == 0){
                $('.container-main-nav').append(buildContainerNav4Boss(idBoss,nameBoss));
            }
            buildParentFightContainer(idBoss, nameBoss);
            bossIsKilled(idFight,idBoss,nameBoss,duration,killedBossInfo, idBoss);
            bossIsNotKilled(idFight,idBoss,nameBoss,duration,killedBossInfo, idBoss);
            isTrash(idFight,idBoss,nameBoss,duration, idBoss);
            reportTargetedSummary(idReport,idFight,idBoss, startBoss, endBoss, ApiKey);
        }
    }).catch(function (error) {
        // if there's an error, log it
        console.log(error);
    });
    $('.loader').addClass('hidden');
}











