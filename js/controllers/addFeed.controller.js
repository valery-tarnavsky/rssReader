angular.module('rssReader').controller('AddFeedController', ['$scope', '$state', 'AddFeedService', 'GetFeedService', function ($scope, $state, AddFeedService, GetFeedService) {

    $scope.categories = AddFeedService.getCategories();
    $scope.getFeeds = function() {
        AddFeedService.getXmlFeed($scope.feedLink);
    };

    $scope.customCategory = false;
   $scope.checkIfCustom = function () {
       $scope.customCategory = $scope.selectedCategory.toLowerCase() == 'custom';
    };

    $scope.addNewCategory = function () {
        AddFeedService.addNewCategory($scope.newCustomCategory);
    };

    $scope.setFeedCategory = function() {
        if ($scope.customCategory){
            $scope.addNewCategory();
            AddFeedService.setFeedCategory($scope.newCustomCategory);
        }else{
            AddFeedService.setFeedCategory($scope.selectedCategory);
        }
    };

    $scope.validation = function(){
        if($scope.feedLink && $scope.selectedCategory && ($scope.customCategory ?  $scope.newCustomCategory : true)){
            $scope.addNewFeed();
        }else {
        }
    };

   $scope.addNewFeed = function () {
       $scope.getFeeds();
       $scope.setFeedCategory();
       $state.go('dashboard.th-large', { type: 'all'});
    }

}]);

