var mongoose = require('mongoose');

var feedSchema = new mongoose.Schema({
    category : [{
        name : {type: String},
        feeds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Entries'
        }]
    }]
});

module.exports = mongoose.model('Feed', feedSchema);
