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

/*

$(document).on('click', '.item-container-boss', function () {
    let r = $(this).data('report');
    let idBoss = $(this).data('boss');
    let sB = $(this).data('start');
    let eB = $(this).data('end');
    preciseFight(r, idBoss, sB, eB);
})*/

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