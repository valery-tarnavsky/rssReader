var mongoose   = require('mongoose'),
	fs         = require("fs"),
	FeedParser = require('feedparser'),
    request    = require('request'),
	Feed       = mongoose.model('Feed')/*,
    FeedItems  = mongoose.model('FeedItems')*/;


module.exports.getParsedFeed = function(req, res) {
	var parsedFeed = [];
    var req = request(req.body.url);
    var feedparser = new FeedParser({ normalize : true, addmeta: true  });

    req.on('error', function (error) {
        console.log('Feed xml req error')
    });

    req.on('response', function (res) {
        var stream = this;

        if (res.statusCode !== 200) {
            this.emit('error', new Error('Bad status code'));
        } else {
            stream.pipe(feedparser);
        }
    });

    feedparser.on('error', function (error) {
        console.log("FeedParser error");
    });

    feedparser.on('readable', function () {
        var stream = this,
        meta = this.meta,
        item;
        while (item = stream.read()) {
            parsedFeed.push(item);
            return parsedFeed;
        }
        res.send({
			feed: parsedFeed
        });
    });
};

module.exports.addFeed = function(req, res) {
    Feed.find({}, function(error, feeds) {

        var currentFeed = null;

        feeds.forEach(function (feed) {
            if (feed.category === req.body.category) {
                currentFeed = feed;
            }
        });

        if(currentFeed) {
            currentFeed.feedItems.push({
                title: req.body.title,
                entries: req.body.entries
            });
            currentFeed.save(function (err, feed) {
                if (err) { throw err; }
                res.json(feed);
            });
        }else {
            var feed = new Feed({
                 category: req.body.category
            });
            feed.feedItems.push({
                title: req.body.title,
                entries: req.body.entries
            });
            feed.save(function (err, feed) {
                if (err) {throw err;}
                res.json(feed);
            });
        }
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

module.exports.removeFeed = function(req, res) {
    Feed.findByIdAndRemove(req.body.id, function(err, user) {
        if (err) throw err;
        console.log(user);
    });
};
