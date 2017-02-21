var mongoose = require('mongoose'),
	express = require('express'),
	router = express.Router(),
	feedCtrl = require('../controllers/feeds');

router.post('/saveFeed', feedCtrl.saveFeed);
router.post('/updateFeeds', feedCtrl.updateFeeds);

router.get('/getAllFeeds', feedCtrl.getAllFeeds);
router.get('/getSingleArticle/:id', feedCtrl.getSingleArticle);

router.delete('/removeFeed/:id', feedCtrl.removeFeed);

module.exports = router;
