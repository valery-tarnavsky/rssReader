angular.module('rssReader').factory('feedDataService',['$http',  function($http) {
    var categories = ["News","IT", "Design", "Sport", "Movies", "Music", "Culture", "Nature", "Gaming", "Food", "Economics", "Science", "Custom"];
    var feedCategory;
    var feeds = [];
    var feedItems = [];
    var feedCounter = 1;
    var feedItemCounter = 1;
    var isLoaded = true;

    function addNewCategory(category){
        categories.unshift(category);
    }

    function setFeedCategory (setFeedCategory){
        feedCategory = setFeedCategory;
    }

    function getCurrentFeed(){
        return feedCategory;
    }


    function getParsedFeeds(url) {
        return $http.post('/getParsedFeed', {url:url}).then(function(response){
            createFeedsArray (response.data.feed);
        }).finally(function() {
            isLoaded = false;
        });
    }


    function createFeedsArray(data) {
        var feed = {
            id       : feedCounter++,
            title    : data[0]['meta']['rss:title']['#'],
            category : feedCategory
        };
        feeds.push(feed);
        createFeedItemsArray(data, feed.id);
    }


    function createFeedItemsArray(data, feedId) {
        angular.forEach(data, function (item){
            var feedItem = {
                id      : feedItemCounter++,
                title   : item.title,
                link    : item.link,
                img     : getImageSrc(item),
                content : getInnerText(item.description),
                date    : Date.parse(item.date),
                feedId  : feedId
        };
            feedItems.push(feedItem);
        })
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

    function getLoadStatus(){
        return isLoaded;
    }


    function getCategories(){
        return categories;
    }

    function getFeeds(){
        return feeds;
    }
    function getFeedItems(){
        return feedItems;
    }

    return {
        getLoadStatus   : getLoadStatus,
        getCategories   : getCategories,
        getFeeds        : getFeeds,
        getFeedItems    : getFeedItems,
        getParsedFeeds  : getParsedFeeds,
        addNewCategory  : addNewCategory,
        setFeedCategory : setFeedCategory,
        getCurrentFeed  : getCurrentFeed
    };

}]);
