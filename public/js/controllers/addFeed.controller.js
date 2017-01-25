angular.module('rssReader').controller('AddFeedController', ['$scope', '$state', 'feedDataService', function ($scope, $state, feedDataService) {

    $scope.categories = feedDataService.getCategories();

    $scope.getFeeds = function() {
        feedDataService.getParsedFeeds($scope.feedLink);
    };

    $scope.customCategory = false;
    $scope.checkIfCustom = function () {
       $scope.customCategory = $scope.selectedCategory.toLowerCase() == 'custom';
    };

    $scope.addNewCategory = function () {
        feedDataService.addNewCategory($scope.newCustomCategory);
    };

    $scope.setFeedCategory = function() {
        if ($scope.customCategory){
            $scope.addNewCategory();
            feedDataService.setFeedCategory($scope.newCustomCategory);
        }else{
            feedDataService.setFeedCategory($scope.selectedCategory);
        }
    };

    $scope.validation = function(){
        $scope.submitted = true;
        if($scope.feedLink && $scope.selectedCategory && ($scope.customCategory ?  $scope.newCustomCategory : true)){
            $scope.addNewFeed();
        }else {
        }
    };

   $scope.addNewFeed = function () {
       $scope.getFeeds();
       $scope.setFeedCategory();
       $state.go('dashboard.th-large', { type: 'all', feed: ''});
    }

}]);

