angular.module('rssReader').factory('feedDataService',['$http', function($http) {
    var categories = ["News","IT", "Design", "Sport", "Movies", "Music", "Culture", "Nature", "Gaming", "Food", "Economics", "Science", "Custom"];
    var feedCategory;
    var feeds = [];
    var feedItems = [];
    var feedCounter = 1;
    var feedItemCounter = 1;

    function addNewCategory(category){
        categories.unshift(category);
    }

    function setFeedCategory (setFeedCategory){
        feedCategory = setFeedCategory;
    }


    function getXmlFeed(url) {
        return $http.jsonp('https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&output=xml&num=10&callback=JSON_CALLBACK&q=' + encodeURIComponent(url)).
        then(function(response) {
            parseXml (response.data.responseData.xmlString);
        });
    }

    function checkFeedFormat(xmlDoc) {
        if (xmlDoc.getElementsByTagName('rss').length) {
            return 'rss';
        } else if (xmlDoc.getElementsByTagName('feed').length) {
            return 'atom';
        }else{
            return false;
        }
    }

    function parseXml (xml){
        var parser = new DOMParser();
        var parsedXml = parser.parseFromString(xml, "text/xml");
        createFeedObject(parsedXml, checkFeedFormat(parsedXml));
    }

    function createFeedObject(parsedXml) {
        var channel = parsedXml.getElementsByTagName('channel')[0];
        var feed = {
            id       : feedCounter++,
            title    : channel.getElementsByTagName('title')[0].childNodes[0].textContent,
            category : feedCategory
        };
        feeds.push(feed);
        getRssFeedItems(parsedXml, feed.id);
    }


    function getRssFeedItems(parsedXml, feedId) {
        var item = parsedXml.getElementsByTagName('item');
        for (var i = 0; i < item.length; i++) {
            var feedItem = {
                id      : feedItemCounter++,
                title   : item[i].getElementsByTagName('title')[0].textContent,
                link    : item[i].getElementsByTagName('link')[0].textContent,
                img     : getRssImageSrc(item[i]),
                content : getInnerText(item[i].getElementsByTagName('description')[0].textContent),
                date    : Date.parse(item[i].getElementsByTagName('pubDate')[0].textContent),
                feedId  : feedId
            };
            feedItems.push(feedItem);
        }
    }
   /* | \[(.*?)]*/
    function getInnerText(str) {
        return str.replace(/<[^>]+>/gm, '');
    }

    function getRssImageSrc(item) {
        var src;
        switch (1) {
            case item.getElementsByTagName('enclosure').length:
                src = item.getElementsByTagName('enclosure')[0].getAttribute('url');
                break;
            case $(item).find('media\\:content, content').length:
                src = $(item).find('media\\:content, content').attr('url');
                break;
            case $(item).find('media\\:thumbnail, thumbnail').length:
                src = $(item).find('media\\:thumbnail, thumbnail').attr('url');
                break;
            default:
                try {
                    var description = item.getElementsByTagName('description')[0].textContent;
                    var regex = /src\s*=\s*"(.+?)"/;
                    src = regex.exec(description)[0];
                }
                catch (e){
                    console.log(e.message);
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
    function getFeedItems(){
        return feedItems;
    }

    return {
        getCategories   : getCategories,
        getFeeds        : getFeeds,
        getFeedItems    : getFeedItems,
        getXmlFeed      : getXmlFeed,
        addNewCategory  : addNewCategory,
        setFeedCategory : setFeedCategory
    };

}]);
