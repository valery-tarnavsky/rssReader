rssReader.controller('SidebarController', ['$scope', '$state', '$stateParams', 'AddFeedService', 'GetFeedService', function($scope, $state, $stateParams, AddFeedService, GetFeedService) {
    $scope.feeds = AddFeedService.getFeeds();

    $scope.checkIfEmpty = function () {
        if(!$scope.feeds.length){
            $state.go('dashboard.addFeed');
        }
        return $scope.feeds.length;
    };

    $scope.getAllFeedItems = function (){
        $state.go("dashboard.th-large",{ category: 'all' });
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

    $scope.setSelectedFeed = function (selectedFeed){
        GetFeedService.setSelectedFeed(selectedFeed);
        $state.go('dashboard.th-large', { category: 'feed', feedId: selectedFeed.id });
    }


}]);