var mongoose   = require('mongoose'),
	fs         = require("fs"),
	FeedParser = require('feedparser'),
    request    = require('request'),
	Feed       = mongoose.model('Feed'),
    Promise    = require('promise'),
    async      = require('async');

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

function createFeedsArray(data, category) {
    var feedItems = [];
    data.forEach(function (item){
        var feedItem = {
            title   : item.title,
            link    : item.link,
            img     : getImageSrc(item),
            content : getInnerText(item.description),
            date    : Date.parse(item.date)
        };
        feedItems.push(feedItem);
    });
    return {
        category : category,
        title    : data[0]['meta']['rss:title']['#'],
        articles : feedItems.slice(0, 50)
    };
}

function getParsedFeed(url, category) {
    return new Promise(function (resolve, reject){
        var feedparser = new FeedParser({ normalize : true, addmeta: true  });
        url.on('error', function (error) { console.log('Feed xml req error')});
        url.on('response', function (res) {
            var stream = this;
            if (res.statusCode !== 200) {
                this.emit('error', new Error('Bad status code'));
            } else {
                stream.pipe(feedparser);
            }
        });

        feedparser.on('error', function (error) { console.log("FeedParser error");});
        var parsedFeed = [];
        feedparser.on('readable', function () {
            var stream = this,
            meta = this.meta,
            item;
            while (item = stream.read()) {
                parsedFeed.push(item);
            }
        });
        feedparser.on('end', function() {
            resolve(createFeedsArray(parsedFeed,category))
        });
    });
}

module.exports.saveFeed = function (req, res) {
    getParsedFeed(request(req.body.url), req.body.category ).then(function(data){
        Feed.find({}, function(error, feeds) {
            var currentFeed = null;
            feeds.forEach(function (feed) {
                if (feed.category === data.category) {
                  currentFeed = feed;
                }
            });

            if(currentFeed) {
                currentFeed.feedItems.push({
                    rssLink  : req.body.url,
                    title    : data.title,
                    articles : data.articles
                });
                let length = currentFeed.feedItems.length;
                currentFeed.save(function (err) {
                    if (err) { throw err; }
                    res.send({
                        feedId: currentFeed.feedItems[length-1]._id
                    });
                });
            }else {
                var feed = new Feed({
                     category : req.body.category,
                     feedItems: []
                });
                feed.feedItems.push({
                    rssLink  : req.body.url,
                    title    : data.title,
                    articles : data.articles
                });
                let length = feed.feedItems.length;
                feed.save(function (err, feed) {
                    if (err) {throw err;}
                    console.log(length);
                    res.send({
                        feedId: feed.feedItems[length-1]._id
                    });
                });
            }

      });
    });
};

function getRssData (feeds){
        var rssData = [];
        var category;
        feeds.forEach(function (feed) {
            category = feed.category;
            feed.feedItems.forEach(function (item) {
                rssData.push({
                    url: item.rssLink,
                    category: category
                });
            });
        });
        return rssData;
}

function getParsedFeeds(rssData){
    var parsedFeeds = [];
    rssData.forEach(function(item, index, array){
        parsedFeeds.push(getParsedFeed(request(item.url), item.category));
    });
    return parsedFeeds;
}

module.exports.updateFeeds = function (req, res) {
           Feed.find({}, function(error, feeds) {
               var rssData = getRssData(feeds);
               Promise.all(getParsedFeeds(rssData)).then(function(newFeeds) {
                   async.each(newFeeds, function(newFeed, next){
                       async.each(feeds, function (oldFeed) {
                           if (newFeed.category === oldFeed.category) {
                               async.each(oldFeed.feedItems, function (oldFeedItem, index) {
                                   if (oldFeedItem.title === newFeed.title) {
                                       oldFeedItem.articles = newFeed.articles;
                                       oldFeedItem.save(function (err, feed) {
                                           if (err) {throw err;}
                                           next();
                                       });

                                       /*var feed = new Feed({
                                           category : newFeed.category,
                                           feedItems: []
                                       });
                                       feed.feedItems.push({
                                           rssLink  : newFeed.url,
                                           title    : newFeed.title,
                                           articles : newFeed.articles
                                       });
                                       feed.save(function (err, feed) {
                                           if (err) {throw err;}
                                           next();
                                       });*/
                                   }
                               })
                           }
                       })
                   }, function() {
                       res.json('newFeed');
                   });
               });

        });
};

module.exports.getAllFeeds = function(req, res) {
    Feed.find({}, function(error, feeds) {
        if(error) {
            res.send({
                err: "Error"
            })
        } else {
             res.send(feeds);
        }
    });
};

module.exports.getSingleArticle = function(req, res) {
    Feed.find({}, function(error, feed) {
        var result = null;
        feed.forEach(function(item){
            item.feedItems.forEach(function(feedItem){
                feedItem.articles.forEach(function(article){
                    if(article._id == req.params.id) {
                        result = article;
                    }
                });
            });
        });
        if(error) {
            res.send({err: "Error" })
        } else {
            res.send(result);
        }
    });
};


module.exports.removeFeed = function(req, res) {
    Feed.find({}, function(error, feeds) {
        var feedToRemove,
            feedIndex,
            feedCategory,
            feedCategoryIndex;

        for (var i = 0, feedsArr = feeds; i < feedsArr.length; i++) {
            for (var j = 0, feedItems = feedsArr[i].feedItems; j < feedItems.length; j++) {
                if (feedItems[j]._id == req.params.id) {
                    feedToRemove = feedItems[j];
                    feedIndex = j;
                    feedCategory = feedsArr[i];
                    feedCategoryIndex = i;
                }
            }
        }
        if (feedCategory.feedItems.length == 1) {
            feeds[feedCategoryIndex].remove();
        }
        else {
            feedCategory.feedItems[feedIndex].remove();
        }
        feedCategory.save(function (err) {
            if (err) throw err;
            res.send({
                status: 'removed'
            });
        });

    });
};
