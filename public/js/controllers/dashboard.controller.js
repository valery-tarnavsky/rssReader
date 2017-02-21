rssReader.controller('DashboardController', ['$scope', '$state', '$stateParams', '$filter', 'feedDataService', 'feedsPromise', function($scope, $state, $stateParams, $filter, feedDataService, feedsPromise) {
    $scope.currentFeedId = $state.params.feed;
    $scope.feedItem = feedDataService.getArticlesById($scope.currentFeedId);

    switch (true) {
        case $state.params.type == "feed":
            $scope.filteredFeeds =  $scope.feedItem.articles;
            $scope.feedTitle =  $scope.feedItem.title;
            break;
        case $state.params.type == "all":
            $scope.filteredFeeds =  feedDataService.getAllArticles();
            $scope.feedTitle =  'All';
            break;
    }

    $scope.removeFeed = function(){
        feedDataService.removeFeed($scope.currentFeedId).then(function(response){
            $state.go('dashboard.th-large', { type: 'all', feed: null});
        });
    };


    $scope.updateFeeds = function(){
        feedDataService.updateFeeds().then(function(response){
            console.log(response);
            $state.go('dashboard.th-large', { type: 'all', feed: null});
        });
    };

    $scope.checkParam = function(){
        return $state.params.type == 'all';
    };

    $scope.sort = function(reverse){
        $scope.reverse = reverse;
    };

    $scope.hideFeedHeader = function(){
        return $state.includes('*.th-list') || $state.includes('*.list') || $state.includes('*.th-large');
    }
}]);