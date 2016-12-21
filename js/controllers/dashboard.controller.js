rssReader.controller('DashboardController', ['$scope', '$state', '$stateParams', '$filter', 'AddFeedService', 'GetFeedService', function($scope, $state, $stateParams, $filter, AddFeedService, GetFeedService) {
    $scope.category = $state.params.category;
    $scope.feedItems = AddFeedService.getFeedItems();

    /* sort feeds*/
    $scope.reverse = false;
    $scope.sort = function(reverse){
        $scope.reverse = reverse;
    };

    $scope.showFeedTitle = function(selectedFeedTitle){
        $scope.feedTitle = selectedFeedTitle;
    };

    $scope.showFeedItems =  function(selectedFeedId){
        $scope.filteredFeeds = $filter("filter")( $scope.feedItems, {feedId: selectedFeedId});
    };

    $scope.getSelectedFeed = function(){
        $scope.feed = GetFeedService.getSelectedFeed();
        $scope.showFeedTitle($scope.feed.title);
        $scope.showFeedItems($scope.feed.id);
    };

    $scope.getAllFeedItems =  function() {
        $scope.filteredFeeds = $scope.feedItems;
        $scope.showFeedTitle("All");
    };

    $scope.getContent = function() {
        $scope.category == "all" ? $scope.getAllFeedItems() : $scope.getSelectedFeed();
    };

    $scope.$watch(function(){
        return GetFeedService.getSelectedFeed();
    }, function(newValue, oldValue){
        newValue ? $scope.getContent() : false;
    }, true);

    $scope.hideFeedHeader = function(){
        return $state.includes('*.th-list') || $state.includes('*.list') || $state.includes('*.th-large');
    }
}]);