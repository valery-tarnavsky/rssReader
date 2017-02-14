rssReader.controller('DashboardController', ['$scope', '$state', '$stateParams', '$filter', 'feedDataService', 'feedsPromise', function($scope, $state, $stateParams, $filter, feedDataService, feedsPromise) {

    $scope.currentFeedId = $state.params.feed;
    $scope.feeds = feedsPromise;
    $scope.feedItems = getAllEntries(feedsPromise);

    function getFeedPropertyById(feedId, property){
        var result = null;
        angular.forEach($scope.feeds, function(feed){
            angular.forEach(feed.feedItems, function(item){
                 if(item._id == feedId) {
                    result = item[property]
                }
            });
        });
        return result;
    }

    function getAllEntries(data){
        var result = [];
        angular.forEach(data, function(feed){
            angular.forEach(feed.feedItems, function(item){
                result.push(item.entries)
            });
        });
        result = [].concat.apply([], result);
        return result;
    }

    $scope.checkParam = function (){
        return $state.params.type == "all"
    };


    $scope.feedTitle = $scope.checkParam() ? "All" : getFeedPropertyById($scope.currentFeedId, 'title');
    $scope.filteredFeeds = $scope.checkParam() ? $scope.feedItems :  getFeedPropertyById($scope.currentFeedId, 'entries');

    /*if($scope.checkParam()){
        $scope.feedTitle = "All";
        $scope.filteredFeeds = $scope.feedItems;
    }else {
        $scope.feedTitle = getFeedPropertyById($scope.currentFeedId, 'title');
        $scope.filteredFeeds = getFeedPropertyById($scope.currentFeedId, 'entries');
    }*/

    /* sort feeds*/
    $scope.sort = function(reverse){
        $scope.reverse = reverse;
    };

    $scope.removeFeed = function(){
        feedDataService.removeFeed($scope.currentFeedId);
        console.log($scope.currentFeedId);
        $state.go('dashboard.th-large', { type: 'all', feed: null});
    };


    $scope.hideFeedHeader = function(){
        return $state.includes('*.th-list') || $state.includes('*.list') || $state.includes('*.th-large');
    }
}]);