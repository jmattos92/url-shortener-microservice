require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const urlModel = require('./url.schema.js');

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.post("/api/shorturl", (req, res) => {
  const { url } = req.body;
  const regex = /^https?:\/\/|^http?:\/\//i;

  if (!url.match(regex)) {
    res.json({ error: "invalid url" });
  } else {
    const shortUrl = Math.random().toString(32).substring(2, 5);
    const urlRes = new urlModel({
      originalUrl: url,
      shortenedUrl: shortUrl,
    }).save();
    
    res.json({
      original_url: url,
      short_url: shortUrl
    })
  };
});

app.get("/api/shorturl/:shortenedUrl", (req, res) => {
  const { shortenedUrl } = req.params;
  urlModel.findOne({ shortenedUrl })
  .select('originalUrl')
  .then(resUrl => {
    res.redirect(resUrl.originalUrl);
  })
  .catch(_e => {
    res.json({ error: 'invalid url' });
  });
});

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});