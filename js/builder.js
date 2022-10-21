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


function timestampWithoutMillisecond(timestamp) {
    return Math.trunc(timestamp / 1000);
}

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year;
    return time;
}

function timeDuration(t) {
    var a = new Date(t * 1000);
    var min = a.getMinutes();
    if (min < 10) { min = '0' + min }
    var sec = a.getSeconds();
    if (sec < 10) { sec = '0' + sec }
    var time = min + ':' + sec;
    return time;
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
let buffsTab = {
    ForceMajeure: {
        code: 154830,
        pathImg:'https://assets.rpglogs.com/img/eso/abilities/ability_buff_major_force.png'
    },
    ForceMajeureCor :{
        code: 40225,
        pathImg:'https://assets.rpglogs.com/img/eso/abilities/ability_ava_003.png'
    },
    ForceMineure :{
        code: 61746,
        pathImg:'https://assets.rpglogs.com/img/eso/abilities/ability_buff_minor_force.png'
    },
    BerserkMajeur: {
        code: 150757,
        pathImg:'https://assets.rpglogs.com/img/eso/abilities/ability_buff_major_berserk.png'
    },
    BerserkMineur: {
        code: 62636,
        pathImg:'https://assets.rpglogs.com/img/eso/abilities/ability_buff_minor_berserk.png'
    },
    BrutaliteMajeure: {
        code:61665,
        pathImg:'https://assets.rpglogs.com/img/eso/abilities/ability_buff_major_brutality.png'
    },
    BrutaliteMineure: {
        code:61799,
        pathImg:'https://assets.rpglogs.com/img/eso/abilities/ability_buff_minor_brutality.png'
    },
    CourageMajeur: {
        code:66902,
        pathImg:'https://assets.rpglogs.com/img/eso/abilities/ability_mage_045.png'
    },
    CourageMineur : {
        code:147417,
        pathImg:'https://assets.rpglogs.com/img/eso/abilities/ability_buff_minor_courage.png'
    },
    Dynamisation: {
        code:61737,
        pathImg:'https://assets.rpglogs.com/img/eso/abilities/ability_buff_major_empower.png'
    },
    CorAgressif : {
        code:94800,
        pathImg:'https://assets.rpglogs.com/img/eso/abilities/ability_ava_003.png'
    },
    AssautPuissant: {
        code:61771,
        pathImg:'https://assets.rpglogs.com/img/eso/abilities/ability_healer_019.png'
    },
    OpportunisteRugissant: {
        code:135924,
        pathImg:'https://assets.rpglogs.com/img/eso/abilities/gear_seagiant_staff.png'
    },
    TueurMajeur: {
        code:93109,
        pathImg:'https://assets.rpglogs.com/img/eso/abilities/ability_buff_major_slayer.png'
    },
    ProphetieMajeure: {
        code:61689,
        pathImg:'https://assets.rpglogs.com/img/eso/abilities/ability_buff_major_prophecy.png'
    },
    Kilt: {
        code:155149,
        pathImg:'https://assets.rpglogs.com/img/eso/abilities/gear_kothringikilt_a.png'
    },
}



// 61746 = Force mineure

// Berserk Majeur,
// Berserk Mineur
// 
// 
// Courage Majeur
// Courage mineur
// Intellect Majeur
// Prophétie Majeure
// Sorcellerie Majeure
// Sorcellerie Mineure
// Sauvagerie Majeure
// Sauvagerie Mineure
// Tueur Majeur
// Tueur Mineur

