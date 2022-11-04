//https://assets.rpglogs.com/img/eso/maps/craglorn/helracitadel_base.jpg

//Link pour map

// $('.nav-item').click(function () {
//     let target = $(this).data('nav');
//     $('.bloc-main').addClass('!hidden');
//     $('.bloc-main#' + target).removeClass('!hidden');
// });

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
    $('.title-container').html('<div onclick="showBossContainer()" class="block h-10 w-10 rounded-lg bg-gray-200 text-black text-xs flex items-center justify-center mr-4 cursor-pointer  hover:bg-gray-300"><</div><span class="uppercase font-extrabold">' + name + '</span>');
    $('#fights-content').addClass('hidden');
    $('#group-content').removeClass('hidden');
    $('#user-content').addClass('hidden');
    $('.group-container').addClass('hidden');
    $('#group-' + id).removeClass('hidden');
}

function showUserTeam(id, name) {
    $('#input-content').addClass('hidden');
    $('.title-container').html('<div onclick="showBossContainer()" class="block h-10 w-10 rounded-lg bg-gray-200 text-black text-xs flex items-center justify-center mr-4 cursor-pointer  hover:bg-gray-300"><</div><span class="uppercase font-extrabold">Users</span>');
    $('#fights-content').addClass('hidden');
    $('#group-content').addClass('hidden');
    $('#user-content').removeClass('hidden');
    $('.user-container').addClass('hidden');
    $('#user-' + id).removeClass('hidden');
}




$('#gear').click(function(){
    $('.gear-container').toggleClass('!hidden');
    $(this).toggleClass('bg-white !text-black');
})
$('#spell').click(function(){
    $('.spell-container').toggleClass('!hidden');
    $(this).toggleClass('bg-white !text-black');
})

// function builderContentMain(title, id) {
//     $(".title-container").html(title);
//     $("#" + id).append('<div id="container-' + id + '" class="overflow-auto h-full flex items-center justify-center"></div>');
// }

function buildGearForChara(data, idPerso, boss, target) {
    let nameGear = data.name;
    let champLvlGear = data.championPoints;
    let qualityGear = qualityEquipment[data.quality];
    let traitGear = traitType[data.trait];
    let enchantGear = enchantType[data.enchantType];
    let enchantQuality = qualityEnchant[data.enchantQuality];
    if (data.id > 0) {
        $(target).append("<div class='flex justify-between w-full mb-2 text-xs' style='text-transform: capitalize;color:" + qualityGear + "'>" + nameGear +
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

// function buildBuffForChara(data, dataPick ,idChara, idBoss) {
//    // console.log(data, dataPick);
//     $('#group-' + idBoss + ' #buff-' + idChara).append("<img style='width: 35px' src='.png'>")
// }

function showBossContainer() {
    $('.title-container').html('');
    $('.bloc-main').addClass('hidden');
    $('.bloc-main#fights-content').removeClass('hidden');
}

// function showGroupContainer(){
    
// }

// function showPlayerContainer(){

// }

let fightMap = {};
let trashMap = {}
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
            $('.title-container span').html(nameTrial + ' - ' + timeConverter(timestampWithoutMillisecond(startTrial)) + ' - ' + timeDuration(durationTrial));
            $("#input-content").remove();
            $('#fights-content').removeClass('hidden');
            for (let fight of data.fights) {
                if(fight.boss > 0 && fight.kill){
                    let idBoss = fight.boss;
                    let nameBoss = fight.name;
                    let startBoss = fight.start_time;
                    let endBoss = fight.end_time;
                    let durationBoss = timeDuration(timestampWithoutMillisecond(endBoss) - timestampWithoutMillisecond(startBoss));
                    $('#fights-content').append('<div class="boss-item h-full w-full text-white text-4xl font-extrabold flex items-center justify-center flex-col gap-5 cursor-pointer text-center" ><img class="h-24 rounded-lg" src="https://assets.rpglogs.com/img/eso/bosses/'+idBoss+'-icon.png"/>' + nameBoss + '<br>'+durationBoss+
                    '<div class="flex items-center justify-center gap-10 uppercase font-extrabold"><div class="border-2 border-white rounded-lg text-sm px-4 h-10 flex items-center justify-center hover:bg-white hover:text-black" onclick="showBossTeam(' + idBoss + ',\'' + nameBoss + '\')">Show Group</div>'+
                    '<div class="border-2 border-white rounded-lg text-sm px-4 h-10 flex items-center justify-center hover:bg-white hover:text-black" onclick="showUserTeam(' + idBoss + ',\'' + nameBoss + '\')">Show User</div></div></div>');
                    $('.boss-container-nav').append('<li class="w-16 h-16 flex items-center justify-center cursor-pointer relative hover:bg-gray-100 group" onclick="showBossTeam(' + idBoss + ',\'' + nameBoss + '\')" ><img class="h-10 w-10 rounded-lg overflow-hidden" src="https://assets.rpglogs.com/img/eso/bosses/'+idBoss+'-icon.png"/><span class="absolute left-full top-1/2 ml-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white w-max opacity-0 group-hover:opacity-100 hidden group-hover:block">'+nameBoss+'</span></li>');
                    $('#group-content').append('<div id="group-' + idBoss + '" class="group-container hidden grid grid-cols-1 xl:grid-cols-2 gap-4 p-6 overflow-auto h-[calc(100vh-8rem)]"></div>');
                    $('#user-content').append('<div id="user-' + idBoss + '" class="user-container hidden grid grid-cols-3 gap-4 p-6 overflow-auto h-full"></div>');
                    preciseFight(reportSign, idBoss, startBoss, endBoss, nameBoss);
                }
            }
        })
        .catch((error) => {
            console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
        });
}

