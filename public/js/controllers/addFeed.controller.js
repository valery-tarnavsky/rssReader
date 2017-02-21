angular.module('rssReader').controller('AddFeedController', ['$scope', '$state', 'feedDataService', function ($scope, $state, feedDataService) {

    $scope.categories = feedDataService.getAllCategories();

    $scope.checkIfCustom = function () {
        return $scope.selectedCategory ? $scope.selectedCategory.toLowerCase() == 'custom' : false
    };

    $scope.getFeedCategory = function() {
        return $scope.checkIfCustom() ? $scope.newCustomCategory : $scope.selectedCategory;
    };

    $scope.getFeeds = function() {
        feedDataService.getSavedFeed($scope.feedLink, $scope.getFeedCategory()).then(function(res){
            $state.go('dashboard.th-large', { type: 'feed', feed: res.feedId}, {reload: true});
        });
    };

    $scope.validation = function(){
        $scope.submitted = true;
        if($scope.feedLink && $scope.selectedCategory && ($scope.checkIfCustom() ?  $scope.newCustomCategory : true)){
            $scope.addNewFeed();
        }else {
        }
    };

   $scope.addNewFeed = function () {
       $scope.getFeeds();
    }

}]);

