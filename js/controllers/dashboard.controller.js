rssReader.controller('DashboardController', ['$scope', '$state', '$stateParams', '$filter', 'feedDataService', 'dashboardService', function($scope, $state, $stateParams, $filter, feedDataService, dashboardService) {
    var feeds = feedDataService.getFeeds(),
        feedItems = feedDataService.getFeedItems();

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

    $scope.feedTitle = $state.params.type == "all" ? "All" : getFeedTitleById($state.params.feed);
    $scope.filteredFeeds =  $state.params.type == "all" ? feedItems :  getFeedItemsById($state.params.feed);

    /* sort feeds*/
    $scope.sort = function(reverse){
        $scope.reverse = reverse;
    };


    $scope.hideFeedHeader = function(){
        return $state.includes('*.th-list') || $state.includes('*.list') || $state.includes('*.th-large');
    }
}]);