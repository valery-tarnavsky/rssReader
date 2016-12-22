rssReader.controller('PostsController', ['$scope', '$state', '$stateParams', '$filter', 'feedDataService', function($scope, $state, $stateParams, $filter, feedDataService) {
    $scope.feedItems = feedDataService.getFeedItems();
    $scope.fullPost = {};
    $scope.feedId = +$stateParams.feedId;
    if($scope.feedId){
        $scope.fullPost = $filter("filter")( $scope.feedItems, {id : $scope.feedId}, true)[0];
    }else{
        $state.go('dashboard');
    }
}]);