let allGroupMap = {};
//'summary', 'damage-done', 'damage-taken', 'healing', 'casts', 'summons', 'buffs', 'debuffs', 'deaths', 'survivability', 'resources', 'resources-gains'.
function preciseFight(report, idBoss, start, end, nameBoss) {
    $('#input-content').remove();
    $('body').append('<div class="loader fixed inset-0 bg-white text-black text-6xl font-extrabold uppercase flex items-center justify-center">LOADING</div>');
    Promise.all([
        fetch("https://www.esologs.com:443/v1/report/tables/summary/" + report + "?start=" + start + "&end=" + end + "&api_key=b578a559d4215fb444928808da6976ec"),
        fetch("https://www.esologs.com:443/v1/report/tables/damage-done/" + report + "?start=" + start + "&end=" + end + "&api_key=b578a559d4215fb444928808da6976ec"),
        fetch("https://www.esologs.com:443/v1/report/tables/casts/" + report + "?start=" + start + "&end=" + end + "&api_key=b578a559d4215fb444928808da6976ec"),
        fetch("https://www.esologs.com:443/v1/report/tables/summons/" + report + "?start=" + start + "&end=" + end + "&api_key=b578a559d4215fb444928808da6976ec"),
        fetch("https://www.esologs.com:443/v1/report/tables/buffs/" + report + "?start=" + start + "&end=" + end + "&api_key=b578a559d4215fb444928808da6976ec"),
        fetch("https://www.esologs.com:443/v1/report/tables/deaths/" + report + "?start=" + start + "&end=" + end + "&api_key=b578a559d4215fb444928808da6976ec")
    ]).then(function (responses) {
        // Get a JSON object from each of the responses
        return Promise.all(responses.map(function (response) {
            $('.loader').addClass('hidden');
            return response.json();
        }));
    }).then(function (data) {
        // Log the data to the console
        // You would do something with both sets of data here
        //console.log();
        let summary = data[0];
        let damageDone = data[1];
        let casts = data[2];
        let summons = data[3];
        let buffs = data[4];
        let deaths = data[5];

        let allGroup = summary.composition;
        let allDamageDone = summary.damageDone;
        let pDetail = summary.playerDetails;
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
                allGroupMap[data[indexP].id]['buffs'] = [];
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
            let cpm = allGroupMap[f].cpm;
            console.log(allGroupMap[f].id);
            $('#group-' + idBoss).append('<div id="' + displayName + '" class="item-group flex justify-center flex-col p-6 rounded-lg border border-4 shadow-md bg-gray-80 border-gray-800" data-role="' + allGroupMap[f].role + '">' +
                '<div class="text-sm font-bold tracking-tight text-gray-900 dark:text-white flex items-center justify-between w-full">' +
                '<div class="flex items-center justify-between w-full"><div class="flex items-center justify-center"><img class="composition-icon sprite actor-sprite-' + classChara + ' mr-2" src="' + pathIconDD + '"><span>' + name + ' - ' + displayName + ' - ' + classChara + '</span></div><span>' + parseFloat(dmgPerDD).toPrecision(3) + dmgPerDD.replace(/[^B|M|K]/g, "") + ' / ' + percentDmg.toFixed(2) + '%</span></div>' +
                '</div>' +
                '<div id="gear-' + idChara + '" class="gear-container mt-6 !hidden"></div>' +
                '<div id="spell-' + idChara + '" class="spell-container mt-6  flex justify-between w-full !hidden"></div>' +
                '</div>' +
                '</div>');
                $('#user-'+ idBoss).append('<div class=" flex items-center justify-center flex-col p-6 rounded-lg border border-4 shadow-md bg-gray-80 border-gray-800 text-white relative cursor-pointer hover:bg-gray-800">'+
                '<div class="font-extrabold flex items-center justify-center"><img class="composition-icon sprite actor-sprite-' + classChara + ' mr-2" src="' + pathIconDD + '">' + name + '</div><span class="absolute top-4 left-4 text-gray-700 text-xs">' + displayName + '</span><span class="absolute bottom-4 right-4 text-xs text-gray-400">' + classChara + '</span>'+
                '</div>');
                $('#user-content').append('<div id="chara-'+idChara+'-'+idBoss+'" class="p-6 overflow-auto h-full gap-4 flex flex-col">'+
                '<div><div class="text-4xl text-white font-extrabold flex items-center"><img class="composition-icon sprite actor-sprite-' + classChara + ' mr-4" src="' + pathIconDD + '">' + name + '</div>'+cpm+'</div>'+
                '<div class="grid grid-flow-col auto-cols-max gap-4 container-user-'+idChara+'-'+idBoss+'"></div>'+
                '</div>');
                $('.container-user-'+idChara+'-'+idBoss).append('<div class="flex flex-col rounded-lg border border-4 shadow-md bg-gray-80 border-gray-800 text-white relative">'+
                '<div class="text-white font-bold text-xl p-6 bg-gray-800">Stuffs</div>'+
                '<div class="p-6 stuff"></div></div>');
                $('.container-user-'+idChara+'-'+idBoss).append('<div class="flex flex-col rounded-lg border border-4 shadow-md bg-gray-80 border-gray-800 text-white relative">'+
                '<div class="text-white font-bold text-xl p-6 bg-gray-800">Damage Done</div>'+
                '<div class="p-6 dmg"></div></div>');
                $('.container-user-'+idChara+'-'+idBoss).append('<div class="flex flex-col rounded-lg border border-4 shadow-md bg-gray-80 border-gray-800 text-white relative">'+
                '<div class="text-white font-bold text-xl p-6 bg-gray-800">Spell</div>'+
                '<div class="p-6 spell"></div></div>');
                $('.container-user-'+idChara+'-'+idBoss).append('<div class="flex flex-col rounded-lg border border-4 shadow-md bg-gray-80 border-gray-800 text-white relative">'+
                '<div class="text-white font-bold text-xl p-6 bg-gray-800">Set Uptime</div>'+
                '<div class="p-6 set"></div></div>');
                $('.container-user-'+idChara+'-'+idBoss).append('<div class="flex flex-col rounded-lg border border-4 shadow-md bg-gray-80 border-gray-800 text-white relative">'+
                '<div class="text-white font-bold text-xl p-6 bg-gray-800">Buffs</div>'+
                '<div class="p-6 buff"></div></div>');
                
            for (let g in gear) {
                if (gear[g].id > 0) {
                    buildGearForChara( gear[g],idChara, idBoss, '#group-' + idBoss + ' #gear-' + idChara );
                    buildGearForChara( gear[g],idChara, idBoss, '.container-user-'+idChara+'-'+idBoss+' .stuff' );
                }
            }
            for (let t in talents) {
                builderCompForChara(talents[t], idChara, idBoss);
            }
        }

    }).catch(function (error) {
        // if there's an error, log it
        console.log(error);
    });
      
}

     /*
        for (let [k, v] of Object.entries(buffsTab)) {   
            fetch("https://www.esologs.com:443/v1/report/tables/buffs/" + report + "?start=" + start + "&end=" + end + "&abilityid="+v.code+"&api_key=b578a559d4215fb444928808da6976ec")
            .then((response) => response.json())
            .then(function(buffsTable){
                for (let [key, value] of Object.entries(buffsTable['auras'])) {
                    allGroupMap[value.id]['uptime' + k] = value.totalUptime;
                }    
            }).catch(function (error) { });
        }*/




// var chartData = {
//     datasets: [{
//         label: 'My First Dataset',
//         data: [300, 50, 100],
//         backgroundColor: [
//           'rgb(255, 99, 132)',
//           'rgb(54, 162, 235)',
//           'rgb(255, 205, 86)'
//         ],
//         hoverOffset: 4
//       }],
//     labels: ['Red', 'Blue', 'Purple', 'Yellow']
// };

// let ctx = document.getElementById('myChart');
// let myPieChart = new Chart(ctx, {
//     type: 'doughnut',
//     data: chartData,
//     options: {
//       responsive: true,
//       plugins: {
//         legend: {
//           position: 'top',
//         },
//         title: {
//           display: true,
//           text: 'Chart.js Doughnut Chart'
//         }
//       }
//     },
// });
