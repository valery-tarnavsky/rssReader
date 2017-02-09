angular.module('rssReader').factory('feedDataService',['$http',  function($http) {
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

    /*function findIndex(arr, prop, val){
        return arr.map(function(find) { return find[prop]; }).indexOf(val);
    }

    function sortFeedsByCategory(data) {
        var sortedFeeds = [];
        return angular.forEach(data, function (feed) {
            var index = findIndex(sortedFeeds, 'name', feed.category);
            if(index === -1){
                sortedFeeds.push({
                    name: feed.category,
                    feeds: [feed]
                })
            } else {
                sortedFeeds[index].feeds.push(feed)
            }

            return sortedFeeds
        });
    }*/

    function getAllFeeds() {
        return $http.get('/getAllFeeds').then(function(response){
            console.log(response);
            return response;
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
                    return res;
            },function(error) {
                    console.log('Can not get saved feed');
            })
    }


    /*function createFeedsArray(data) {
        var feeds = [];
        var feed = {
            id        : feedCounter++,
            title     : data[0]['meta']['rss:title']['#'],
         /!*   category  : feedCategory,*!/
            feedItems : createFeedItemsArray(data)
        };
        feeds.push(feed);
        return feeds;
    }*/


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
        getAllFeeds     : getAllFeeds
    };

}]);
