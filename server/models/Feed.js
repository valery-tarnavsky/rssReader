var mongoose = require('mongoose');

var feedArticlesSchema = new mongoose.Schema({
    content : { type: String},
    date    : { type: String},
    img     : { type: String},
    link    : { type: String},
    title   : { type: String}
});

var feedItemsSchema = new mongoose.Schema({
    rssLink  : String,
    title    : String,
    articles : [feedArticlesSchema]
});

var feedSchema = new mongoose.Schema({
    category  : String,
    feedItems : [feedItemsSchema]
});

module.exports = mongoose.model('Feed', feedSchema);



