rssReader.controller('DashboardController', ['$scope', '$state', '$stateParams', '$filter', 'feedDataService', 'dashboardService', function($scope, $state, $stateParams, $filter, feedDataService, dashboardService) {
    $scope.loading = feedDataService.getLoadStatus();
    console.log($scope.loading);
    var feeds = feedDataService.getFeeds(),
        feedItems = feedDataService.getFeedItems(),
        currentFeedId = $state.params.feed;


    function getFeedItemsById(feedId){
        return  $filter("filter")( feedItems, {feedId: feedId});
    }

    function getFeedTitleById(feedId){
        var result = null;
        angular.forEach(feeds, function(item){
            if(item.id == feedId) {
                result = item.title
            }
        });
        return result;
    }

    $scope.checkParam = function (){
        return $state.params.type == "all"
    };

    $scope.feedTitle = $scope.checkParam() ? "All" : getFeedTitleById(currentFeedId);
    $scope.filteredFeeds =  $scope.checkParam() ? feedItems :  getFeedItemsById(currentFeedId);


    /* sort feeds*/
    $scope.sort = function(reverse){
        $scope.reverse = reverse;
    };

    $scope.removeFeed = function(){
        var toRemove =  feeds.map(function(item) { return item.id; }).indexOf(currentFeedId);
        feeds.splice(toRemove, 1);
        $scope.removeFeedItems();
        $state.go('dashboard.th-large', { type: 'all', feed: ''});
    };

    $scope.removeFeedItems = function(){
        var toRemove =  $filter("filter")( feedItems, {feedId: currentFeedId});
        feedItems = feedItems.filter(function(item) {
            return toRemove.indexOf(item) < 0;
        });
    };

    $scope.hideFeedHeader = function(){
        return $state.includes('*.th-list') || $state.includes('*.list') || $state.includes('*.th-large');
    }
}]);