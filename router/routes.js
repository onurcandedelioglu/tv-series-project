const express = require('express');
const router = express.Router();
const appContreller = require('../controller/appController');

router.get('/index', appContreller.homePage);

router.get('/details', appContreller.detailsPage);

router.get('/search', appContreller.searchPage);

router.get('/api/series', appContreller.apiSeries);

router.get('/api/seriesid', appContreller.apiSeriesId);

router.get('/api/sort', appContreller.apiSeriesSort);

router.get('/api/season', appContreller.apiSeriesSeason);

router.get('/api/episode', appContreller.apiSeriesEpisode);

module.exports = router;