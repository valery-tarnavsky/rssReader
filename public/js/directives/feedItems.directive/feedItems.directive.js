rssReader.directive('thLargeView', function () {
    return {
        restrict: 'E',
        scope: {
            feed: '='
        },
        templateUrl: 'js/directives/feedItems.directive/templates/th-large.html'
    }
});

rssReader.directive('listView', function () {
    return {
        restrict: 'E',
        scope: {
            feed: '='
        },
        templateUrl: 'js/directives/feedItems.directive/templates/list.html'
    }
});

rssReader.directive('thListView', function () {
    return {
        restrict: 'E',
        scope: {
            feed: '='
        },
        templateUrl: 'js/directives/feedItems.directive/templates/th-list.html'
    }
});

