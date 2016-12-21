rssReader.controller('PostsController', ['$scope', '$state', '$stateParams', '$filter', 'AddFeedService', function($scope, $state, $stateParams, $filter, AddFeedService) {
    $scope.feedItems = AddFeedService.getFeedItems();
    $scope.fullPost = {};
    $scope.feedId = +$stateParams.feedId;
    if($scope.feedId){
        $scope.fullPost = $filter("filter")( $scope.feedItems, {id : $scope.feedId}, true)[0];
    }else{
        $state.go('dashboard');
    }
}]);