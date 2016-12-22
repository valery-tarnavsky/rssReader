rssReader.controller('SidebarController', ['$scope', '$state', '$stateParams', 'feedDataService', function($scope, $state, $stateParams, feedDataService) {
    $scope.feeds = feedDataService.getFeeds();

    $scope.checkIfEmpty = function () {
        if($scope.feeds.length == 0){
            $state.go('dashboard.addFeed');
        }
        return $scope.feeds.length;
    };

    $scope.getAllFeedItems = function (){
        $state.go("dashboard.th-large",{ type: 'all' });
    };

    function findIndex(arr, prop, val){
        return arr.map(function(find) { return find[prop]; }).indexOf(val);
    }

    function getFeedsByCategory() {
        $scope.sortedFeeds = [];
        angular.forEach($scope.feeds, function (feed) {
            var index = findIndex($scope.sortedFeeds, 'name', feed.category);
            if(index === -1){
                $scope.sortedFeeds.push({
                    name: feed.category,
                    feeds: [feed]
                })
            } else {
                $scope.sortedFeeds[index].feeds.push(feed)
            }
        });
    }
    $scope.$watch('feeds.length', function (){
        getFeedsByCategory();
    });

    $scope.getItemsByFeed = function (selectedFeed){
        $state.go('dashboard.th-large', { type: 'feed', feed: selectedFeed.id});
    }


}]);