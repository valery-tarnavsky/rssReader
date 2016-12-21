var sideMenu = angular.element(document).find(".sidebar-nav");

sideMenu.on('click', function() {
    console.log(sideMenu.children());
    sideMenu.children().removeClass('active');
    sideMenu.addClass('active');
});

