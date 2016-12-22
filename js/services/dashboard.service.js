angular.module('rssReader').factory('dashboardService',['feedDataService', function(feedDataService) {
    var selectedFeed;

    function setSelectedFeed(feed){
        selectedFeed = feed;
    }

    function getSelectedFeed(){
        return selectedFeed;
    }

    return {
        setSelectedFeed : setSelectedFeed,
        getSelectedFeed : getSelectedFeed
    };
}]);
