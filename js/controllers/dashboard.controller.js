rssReader.controller('DashboardController', ['$scope', '$state', '$stateParams', '$filter', 'AddFeedService', function($scope, $state, $stateParams, $filter, AddFeedService) {
    $scope.feedItems = AddFeedService.getFeedItems();
    $scope.feeds = AddFeedService.getFeeds();


    /* sort feeds*/
    $scope.reverse = false;
    $scope.sort = function(reverse){
        $scope.reverse = reverse;
    };

    $scope.showFeedTitle = function(selectedFeedId){
        angular.forEach($scope.feeds, function(item){
            $scope.feedTitle = item.id == selectedFeedId ? item.title : '';
        });
    };

    $scope.showFeedItems =  function(selectedFeedId){
        $scope.filteredFeeds = $filter("filter")( $scope.feedItems, {feedId: selectedFeedId});
    };

    $scope.getSelectedFeed = function(){
        $scope.showFeedTitle($state.params.feed);
        $scope.showFeedItems($state.params.feed);
    };

    $scope.getAllFeedItems =  function() {
        $scope.filteredFeeds = $scope.feedItems;
        $scope.feedTitle = "All"
    };

    $scope.getContent = function() {
        $state.params.type == "all" ? $scope.getAllFeedItems() : $scope.getSelectedFeed();
    };

    $scope.$watchCollection(function(){
        return $state.params;
    }, function(){
        $scope.getContent();
    });


    $scope.hideFeedHeader = function(){
        return $state.includes('*.th-list') || $state.includes('*.list') || $state.includes('*.th-large');
    }
}]);