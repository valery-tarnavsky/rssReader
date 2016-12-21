angular.module('rssReader').factory('feedDataService',['$http', function($http) {
var selectedSubcategory;
var feedCategory;

    var data = [{ name: "News"},
                { name: "IT"  },
                { name: "Design"},
                { name: "Sport"},
                { name: "Movies"},
                { name: "Music" },
                { name: "Culture"},
                { name: "Nature" },
                { name: "Gaming" },
                { name: "Food"},
                { name: "Economics"},
                { name: "Science"},
                { name: "Culture"},
                { name: "Custom"}];


    function findIndex(arr, prop, val){
        return arr.map(function(find) { return find[prop]; }).indexOf(val);
    }

    function addFeedList(arr, feedList){
        arr.push(feedList);
    }

    function getParsedFeed(url) {
        return $http.jsonp('https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&output=json_xml&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url)).
        then(function(response) {
            var index = findIndex(data, 'name', feedCategory);
            if(!('subcategories' in data[index])){
                data[index].subcategories = [];
            }
            addFeedList(data[index].subcategories, response.data.responseData.feed);
            /*console.log(response.data.responseData.feed);*/
            parseXml (response.data.responseData.xmlString);
        });
    }

    function parseXml (xmlDoc){
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(xmlDoc, "text/xml");
        /*console.log(createImgArray(xmlDoc));*/
    }

    function createImgArray(xmlDoc) {
        var channel = xmlDoc.getElementsByTagName('channel')[0];
        var img = channel.getElementsByTagName("enclosure");
        var imgUrl = [];
        for (var i = 0; i < img.length; i++) {
            imgUrl.push(img[i].getAttribute('url'));
        }
        return imgUrl;
    }

    function addNewCategory(category){
        data.push({name:category});
    }

    function setFeedCategory (setFeedCategory){
        feedCategory = setFeedCategory;
    }

    function setSelectedSubcategory(subcategoryName){
        selectedSubcategory = subcategoryName;
    }

    function getSelectedSubcategory(){
        return selectedSubcategory;
    }

    function getFeedList(){
        return data;
    }

    return {
        getParsedFeed: getParsedFeed,
        getFeedList: getFeedList,
        addNewCategory: addNewCategory,
        setFeedCategory : setFeedCategory,
        setSelectedSubcategory: setSelectedSubcategory,
        getSelectedSubcategory: getSelectedSubcategory



    };

}]);
