var mongoose = require('mongoose');

var entriesSchema = new mongoose.Schema({
   title    : { type: String},
   entries  : { type: Array }
});

module.exports = mongoose.model('Entries', entriesSchema);
