var rssReader = angular.module('rssReader',['ui.router']);
    rssReader.controller('mainController', ['$scope', '$state', function($scope, $state) {
        
}]);

rssReader.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('dashboard/th-large');
    $stateProvider
    .state({
        name: 'dashboard',
        url: '/dashboard',
        views: {
            '': {
                templateUrl: './partials/dashboard/dashboard.html',
                controller: 'DashboardController'
            },
            'sidebar@dashboard': {
                templateUrl: './partials/dashboard/sidebar.html',
                controller: 'SidebarController'
            }
        },
        params: {
            type: 'all'
        }
    })
        .state({
            name: 'dashboard.list',
            url: '/list?type&feed',
            templateUrl: './partials/feeds-view/list.html',
            controller: 'DashboardController'
        })
        .state({
            name: 'dashboard.th-list',
            url: '/th-list?type&feed',
            templateUrl: './partials/feeds-view/th-list.html',
            controller: 'DashboardController'
        })
        .state({
            name: 'dashboard.th-large',
            url: '/th-large?type&feed',
            templateUrl: './partials/feeds-view/th-large.html',
            controller: 'DashboardController'
        })
        .state({
            name: 'dashboard.fullPost',
            url: '/feeds/feed-item/:feedId',
            templateUrl: './partials/dashboard/fullPost.html',
            controller: 'PostsController',
            params: {
                feedId: null
            }
        })
        .state({
            name: 'dashboard.addFeed',
            url: '/addFeed',
            templateUrl: './partials/dashboard/addFeed.html',
            controller: 'AddFeedController'
        })
}]);

