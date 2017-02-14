rssReader.controller('SidebarController', ['$scope', '$state', '$stateParams', '$window', '$q', 'feedDataService', 'feedsPromise', function($scope, $state, $stateParams, $window, $q, feedDataService, feedsPromise) {
    $scope.height = $window.innerHeight;
    $scope.feeds = feedsPromise;

    $scope.checkIfEmpty = function () {
        return $scope.feeds.length;
    };

    $scope.goToAddFeed = function(){
        $state.go('dashboard.addFeed');
    };

    $scope.$watch('feeds.length', function (){
        $scope.checkIfEmpty() ? true : $scope.goToAddFeed();
    });

    $scope.getItemsByFeed = function (selectedFeed){
        $state.go('dashboard.th-large', { type: 'feed', feed: selectedFeed});
    };

    $scope.getAllFeedItems = function (){
        $state.go("dashboard.th-large",{ type: 'all', feed: null});
    };


}]);