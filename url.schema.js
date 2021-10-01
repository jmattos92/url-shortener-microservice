const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema({
  originalUrl: String,
  shortenedUrl: String,
})

const urlModel = mongoose.model('urlModel', urlSchema);

module.exports = urlModel;