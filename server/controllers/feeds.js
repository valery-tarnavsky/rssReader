var mongoose   = require('mongoose'),
	fs         = require("fs"),
	FeedParser = require('feedparser'),
    request    = require('request'),
	Feed       = mongoose.model('Feed');

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
        var foundCategory = null;
        var currentFeed;
        if(feeds) {
            feeds.forEach(function (feed) {
                feed.category.forEach(function (category) {
                    if (category.name === req.body.category) {
                        foundCategory = category;
                    }
                });
            });
            var feed = new Feed();
            if(foundCategory){

                    var query = {'category.name': req.body.category};
                    var newData = {
                        title : req.body.title,
                        entries : req.body.entries
                    };
                    Feed.findOneAndUpdate(query, newData, {upsert:true}, function(err, doc){
                        if (err) {
                            throw err;
                        }
                        console.log(doc);
                    });


         /*                      feeds.forEach(function(item){
         if(item.category.name == foundCategory){
                        console.log(item);
                        item.category.feeds.push({
                            title : req.body.title,
                            entries : req.body.entries
                        });
                    }
                })*/

            }else {

                feed.category.push({
                    name : req.body.category,
                    feeds: [{
                        title : req.body.title,
                        entries : req.body.entries
                    }]
                });
                feed.save(function (err, feed) {
                    if (err) {
                        throw err;
                    }
                    res.json(feed);

                });
            }




        }
    });
};



/*module.exports.addFeed = function(req, res) {
    Feed.findOne({title: req.body.title }, function(error, feed) {
        if(feed) {
            return res.send({
                feed: feed
            })
        } else {
            var feed = new Feed();
            feed.category = req.body.category;
            feed.title = req.body.title;
            feed.entries = req.body.entries;
            feed.markModified('entries');
            feed.save(function(err){
                if (err) {
                    throw err;
                }else{
                    res.json(feed);
                }
            });
        }
    });
};*/

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
