rssReader.controller('SidebarController', ['$scope', '$state', '$stateParams', '$window', 'feedDataService', function($scope, $state, $stateParams, $window, feedDataService) {
    $scope.height = $window.innerHeight;
    $scope.feeds = feedDataService.getFeeds();

    $scope.checkIfEmpty = function () {
        return $scope.feeds.length;
    };

    $scope.goToAddFeed = function(){
        $state.go('dashboard.addFeed');
    };

    $scope.checkIfEmpty() ? true : $scope.goToAddFeed();

    function findIndex(arr, prop, val){
        return arr.map(function(find) { return find[prop]; }).indexOf(val);
    }

    function sortFeedsByCategory() {
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
        sortFeedsByCategory();
    });

    $scope.getItemsByFeed = function (selectedFeed){
        $state.go('dashboard.th-large', { type: 'feed', feed: selectedFeed});
    };

    $scope.getAllFeedItems = function (){
        $state.go("dashboard.th-large",{ type: 'all'});
    };


}]);