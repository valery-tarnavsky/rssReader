$(document).ready(function() {
    setTimeout(function() {
        $('#side-menu').metisMenu({ toggle: true });
    }, 200);
    var sidebar = $("#sidebar-wrapper");
    var offCanvasToggle = $('.navbar-toggle');



    $('.sidebar-nav ul li').not('.dropdown-toggle').click(function() {
        var check = checkIfSidebarOpen();
        if (check){closeSidebar()}
    });

    function checkIfSidebarOpen() {
        if (sidebar.hasClass("in")){return true
        }else{
            return false
        }
    }
        offCanvasToggle.click(function(){
            offCanvasToggle.toggleClass("is-open")
        });

    function toggleoffCanvasButton() {
        var check = checkIfSidebarOpen();
        if (!check){
            offCanvasToggle.removeClass('is-open')
        }
    }

    function closeSidebar(){
        sidebar.offcanvas('hide');
        offCanvasToggle.removeClass('is-open');
        $('#content-wrapper').css('transition-delay', '1s');
    }


    $('.dropdown').on('show.bs.dropdown', function(e){
        $(this).find('.dropdown-menu').first().stop(true, true).slideDown(300);
    });
    $('.dropdown').on('hide.bs.dropdown', function(e){
        $(this).find('.dropdown-menu').first().stop(true, true).slideUp(300);
    });

    function sidebarHeightCorrection() {
        var navbarHeight = $(".navbar").height();
        $("#sidebar-wrapper .inner").css("height", ($(window).scrollTop()+$(window).height()-navbarHeight)+"px");
    }
    setTimeout(sidebarHeightCorrection, 110);

    $(window).resize(function(e) {sidebarHeightCorrection(e); toggleoffCanvasButton(e); });
    $(window).scroll(function(e) {sidebarHeightCorrection(e);});


});


$('#side-menu li').click(function(){
    console.log($(this));
    $(this).addClass("active");
})