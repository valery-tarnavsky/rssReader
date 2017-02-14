angular.module('rssReader').factory('feedDataService',['$http', '$window',  function($http, $window) {
    var categories = ["News","IT", "Design", "Sport", "Movies", "Music", "Culture", "Nature", "Gaming", "Food", "Economics", "Science", "Custom"];
    var feedCategory;
    var feeds = [];

    var feedCounter = 1;

    function addNewCategory(category){
        categories.unshift(category);
    }

    function setFeedCategory (setFeedCategory){
        feedCategory = setFeedCategory;
    }

    function removeFeed (feedId) {
        return $http.delete("/deleteFeed/" + feedId).then(function (res) {
        }, function (err) {
            console.log(err);
        });
    }


    function getAllFeeds() {
        return $http.get('/getAllFeeds').then(function(response){
            return response.data;
        })
    }

    function getParsedFeeds(url) {
        return $http.post('/getParsedFeed', {url:url}).then(function(response){
            saveFeed(createFeedItemsArray(response.data.feed), response.data.feed[0]['meta']['rss:title']['#'], feedCategory)
        })
    }

    function saveFeed(entries, title, category) {
        return $http.post('/addFeed', {entries: entries, title: title, category : category})
            .then(function(res) {
                    console.log("response in getSavedFeed:", res);
                    $window.location.href = '/';
                    return res;
            },function(error) {
                    console.log('Can not get saved feed');
            })
    }


    function createFeedItemsArray(data) {
        var feedItems = [];
        angular.forEach(data, function (item){
            var feedItem = {
                title   : item.title,
                link    : item.link,
                img     : getImageSrc(item),
                content : getInnerText(item.description),
                date    : Date.parse(item.date)
        };
            feedItems.push(feedItem);
        });
        return feedItems.slice(0, 10);
    }

    function getInnerText(str) {
        return str.replace(/<[^>]+>/gm, '');
    }

    function getImageSrc(item) {
        var src;
        switch (true) {
            case "rss:enclosure" in item :
                src = item.enclosures[0].url;
               break;
            case "media:content" in item || "media:thumbnail" in item :
                src = item.image.url;
                break;
            default:
                try {
                    var description = item.description;
                    var regex = /src\s*=\s*"(.+?)"/;
                    src = regex.exec(description)[1];
                }
                catch (e){
                    if (src == "" || typeof (src) == 'undefined') {
                        src = "./img/dummy.png";
                    }
                }
        }
        return src;
    }

    function getCategories(){
        return categories;
    }

    function getFeeds(){
        return feeds;
    }

    return {
        getCategories   : getCategories,
        getFeeds        : getFeeds,
        getParsedFeeds  : getParsedFeeds,
        addNewCategory  : addNewCategory,
        setFeedCategory : setFeedCategory,
        getAllFeeds     : getAllFeeds,
        removeFeed      : removeFeed
    };

}]);
