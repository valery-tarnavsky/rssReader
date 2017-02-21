rssReader.controller('PostsController', ['$scope', '$state', '$stateParams', '$filter', 'feedDataService', function($scope, $state, $stateParams, $filter, feedDataService) {
    $scope.feedId = $stateParams.feedId;
    if($scope.feedId){
       feedDataService.getSingleArticle($scope.feedId).then(function(response){
           $scope.fullPost = response;
       });
    }else{
        $state.go('dashboard');
    }
}]);