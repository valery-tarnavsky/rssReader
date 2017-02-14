var mongoose = require('mongoose');


var feedItemsSchema = new mongoose.Schema({
   _feedId  : { type: Number, ref: 'Feed' },
   entries  : { type: Array }
});

module.exports = mongoose.model('FeedItems', feedItemsSchema);
