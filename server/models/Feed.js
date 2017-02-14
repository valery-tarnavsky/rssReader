var mongoose = require('mongoose');

/*var feedItemsEntriesSchema = new mongoose.Schema({
    _id  : { type: String},
    content: { type: String},
    date: { type: String},
    img: { type: String},
    link: { type: String},
    title: { type: String},
});*/

var feedItemsSchema = new mongoose.Schema({
    title     : String,
    entries   : {type : Array}
});

var feedSchema = new mongoose.Schema({
        category  : String,
        feedItems : [feedItemsSchema]
});

module.exports = mongoose.model('Feed', feedSchema);



