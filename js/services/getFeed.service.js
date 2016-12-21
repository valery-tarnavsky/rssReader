angular.module('rssReader').factory('GetFeedService',['AddFeedService', function(AddFeedService) {
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
