angular.module('rssReader').service('feedDataService',['$http', function($http) {
    var that = this;
    this.CATEGORIES = ["News","IT", "Design", "Sport", "Movies", "Music", "Culture", "Nature", "Gaming", "Food", "Economics", "Science"];
    this.feeds = [];

    /* addFeed */

    this.getAllCategories = function () {
        var result = that.CATEGORIES.concat(getCustomCategories());
        result.push("Custom");
        return result;
    };

    function getCurrentFeedCategories() {
        var result = [];
        that.feeds.forEach (function(feed){
            result.push(feed.category);
        });
        return result;
    }

    function getCustomCategories(){
        var current = getCurrentFeedCategories();
        return current.filter(function (elem) {
            return that.CATEGORIES.indexOf(elem) == -1;
        });
    }

    /* dashboard */

    this.getArticlesById = function (feedId){
        var result = null;
        angular.forEach(that.feeds, function(feed){
            angular.forEach(feed.feedItems, function(item){
                if(item._id == feedId) {
                    result = {
                        title    : item.title,
                        articles : item.articles
                    }
                }
            });
        });
        return result;
    };

    this.getAllArticles = function(){
        var result = [];
        angular.forEach(that.feeds, function(feed){
            angular.forEach(feed.feedItems, function(item){
                result.push(item.articles)
            });
        });
        result = [].concat.apply([], result);
        return result;
    };

    
    /* Server queries */

    this.getSavedFeed = function (url, category) {
        return $http.post('/saveFeed', { url : url, category: category}).then(function(response){
           return response.data;
        })
    };

    this.getAllFeeds = function () {
        return $http.get('/getAllFeeds').then(function(response){
            angular.copy(response.data, that.feeds);
            return response.data;
        })
    };

    this.getSingleArticle = function (articleId) {
        return $http.get("/getSingleArticle/" + articleId).then(function (response) {
            return response.data;
        });
    };

    this.removeFeed = function  (feedId) {
        return $http.delete("/removeFeed/" + feedId).then(function (res) {
        }, function (err) {
            console.log(err);
        });
    };

    this.updateFeeds = function () {
        return $http.post('/updateFeeds').then(function(response){
            return response.data;
        })
    };


}]);
